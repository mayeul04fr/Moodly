<template>
  <div class="user-creation-container">
    <h2 class="user-creation-title">Créer un Nouvel Utilisateur</h2>
    <form @submit.prevent="createUser" class="user-creation-form">
      <div class="form-group">
        <label>Nom d'utilisateur :</label>
        <input v-model="username" type="text" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Email :</label>
        <input v-model="email" type="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Mot de passe :</label>
        <input v-model="password" type="password" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Équipe :</label>
        <select v-model="selectedTeam" required class="form-select">
          <option disabled value="">Sélectionnez une équipe</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Créer Utilisateur</button>
    </form>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Section pour afficher les informations de l'utilisateur créé -->
    <div v-if="newUserInfo" class="user-info">
      <h3>Informations à transmettre à votre nouvel employé :</h3>
      <!-- <p><strong>ID :</strong> {{ newUserInfo.id }}</p> -->
      <p><strong>Nom d'utilisateur :</strong> {{ newUserInfo.username }}</p>
      <p><strong>Email :</strong> {{ newUserInfo.email }}</p>
      <p><strong>Équipe :</strong> {{ newUserInfo.team }}</p> <!-- Affiche le nom de l'équipe -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const selectedTeam = ref('');
    const teams = ref([]);
    const message = ref('');
    const errorMessage = ref('');
    const newUserInfo = ref(null); // Référence pour stocker les informations du nouvel utilisateur
    const isLoading = ref(false); // Optionnel : état de chargement

    const fetchTeams = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:1337/api/teams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        teams.value = response.data.data; // Récupérer la liste des équipes
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des équipes : ' + error.response.data.error.message;
        console.error('Error fetching teams:', error);
      }
    };

    const createUser = async () => {
      isLoading.value = true;
      try {
        // Étape 1: Créer l'utilisateur sans l'équipe
        const response = await axios.post('http://localhost:1337/api/auth/local/register', {
          username: username.value,
          email: email.value,
          password: password.value,
        });

        const userId = response.data.user.id;
        if (!userId) {
          throw new Error("L'ID de l'utilisateur n'est pas disponible.");
        }

        // Étape 2: Associer l'utilisateur à l'équipe
        const token = localStorage.getItem('authToken');
        await axios.put(`http://localhost:1337/api/users/${userId}`, {
          team: selectedTeam.value,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Récupérer le nom de l'équipe associée à l'ID sélectionné
        const teamName = teams.value.find(team => team.id === selectedTeam.value)?.name || 'Équipe inconnue';

        message.value = 'Utilisateur créé avec succès et associé à l\'équipe !';

        // Stockez les informations du nouvel utilisateur avec le nom de l'équipe
        newUserInfo.value = {
          id: userId,
          username: username.value,
          email: email.value,
          team: teamName // Stocker le nom de l'équipe au lieu de l'ID
        };

        // Réinitialiser les champs
        username.value = '';
        email.value = '';
        password.value = '';
        selectedTeam.value = '';

      } catch (error) {
        errorMessage.value = 'Erreur lors de la création de l\'utilisateur : ' + error.response?.data?.error?.message || error.message;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchTeams); // Récupérer les équipes lors du montage

    return {
      username,
      email,
      password,
      selectedTeam,
      teams,
      message,
      errorMessage,
      newUserInfo, // Ajoutez cette ligne
      createUser,
    };
  },
};
</script>

<style scoped>
.user-creation-container {
  max-width: 600px; /* Limite la largeur du conteneur */
  margin: 50px auto; /* Centre le conteneur horizontalement et ajoute un espacement vertical */
  padding: 20px; /* Espacement interne */
  border: 2px solid #D8DBF4; /* Bordure légère */
  border-radius: 8px; /* Coins arrondis */
  background: linear-gradient(135deg, #F4F4F9, #F2ECE6); /* Dégradé en diagonale */
  box-shadow: 0 2px 10px #0000001a; /* Ombre pour profondeur */
}

.user-creation-title {
  text-align: center; /* Centrer le titre */
  font-size: 2em; /* Taille du titre */
  color: #333; /* Couleur sombre pour le titre */
  margin-bottom: 20px; /* Espacement sous le titre */
}

.form-group {
  margin-bottom: 15px; /* Espacement entre les groupes de champs */
}

.form-input, .form-select {
  width: 100%; /* Prendre toute la largeur */
  padding: 10px; /* Espacement interne */
  border: 1px solid #ccc; /* Bordure légère */
  border-radius: 4px; /* Coins arrondis pour les champs */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Ombre interne */
  transition: border-color 0.3s; /* Transition douce pour les bordures */
}

.form-input:focus, .form-select:focus {
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
  background-color: #0056b3; /* Couleur de fond au survol */
}

.success {
  color: green; /* Couleur verte pour le message de succès */
  text-align: center; /* Centrer le message de succès */
  margin-top: 20px; /* Espacement au-dessus du message de succès */
}

.error {
  color: red; /* Couleur rouge pour les messages d'erreur */
  text-align: center; /* Centrer le message d'erreur */
  margin-top: 20px; /* Espacement au-dessus du message d'erreur */
}

.user-info {
  margin-top: 20px; /* Espacement au-dessus de la section d'informations utilisateur */
  padding: 10px; /* Espacement interne */
  border: 1px solid #ccc; /* Bordure légère */
  border-radius: 5px; /* Coins arrondis */
  background-color: #f0f8ff; /* Fond léger pour séparer les informations de l'utilisateur */
}
h3{
  margin-bottom: 10px;
}
</style>
