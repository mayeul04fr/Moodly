import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import axios from 'axios';
import background from '../../assets/background.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Login.style';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:1337/api/auth/local',
        {
          identifier: email,
          password: password,
        },
      );

      if (response.data.jwt) {
        Alert.alert('Succès', 'Connexion réussie !');
        await AsyncStorage.setItem('userToken', response.data.jwt);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error);
      Alert.alert('Erreur', 'Connexion échouée. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeAreaView}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <StatusBar style="auto" />
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Bonjour, connecte toi et rejoins ton entreprise !
            </Text>
            <Text style={styles.subHeaderText}>
              Cela prendra moins d’une minute...
            </Text>
          </View>

          <LinearGradient
            colors={['#F3F3F8', '#F8F4F4']}
            style={styles.linearGradient}
            start={{ x: -0.5, y: 0 }}
            end={{ x: 0, y: 0.5 }}
          >
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9DA3A3"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9DA3A3"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Connexion...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
