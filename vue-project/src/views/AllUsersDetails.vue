<template>
  <div id="all">
    <h1 id="titre">Moyennes des humeurs par employés (anonymisé)</h1>
    <div v-for="(user, index) in usersMoods" :key="user.documentId" class="user-row">
      <h2 class="user-title">Employé : {{ index + 1 }}</h2> 
      <div class="charts-row">
        <!-- Trier les semaines du plus ancien au plus récent -->
        <div v-for="week in sortedWeeks(user.moodsByWeek)" :key="week" class="week-chart">
          <h3 class="week-title">{{ week }}</h3> 
          <canvas :ref="setWeekChartRef(user.documentId, week)"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
  setup() {
    const usersMoods = ref([]);
    const weekCharts = ref({});
    const token = localStorage.getItem('authToken');
    const teamMembers = ref([]);
    const errorMessage = ref('');

    // Fonction pour mélanger les utilisateurs de manière aléatoire
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Fonction pour récupérer les membres de l'équipe
    const fetchTeamMembers = async () => {
      try {
        const teamDocumentId = localStorage.getItem('teamDocumentId');
        const response = await axios.get(`http://localhost:1337/api/teams/${teamDocumentId}?populate=users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        teamMembers.value = response.data.data.users.map(member => member.documentId); // Récupère seulement les documentId des membres
      } catch (error) {
        errorMessage.value = 'Erreur lors de la récupération des membres de l\'équipe : ' + error.message;
        console.error('Error fetching team members:', error);
      }
    };

    // Fonction pour récupérer les moods
    const fetchMoods = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/moods?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const moods = response.data.data;

        // Grouper les moods par utilisateur
        const groupedMoods = moods.reduce((acc, mood) => {
          const documentId = mood.users_permissions_user.documentId;

          if (!acc[documentId]) acc[documentId] = { moods: [] };
          acc[documentId].moods.push(mood);
          return acc;
        }, {});

        // Filtrer les utilisateurs par les membres de l'équipe et mélanger l'ordre des utilisateurs
        usersMoods.value = shuffleArray(
          Object.keys(groupedMoods)
            .filter(documentId => teamMembers.value.includes(documentId)) // Ne garder que les membres de l'équipe
            .map(documentId => {
              const userMoods = groupedMoods[documentId].moods;
              const moodsByWeek = userMoods.reduce((acc, mood) => {
                const moodDate = new Date(mood.date);
                const weekLabel = getWeekNumber(moodDate);
                if (!acc[weekLabel]) acc[weekLabel] = [];
                acc[weekLabel].push(mood);
                return acc;
              }, {});

              return {
                documentId,
                moodsByWeek
              };
            })
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des moods :', error);
      }
    };

    // Fonction utilitaire pour obtenir le numéro de semaine et trier les semaines
    const getWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-Semaine-${weekNo}`;
    };

    // Fonction pour trier les semaines par ordre chronologique
    const sortedWeeks = (moodsByWeek) => {
      return Object.keys(moodsByWeek).sort((a, b) => {
        const [yearA, , weekA] = a.split('-').map(str => parseInt(str, 10)); // Année et numéro de la semaine
        const [yearB, , weekB] = b.split('-').map(str => parseInt(str, 10)); // Année et numéro de la semaine

        if (yearA === yearB) {
          return weekA - weekB; // Si c'est la même année, on trie par numéro de semaine
        } else {
          return yearA - yearB; // Sinon on trie par année
        }
      });
    };

    const drawWeekChart = (user, weekLabel) => {
      const moodsInWeek = user.moodsByWeek[weekLabel];
      const stressData = moodsInWeek.reduce((sum, mood) => sum + mood.stress, 0) / moodsInWeek.length;
      const efficaciteData = moodsInWeek.reduce((sum, mood) => sum + mood.efficacite, 0) / moodsInWeek.length;
      const engagementData = moodsInWeek.reduce((sum, mood) => sum + mood.engagement, 0) / moodsInWeek.length;
      const satisfactionData = moodsInWeek.reduce((sum, mood) => sum + mood.satisfaction, 0) / moodsInWeek.length;

      const ctx = weekCharts.value[`${user.documentId}-${weekLabel}`].getContext('2d');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Stress', 'Efficacité', 'Engagement', 'Satisfaction'],
          datasets: [
            {
              label: weekLabel,
              data: [stressData, efficaciteData, engagementData, satisfactionData],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 4,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    };

    const setWeekChartRef = (documentId, weekLabel) => (el) => {
      if (el) {
        weekCharts.value[`${documentId}-${weekLabel}`] = el;
      }
    };

    onMounted(async () => {
      await fetchTeamMembers(); // Récupérer les membres de l'équipe d'abord
      await fetchMoods(); // Ensuite récupérer les moods
      usersMoods.value.forEach(user => {
        Object.keys(user.moodsByWeek).forEach(weekLabel => {
          drawWeekChart(user, weekLabel);
        });
      });
    });

    return {
      usersMoods,
      setWeekChartRef,
      sortedWeeks,
      errorMessage // Pour afficher d'éventuels messages d'erreur
    };
  }
};
</script>


<style scoped>
.user-row {
  margin-bottom: 50px;
}

.user-title {
  text-align: left; 
  margin-bottom: 10px; 
  font-size: 1.3em; 
}

.charts-row {
  display: flex; 
  flex-wrap: wrap; 
  gap: 20px; 
}

.week-chart {
  flex: 1 0 200px; 
}

.week-title {
  font-size: 0.9em; 
  text-decoration: underline; 
}

canvas {
  width: 100%;
  margin: auto;
}

#titre {
  text-align: left; 
  margin-bottom: 10px; 
  font-size: 1.5em; 
  text-decoration: underline; 
}

#all {
  margin-top: 3%;
}
</style>