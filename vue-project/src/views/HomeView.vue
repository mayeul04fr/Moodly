<template>
  <div class="home-container">
    <MoodChart :moods="moods" />
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <button @click="goToDetails" class="details-button">Voir les graphiques de tous les utilisateurs</button>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MoodChart from '@/components/MoodChart.vue';

export default {
  components: {
    MoodChart,
  },
  setup() {
    const moods = ref([]);
    const errorMessage = ref('');
    const router = useRouter();

    const goToDetails = () => {
      router.push({ name: 'AllUsersDetails' });
    };

    const fetchMoods = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:1337/api/moods', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        moods.value = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des humeurs';
        console.error('Error fetching moods:', error);
      }
    };

    onMounted(fetchMoods);

    return {
      moods,
      errorMessage,
      goToDetails,
    };
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.error {
  color: red;
}

.details-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #7C86ED; /* Couleur de fond */
  color: white; /* Couleur du texte */
  border: none; /* Pas de bordure */
  border-radius: 5px; /* Coins arrondis */
  cursor: pointer; /* Curseur en forme de main au survol */
  font-size: 16px; /* Taille de la police */
  transition: background-color 0.3s, transform 0.2s; /* Effets de transition */
}

.details-button:hover {
  background-color: #F0A3B0; /* Couleur de fond au survol */
  transform: scale(1.05); /* Agrandissement léger au survol */
}

.details-button:focus {
  outline: none; /* Supprimer le contour par défaut lors du focus */
}
</style>