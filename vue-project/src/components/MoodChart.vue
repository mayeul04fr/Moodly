<template>
  <h2 class="chart-title">Analyse des humeurs par semaine</h2>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  props: {
    moods: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    // Fonction pour obtenir la semaine de l'année à partir d'une date
    const getWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return `Semaine-${weekNo}`;
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

      // Préparer les données par indicateur et par semaine
      const weeks = Object.keys(moodsByWeek);
      const stressData = [];
      const efficaciteData = [];
      const engagementData = [];
      const satisfactionData = [];

      weeks.forEach(week => {
        const moodsInWeek = moodsByWeek[week];
        stressData.push(calculateAverage(moodsInWeek.map(mood => mood.stress)));
        efficaciteData.push(calculateAverage(moodsInWeek.map(mood => mood.efficacite)));
        engagementData.push(calculateAverage(moodsInWeek.map(mood => mood.engagement)));
        satisfactionData.push(calculateAverage(moodsInWeek.map(mood => mood.satisfaction)));
      });

      // Détruire l'instance précédente du graphique s'il existe
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');

      // Créer un dégradé en diagonale
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
      gradient.addColorStop(0, '#F4F4F9');
      gradient.addColorStop(1, '#F2ECE6');

      // Plugin personnalisé pour dessiner le dégradé
      const gradientBackgroundPlugin = {
        id: 'customCanvasBackground',
        beforeDraw: (chart) => {
          const ctx = chart.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      };

      // Créer le graphique en barres verticales
      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels: weeks,
          datasets: [
            {
              label: 'Stress',
              data: stressData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Efficacité',
              data: efficaciteData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Engagement',
              data: engagementData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Satisfaction',
              data: satisfactionData,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0
              },
              stacked: false
            },
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
              display: true,
              position: 'right',
              align: 'center'
            }
          }
        },
        plugins: [gradientBackgroundPlugin] // Ajout du plugin ici
      });
    };

    onMounted(drawChart);
    watch(() => props.moods, drawChart);

    return {
      chartCanvas
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 50%;
  position: relative;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: rgba(240, 240, 240, 1);
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
}
</style>
