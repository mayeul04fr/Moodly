<template>
  <div id="all">
    <h1 id="titre">Graphiques des Moods de tous les utilisateurs</h1>
    <div v-for="(user, index) in usersMoods" :key="user.documentId" class="user-row">
      <h2 class="user-title">Utilisateur : {{ index + 1 }}</h2> <!-- Ajoutez la classe pour le style -->
      <!-- Ligne contenant tous les graphiques par semaine pour cet utilisateur -->
      <div class="charts-row">
        <div v-for="week in Object.keys(user.moodsByWeek)" :key="week" class="week-chart">
          <h3 class="week-title">{{ week }}</h3> <!-- Ajoutez la classe pour le style -->
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

    const fetchMoods = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/moods?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const moods = response.data.data;

        // Grouper les moods par utilisateur (utiliser uniquement documentId)
        const groupedMoods = moods.reduce((acc, mood) => {
          const documentId = mood.users_permissions_user.documentId;

          if (!acc[documentId]) acc[documentId] = { moods: [] };
          acc[documentId].moods.push(mood);
          return acc;
        }, {});

        // Convertir l'objet en tableau d'utilisateurs, en regroupant les moods par semaine
        usersMoods.value = Object.keys(groupedMoods).map(documentId => {
          const userMoods = groupedMoods[documentId].moods;
          const moodsByWeek = userMoods.reduce((acc, mood) => {
            const moodDate = new Date(mood.date);
            const weekLabel = getWeekNumber(moodDate);
            if (!acc[weekLabel]) acc[weekLabel] = [];
            acc[weekLabel].push(mood);
            return acc;
          }, {});

          return {
            documentId,  // Utilisation du documentId pour identifier l'utilisateur
            moodsByWeek
          };
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des moods :', error);
      }
    };

    const getWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-Semaine-${weekNo}`;
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
      await fetchMoods();
      usersMoods.value.forEach(user => {
        Object.keys(user.moodsByWeek).forEach(weekLabel => {
          drawWeekChart(user, weekLabel);
        });
      });
    });

    return {
      usersMoods,
      setWeekChartRef
    };
  }
};
</script>

<style scoped>
.user-row {
  margin-bottom: 50px;
}

.user-title {
  text-align: left; /* Aligner le titre à droite */
  margin-bottom: 10px; /* Espacement sous le titre */
  font-size: 1.3em; /* Taille du texte pour le titre */
}

.charts-row {
  display: flex; /* Aligne les graphiques en ligne */
  flex-wrap: wrap; /* Permet de les regrouper sur plusieurs lignes si nécessaire */
  gap: 20px; /* Espacement entre les graphiques */
}

.week-chart {
  flex: 1 0 200px; /* Définit la largeur minimum de chaque graphique */
}

.week-title {
  font-size: 0.9em; /* Réduit la taille de la police */
  text-decoration: underline; /* Souligne le nom de la semaine */
}

canvas {
  width: 100%;
  margin: auto;
}

#titre {
  text-align: left; /* Aligner le titre à droite */
  margin-bottom: 10px; /* Espacement sous le titre */
  font-size: 1.5em; /* Taille du texte pour le titre */
  text-decoration: underline; /* Souligner le texte */
}

#all {
  margin-top: 3%;
}
</style>
