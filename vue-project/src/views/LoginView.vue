<template>
  <div class="login-container">
    <h2 class="login-title">Connexion</h2>
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
  width: 400px; /* Largeur fixe pour un aspect propre */
  margin: auto; /* Centrer le conteneur */
  padding: 20px; /* Espacement interne */
  border: 2px solid #D8DBF4; /* Bordure légère */
  border-radius: 8px; /* Coins arrondis */
  background: linear-gradient(135deg, #F4F4F9, #F2ECE6); /* Dégradé en diagonale */
  box-shadow: 0 2px 10px #0000001a; /* Ombre pour profondeur */
}

.login-title {
  text-align: center; /* Centrer le titre */
  color: #333; /* Couleur sombre pour le titre */
  margin-bottom: 20px; /* Espacement sous le titre */
}

.form-group {
  margin-bottom: 15px; /* Espacement entre les groupes de champs */
}

label {
  display: block; /* Étiquettes en bloc pour occupation de l'espace complet */
  margin-bottom: 5px; /* Espacement sous l'étiquette */
  font-weight: bold; /* Étiquettes en gras */
  color: #555; /* Couleur des étiquettes */
}

.form-input {
  width: 100%; /* Prendre toute la largeur */
  padding: 10px; /* Espacement interne */
  border: 1px solid #ccc; /* Bordure légère */
  border-radius: 4px; /* Coins arrondis pour les champs */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Ombre interne */
  transition: border-color 0.3s; /* Transition douce pour les bordures */
}

.form-input:focus {
  border-color: #007bff; /* Couleur de bordure au focus */
  outline: none; /* Pas de contour par défaut */
}

.submit-button {
  width: 100%; /* Prendre toute la largeur */
  padding: 10px; /* Espacement interne */
  border: none; /* Pas de bordure */
  border-radius: 4px; /* Coins arrondis */
  background-color: #7C86ED; /* Couleur de fond du bouton */
  color: white; /* Couleur du texte */
  font-size: 16px; /* Taille du texte */
  cursor: pointer; /* Curseur pointeur pour le bouton */
  transition: background-color 0.3s; /* Transition douce pour la couleur de fond */
}

.submit-button:hover {
  background-color: #F0A3B0; /* Couleur de fond au survol */
  transform: scale(1.05); /* Agrandissement léger au survol */
}

.error {
  color: red; /* Couleur rouge pour les messages d'erreur */
  text-align: center; /* Centrer le message d'erreur */
  margin-top: 15px; /* Espacement au-dessus du message d'erreur */
}
</style>
