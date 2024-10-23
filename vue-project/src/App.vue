<template>
  <div id="app">
    <!-- Ne pas afficher la navbar si la route actuelle est 'login' -->
    <Navbar v-if="showNavbar" />
    <RouterView />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // Importer useRoute pour accéder à la route actuelle
import Navbar from './components/Navbar.vue'; // Ajustez le chemin si nécessaire

export default {
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const showNavbar = ref(true); // Utiliser une référence réactive pour la navbar

    // Fonction pour déterminer si la Navbar doit être affichée
    const checkNavbarVisibility = () => {
      showNavbar.value = route.path !== '/login'; // Ajuster selon la route de login
    };

    // Initialiser l'état de la Navbar lors du montage
    checkNavbarVisibility();

    // Watch pour détecter les changements de route
    watch(
      () => route.path,
      () => {
        checkNavbarVisibility(); // Re-vérifier si la Navbar doit être affichée
      }
    );

    return {
      showNavbar,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
