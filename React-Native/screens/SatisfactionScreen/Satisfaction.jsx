import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Satisfaction.style';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import SvgComponent from '../../assets/svg/star';
import LinearGradient from 'react-native-linear-gradient';
import SvgAttach from '../../assets/svg/attach-circle';
import SvgCross from '../../assets/svg/cross';

export default function SatisfactionScreen({ navigation }) {
  const [value, setValue] = useState(1);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setid] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [canSubmitData, setCanSubmitData] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const satisfactionPhrases = [
    'très insatisfait(e).',
    'insatisfait(e).',
    'plutôt satisfait(e).',
    'très satisfait(e).',
  ];

  const calculateTimeLeft = (lastSubmissionDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const lastDate = new Date(lastSubmissionDate);
    const currentDate = new Date();

    const timeDifference =
      lastDate.getTime() + 7 * oneDay - currentDate.getTime();
    return Math.max(0, Math.floor(timeDifference / 1000));
  };

  const checkCanSubmit = async () => {
    try {
      const lastSubmission = await AsyncStorage.getItem('lastSubmissionDate');
      if (lastSubmission) {
        const remainingTime = calculateTimeLeft(lastSubmission);

        if (remainingTime > 0) {
          setCanSubmitData(false);
          setTimeLeft(remainingTime);
          await AsyncStorage.setItem('remainingTime', remainingTime.toString());
        } else {
          setCanSubmitData(true);
          setTimeLeft(0);
          await AsyncStorage.removeItem('remainingTime');
        }
      } else {
        setCanSubmitData(true);
        setTimeLeft(0);
        await AsyncStorage.removeItem('remainingTime');
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la date d'envoi:",
        error,
      );
    }
  };

  const storeSubmissionDate = async () => {
    try {
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem('lastSubmissionDate', currentDate);
      await AsyncStorage.removeItem('remainingTime');
    } catch (error) {
      console.error('Erreur lors du stockage de la date de soumission:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Utilisateur non authentifié');
        return;
      }

      const response = await axios.get('http://localhost:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { username, email, id } = response.data;
      setUsername(username);
      setEmail(email);
      setid(id);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données utilisateur:',
        error,
      );
      Alert.alert(
        'Erreur',
        'Impossible de récupérer les informations utilisateur.',
      );
    }
  };

  const fetchMoodData = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Utilisateur non authentifié');
        return;
      }

      const response = await axios.get(
        `http://localhost:1337/api/moods?filters[users_permissions_user][id][$eq]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const moodsData = response.data.data;
      if (moodsData && moodsData.length > 0) {
        const { documentId } = moodsData[0];
        setDocumentId(documentId);
      } else {
        console.log("Aucune donnée d'humeur disponible");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'humeur:",
        error,
      );
      Alert.alert(
        'Erreur',
        "Impossible de récupérer les informations d'humeur.",
      );
    }
  };

  const updateStress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Utilisateur non authentifié');
        return;
      }

      await axios.post(
        'http://localhost:1337/api/moods',
        {
          data: {
            satisfaction: value,
            stress: 0,
            engagement: 0,
            efficacite: 0,
            users_permissions_user: id,
            date: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await storeSubmissionDate();
      Alert.alert('Succès', 'Votre niveau de satisfaction a été soumis.');
      checkCanSubmit();
    } catch (error) {
      if (error.response) {
        console.error('Erreur réponse du serveur:', error.response.data);
        Alert.alert('Erreur', `Erreur serveur: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Erreur lors de la requête:', error.request);
        Alert.alert('Erreur', 'Aucune réponse reçue du serveur.');
      } else {
        console.error('Erreur de configuration:', error.message);
        Alert.alert('Erreur', `Erreur de configuration: ${error.message}`);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUserData();
        if (id) {
          await fetchMoodData(id);
        }
        await checkCanSubmit();
        setLoading(false);
      };

      loadData();
    }, [id]),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 0) {
          return prevTimeLeft - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimeLeft = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / (24 * 60 * 60));
    const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const getJoursLabel = (days) => {
      return days > 1 ? 'jours' : 'jour';
    };
    const jours = getJoursLabel(days);

    const getHeuresLabel = (hours) => {
      return hours > 1 ? 'heures' : 'heure';
    };

    const heures = getHeuresLabel(hours);
    
    return `${days > 0 ? `${days} ${jours} ` : ''}${
      hours > 0 ? `${hours} ${heures} ` : ''
    }`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <Text>Chargement des données...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Pressable
        style={{ alignItems: 'flex-end' }}
        onPress={() => navigation.navigate('Home')}
      >
        <SvgCross />
      </Pressable>
      <View style={{ alignItems: 'center', gap: 50 }}>
        <SvgComponent style={{ marginTop: 60 }} />
        <Text style={styles.title}>
          Cette semaine, dans quelle mesure êtes-vous satisfait(e) de votre
          travail ?
        </Text>
        <View style={{ gap: 32, width: '90%' }}>
          <Text
            style={{
              color: '#A8A8A8',
              fontWeight: 'bold',
              fontSize: 26,
              textAlign: 'center',
              flexDirection: 'column',
              flexWrap: 'wrap',
              paddingHorizontal: 32,
            }}
          >
            Cette semaine je suis{' '}
            <Text style={{ color: '#000' }}>
              {satisfactionPhrases[value - 1]}
            </Text>
          </Text>
          <View style={{ alignContent: 'center', alignItems: 'center' }}>
            <View style={styles.sliderWrapper}>
              <View style={styles.sliderTrackContainer}>
                <View style={styles.sliderTrack} />
                <LinearGradient
                  colors={['#8891EC', '#EFD9AB']}
                  style={{
                    position: 'absolute',
                    height: 40,
                    width: `${((value - 1) / 3) * 100}%`,
                    borderRadius: 30,
                    top: -6,
                  }}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={4}
                  step={1}
                  value={value}
                  onValueChange={(val) => setValue(val)}
                  minimumTrackTintColor="transparent"
                  maximumTrackTintColor="transparent"
                  thumbTintColor="transparent"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: `${((value - 1) / 3) * 100}%`,
                    transform: [{ translateX: value >= 2 ? -38 : 0 }],
                    height: 36,
                    width: 36,
                    backgroundColor: '#FFF',
                    borderRadius: 30,
                    alignItems: 'center',
                    zIndex: 1,
                    borderWidth: 2,
                    borderColor: '#ECECEC',
                  }}
                />
              </View>
            </View>

            <View style={styles.stepsContainer}>
              {[1, 2, 3, 4].map((step) => (
                <Text key={step} style={styles.stepText}>
                  {step}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderWidth: 2,
          borderRadius: 22,
          paddingTop: 20,
          borderStyle: 'dashed',
          borderColor: '#E1E1E1',
          alignItems: 'center',
          marginBottom: 47,
        }}
      >
        <View style={{ position: 'absolute', top: -12 }}>
          <SvgAttach />
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: '#9DA3A3',
            width: screenWidth - 72,
          }}
        >
          Cette question mesure votre perception globale sur votre satisfaction
          professionnelle, capturant à la fois la satisfaction liée aux tâches,
          aux conditions de travail, et aux relations.
        </Text>
        <Pressable
          style={{
            backgroundColor: '#17161D',
            width: screenWidth - 72,
            height: 50,
            borderRadius: 22,
            justifyContent: 'center',
            marginTop: 10,
          }}
          onPress={canSubmitData ? updateStress : null}
          onPressOut={() => navigation.navigate('Home')}
          disabled={!canSubmitData}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {canSubmitData
              ? 'Enregistrer mon choix'
              : `Réessayer dans ${formatTimeLeft(timeLeft)}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
