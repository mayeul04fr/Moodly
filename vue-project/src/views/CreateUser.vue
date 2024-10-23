<template>
  <div>
    <h2>Créer un Nouvel Utilisateur</h2>
    <form @submit.prevent="createUser">
      <div>
        <label>Nom d'utilisateur :</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Email :</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Mot de passe :</label>
        <input v-model="password" type="password" required />
      </div>
      <div>
        <label>Équipe :</label>
        <select v-model="selectedTeam" required>
          <option disabled value="">Sélectionnez une équipe</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>
      <button type="submit">Créer Utilisateur</button>
    </form>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Section pour afficher les informations de l'utilisateur créé -->
    <div v-if="newUserInfo" class="user-info">
      <h3>Informations de l'utilisateur créé :</h3>
      <p><strong>ID :</strong> {{ newUserInfo.id }}</p>
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
.success {
  color: green;
}
.error {
  color: red;
}
.user-info {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>