import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Home.style';
import { useFocusEffect } from '@react-navigation/native';
import SvgHorloge from '../../assets/svg/horloge';
import SvgCheck from '../../assets/svg/check';
import SvgLogout from '../../assets/svg/logout';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);
  const [remainingTimeStress, setRemainingTimeStress] = useState(null);
  const [remainingTimeEngagement, setRemainingTimeEngagement] = useState(null);
  const [remainingTimeEfficacity, setRemainingTimeEfficacity] = useState(null);

  const quotes = [
    "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez. – Albert Schweitzer",
    "Le plus grand échec est de ne pas avoir le courage d'oser. – Abbé Pierre",
    "Le seul moyen de faire du bon travail, c'est d'aimer ce que vous faites. – Steve Jobs",
    "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre. – Albert Einstein",
    'Les petites opportunités sont souvent le début de grandes entreprises. – Démosthène',
    'Ne regardez pas en arrière avec colère, ni en avant avec peur, mais autour de vous avec conscience. – James Thurber',
    "Le meilleur moyen de prédire l'avenir, c'est de le créer. – Peter Drucker",
    "Il n'est jamais trop tard pour devenir ce que vous auriez pu être. – George Eliot",
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const screenWidth = Dimensions.get('window').width;

  const fetchRemainingTime = async () => {
    try {
      const time = await AsyncStorage.getItem('remainingTime');
      const timeStress = await AsyncStorage.getItem('remainingTimeStress');
      const timeEngagement = await AsyncStorage.getItem(
        'remainingTimeEngagement',
      );
      const timeEfficacity = await AsyncStorage.getItem(
        'remainingTimeEfficacity',
      );
      if (time !== null) {
        setRemainingTime(JSON.parse(time));
        setRemainingTimeStress(JSON.parse(timeStress));
        setRemainingTimeEngagement(JSON.parse(timeEngagement));
        setRemainingTimeEfficacity(JSON.parse(timeEfficacity));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du temps restant:', error);
    }
  };

  useFocusEffect(() => {
    fetchRemainingTime();
  });

  const weekDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);

    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - diff);

    const dates = [];
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options).split(' ');
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
      setId(id);
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

  const weekDates = weekDate();

  const disconnect = () => {
    AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, []),
  );

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const randomQuote = getRandomQuote();

  return (
    <LinearGradient
      colors={['#7C86ED', '#F0A3B0']}
      style={styles.linearGradient}
      start={{ x: -0.5, y: 0 }}
      end={{ x: 0, y: 0.5 }}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <Pressable
          style={{
            backgroundColor: '#FFFFFF',
            padding: 10,
            borderRadius: 100,
            flexDirection: 'row',
            gap: 8,
            marginTop: 18,
          }}
          onPress={clearAsyncStorage}
        >
          <SvgLogout />
          <Text style={{ color: '#C25146', fontSize: 14, fontWeight: '800' }}>
            se déconnecter
          </Text>
        </Pressable>
        <StatusBar style="auto" />

        <View style={styles.bottomSheet}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 24,
              fontSize: 26,
            }}
          >
            Bonjour {username} !
          </Text>

          <Text
            style={{
              color: '#9DA3A3',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
              marginTop: 10,
            }}
          >
            {`Semaine ${weekDates[0].getDate()}-${weekDates[weekDates.length - 1].getDate()} ${weekDates[0].toLocaleString('fr-FR', { month: 'long' })}`}
          </Text>
          <View
            style={{
              color: '#CACBCB',
              fontWeight: 'bold',
              textAlign: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 32,
              marginTop: 24,
            }}
          >
            {weekDates.map((date) => {
              const [month, day] = formatDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <View
                  key={date.toISOString()}
                  style={{
                    alignItems: 'center',
                    borderWidth: isToday ? 1 : 0,
                    borderColor: isToday ? '#EBEBEB' : 'transparent',
                    borderRadius: 5,
                    padding: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ color: '#9DA3A3' }}>{month}</Text>
                  <Text style={{ color: '#9DA3A3' }}>{day}</Text>
                </View>
              );
            })}
          </View>

          <View
            style={{ height: 2, backgroundColor: '#ECECEC', marginTop: 28 }}
          />

          {remainingTime > 0 &&
          remainingTimeStress > 0 &&
          remainingTimeEngagement > 0 &&
          remainingTimeEfficacity > 0 ? (
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: screenWidth - 64,
                paddingBottom: 50,
                height: 510,
                gap: 32,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: '600' }}>
                Merci d'avoir répondu !
              </Text>
              <Text
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  fontSize: 16,
                  fontWeight: '400',
                }}
              >
                {randomQuote}
              </Text>
            </View>
          ) : (
            <View style={{ gap: 16, marginTop: 33 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('Satisfaction')}
                >
                  <LinearGradient
                    colors={['#F4F4F9', '#F8F4F4']}
                    style={{
                      width: 160,
                      height: 185,
                      textAlign: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: '#D8DBF4',
                      gap: 8,
                    }}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 0, y: 3 }}
                  >
                    {remainingTime > 0 ? <SvgCheck /> : <SvgHorloge />}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        paddingHorizontal: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Satisfaction au travail
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Stress')}>
                  <LinearGradient
                    colors={['#F3F3F9', '#F9F7F5']}
                    style={{
                      width: 160,
                      height: 185,
                      textAlign: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: '#D8DBF4',
                      gap: 8,
                    }}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 0, y: 3 }}
                  >
                    {remainingTimeStress > 0 ? <SvgCheck /> : <SvgHorloge />}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        paddingHorizontal: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Stress perçu
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('Engagement')}
                >
                  <LinearGradient
                    colors={['#F3F3F9', '#F5F9F5']}
                    style={{
                      width: 160,
                      height: 185,
                      textAlign: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: '#D8DBF4',
                      gap: 8,
                    }}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 0, y: 3 }}
                  >
                    {remainingTimeEngagement > 0 ? (
                      <SvgCheck />
                    ) : (
                      <SvgHorloge />
                    )}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        paddingHorizontal: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Engagement personnel
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Efficacity')}
                >
                  <LinearGradient
                    colors={['#F3F3F9', '#F8F5F7']}
                    style={{
                      width: 160,
                      height: 185,
                      textAlign: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 16,
                      borderWidth: 1.5,
                      borderColor: '#D8DBF4',
                      gap: 8,
                    }}
                    start={{ x: -0.5, y: 0 }}
                    end={{ x: 0, y: 3 }}
                  >
                    {remainingTimeEfficacity > 0 ? (
                      <SvgCheck />
                    ) : (
                      <SvgHorloge />
                    )}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        paddingHorizontal: 25,
                        fontWeight: 'bold',
                      }}
                    >
                      Sentiment d'efficacité
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
