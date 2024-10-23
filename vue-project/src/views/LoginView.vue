<template>
  <div class="login-container">
    <h2 class="login-title">Bienvenue sur Moodly !</h2>
    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-group">
        <label for="email">Email :</label>
        <input id="email" v-model="email" type="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input id="password" v-model="password" type="password" required class="form-input" />
      </div>
      <button type="submit" class="submit-button">Se connecter</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    const loginUser = async () => {
      try {
        const response = await axios.post('http://localhost:1337/api/auth/local', {
          identifier: email.value,
          password: password.value,
        });
        
        localStorage.setItem('authToken', response.data.jwt);
        localStorage.setItem('username', response.data.user.username);
        
        const userId = response.data.user.id;
        localStorage.setItem('userId', userId);

        const token = localStorage.getItem('authToken');

        const userResponse = await axios.get(`http://localhost:1337/api/users/${userId}?populate=team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = userResponse.data;

        if (userData.team) {
          localStorage.setItem('teamId', userData.team.id);
          localStorage.setItem('teamDocumentId', userData.team.documentId);
        } else {
          console.warn('Aucune équipe assignée à cet utilisateur.');
        }

        router.push('/');
      } catch (error) {
        if (error.response && error.response.data.message) {
          errorMessage.value = 'Erreur lors de la connexion : ' + error.response.data.message[0].messages[0].message;
        } else {
          errorMessage.value = 'Erreur lors de la connexion : ' + error.message;
        }
        console.error('Error during login:', error);
      }
    };

    return {
      email,
      password,
      errorMessage,
      loginUser,
    };
  },
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 2px solid #D8DBF4;
  border-radius: 8px;
  background: linear-gradient(135deg, #F4F4F9, #F2ECE6);
  box-shadow: 0 2px 10px #0000001a;
}

.login-title {
  text-align: center;
  background: linear-gradient(135deg, #7C86ED, #F0A3B0); /* Dégradé de couleur pour le texte */
  -webkit-background-clip: text;
  color: transparent; /* Utilisation de dégradé pour la couleur du texte */
  font-size: 28px; /* Taille de la police plus grande */
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  animation: fadeIn 1.5s ease-in-out; /* Animation d'apparition */
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px); /* Légère translation vers le haut */
  }
  100% {
    opacity: 1;
    transform: translateY(0); /* Retour à la position initiale */
  }
}

.login-subtitle {
  text-align: center;
  color: #555;
  font-size: 16px; /* Taille de la police réduite pour le paragraphe */
  margin-bottom: 20px; /* Espacement entre le titre et le formulaire */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #7C86ED;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #F0A3B0;
  transform: scale(1.05);
}

.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}
</style>
