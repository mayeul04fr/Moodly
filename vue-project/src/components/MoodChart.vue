<template>
  <h2 class="chart-title">Moyennes des humeurs de votre équipe</h2>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  props: {
    moods: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Fonction pour obtenir la semaine et l'année à partir d'une date
    const getWeekNumber = (date) => {
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return `${d.getUTCFullYear()}-Semaine-${weekNo}`; // Inclure l'année dans l'étiquette de la semaine
    };

    // Fonction pour trier les semaines dans l'ordre chronologique
    const sortWeeks = (weeks) => {
      return weeks.sort((a, b) => {
        const [yearA, , weekA] = a.split('-').map(str => parseInt(str, 10));
        const [yearB, , weekB] = b.split('-').map(str => parseInt(str, 10));
        return yearA === yearB ? weekA - weekB : yearA - yearB;
      });
    };

    // Calculer la moyenne des valeurs
    const calculateAverage = (data) => {
      if (data.length === 0) return 0;
      const total = data.reduce((sum, value) => sum + value, 0);
      return total / data.length;
    };

    const drawChart = () => {
      // Grouper les moods par semaine
      const moodsByWeek = props.moods.reduce((acc, mood) => {
        const moodDate = new Date(mood.date);
        const weekLabel = getWeekNumber(moodDate);
        if (!acc[weekLabel]) acc[weekLabel] = [];
        acc[weekLabel].push(mood);
        return acc;
      }, {});

      // Extraire et trier les semaines
      const weeks = sortWeeks(Object.keys(moodsByWeek));

      // Préparer les données par indicateur et par semaine
      const stressData = [];
      const efficaciteData = [];
      const engagementData = [];
      const satisfactionData = [];

      weeks.forEach((week) => {
        const moodsInWeek = moodsByWeek[week];
        stressData.push(
          calculateAverage(moodsInWeek.map((mood) => mood.stress))
        );
        efficaciteData.push(
          calculateAverage(moodsInWeek.map((mood) => mood.efficacite))
        );
        engagementData.push(
          calculateAverage(moodsInWeek.map((mood) => mood.engagement))
        );
        satisfactionData.push(
          calculateAverage(moodsInWeek.map((mood) => mood.satisfaction))
        );
      });

      // Détruire l'instance précédente du graphique s'il existe
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartCanvas.value.getContext("2d");

      // Créer le graphique en barres verticales
      chartInstance = new Chart(chartCanvas.value, {
        type: "bar",
        data: {
          labels: weeks,  // Afficher les semaines triées
          datasets: [
            {
              label: "Stress",
              data: stressData,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: "Efficacité",
              data: efficaciteData,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Engagement",
              data: engagementData,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Satisfaction",
              data: satisfactionData,
              backgroundColor: "rgba(153, 102, 255, 0.5)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
              },
              stacked: false,
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 4,
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "right",
              align: "center",
            },
          },
        },
      });
    };

    onMounted(drawChart);
    watch(() => props.moods, drawChart);

    return {
      chartCanvas,
    };
  },
};
</script>


<style scoped>
.chart-container {
  width: 50%;
  position: relative;
  border: 2px solid #D8DBF4; /* Bordure légère */
  border-radius: 8px; /* Coins arrondis */
  background: linear-gradient(135deg, #F4F4F9, #F2ECE6); /* Dégradé en diagonale */
  box-shadow: 0 2px 10px #0000001a; /* Ombre pour profondeur */
  padding: 20px;
}

.chart-title {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8em;
  color: #555;
  font-weight: normal;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  background-color: transparent;
}
</style>
