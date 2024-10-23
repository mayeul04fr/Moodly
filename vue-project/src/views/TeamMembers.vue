<template>
  <div class="team-container">
    <h2 class="team-title">Membres de l'équipe</h2>
    <ul class="team-list">
      <li v-for="member in teamMembers" :key="member.id" class="team-member">{{ member.username }}</li>
    </ul>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const teamMembers = ref([]);
    const errorMessage = ref('');

    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Récupérer le token JWT
        const teamDocumentId = localStorage.getItem('teamDocumentId'); // Récupérer le documentId de l'équipe

        if (!teamDocumentId) {
          throw new Error("L'ID du document de l'équipe est introuvable.");
        }

        // Faire la requête pour récupérer les membres de l'équipe avec le documentId
        const response = await axios.get(`http://localhost:1337/api/teams/${teamDocumentId}?populate=users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        teamMembers.value = response.data.data.users; // Stocker les utilisateurs de l'équipe dans teamMembers
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des membres de l\'équipe : ' + error.message;
        console.error('Error fetching team members:', error);
      }
    };

    onMounted(fetchTeamMembers); // Récupérer les membres de l'équipe lors du montage

    return {
      teamMembers,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.team-container {
  max-width: 600px; /* Limite la largeur du conteneur */
  margin: 50px auto; /* Centre le conteneur horizontalement et ajoute un espacement vertical */
  padding: 20px; /* Espacement interne */
  border: 2px solid #D8DBF4; /* Bordure légère */
  border-radius: 8px; /* Coins arrondis */
  background: linear-gradient(135deg, #F4F4F9, #F2ECE6); /* Dégradé en diagonale */
  box-shadow: 0 2px 10px #0000001a; /* Ombre pour profondeur */
}

.team-title {
  text-align: center; /* Centrer le titre */
  font-size: 2em; /* Taille du titre */
  color: #333; /* Couleur sombre pour le titre */
  margin-bottom: 20px; /* Espacement sous le titre */
}

.team-list {
  list-style-type: none; /* Supprimer les puces par défaut */
  padding: 0; /* Enlever le padding par défaut de la liste */
}

.team-member {
  padding: 10px; /* Espacement autour des éléments de la liste */
  margin-bottom: 10px; /* Espacement entre les membres */
  background-color: #fff; /* Fond blanc pour chaque membre */
  border-radius: 5px; /* Coins légèrement arrondis */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Légère ombre pour chaque élément */
  transition: transform 0.3s ease; /* Transition douce pour l'effet au survol */
}


.error {
  color: red; /* Couleur rouge pour les messages d'erreur */
  text-align: center; /* Centrer le message d'erreur */
  margin-top: 20px; /* Espacement au-dessus du message d'erreur */
}
</style>
