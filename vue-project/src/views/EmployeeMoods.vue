<template>
  <div>
    <h1>Moods des employés</h1>
    <ul>
      <li v-for="mood in moods" :key="mood.id">
        <p><strong>Stress :</strong> {{ mood.stress }}</p>
        <p><strong>Efficacité :</strong> {{ mood.efficacite }}</p>
      </li>
    </ul>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const moods = ref([]);
    const errorMessage = ref('');

    const fetchMoods = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:1337/api/moods', { // Ajout de la population
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        moods.value = response.data.data; // Récupération des données
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des humeurs';
        console.error('Error fetching moods:', error);
      }
    };

    onMounted(fetchMoods);

    return {
      moods,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
