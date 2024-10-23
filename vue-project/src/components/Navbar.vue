<template>
  <nav class="navbar">
    <!-- Section gauche : Bonjour Username -->
    <div v-if="isLoggedIn" class="navbar-left">
      <router-link to="/" class="nav-link">Bonjour {{ username }}</router-link>
    </div>

    <!-- Section droite : Voir mon équipe et Créer un utilisateur -->
    <div v-if="isLoggedIn && teamId" class="navbar-right">
      <router-link :to="{ name: 'TeamMembers', params: { teamId } }" class="nav-link">Voir mon équipe</router-link>
      <router-link to="/createuser" class="nav-link">Créer un Utilisateur</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('username'), // Récupère le nom stocké dans le localStorage
      teamId: localStorage.getItem('teamId'), // Récupère l'ID de l'équipe stocké dans le localStorage
    };
  },
  computed: {
    // Vérifie si l'utilisateur est connecté en cherchant un token d'authentification
    isLoggedIn() {
      return !!localStorage.getItem('authToken');
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff; /* Fond blanc pour la navbar */
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0; /* Bordure douce en bas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère pour donner de la profondeur */
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right {
  gap: 1.5rem; /* Espacement entre les liens à droite */
}

.nav-link {
  color: #7C86ED; /* Couleur pour les liens */
  text-decoration: none;
  font-weight: 500; /* Poids de police un peu plus léger */
  font-size: 1rem; /* Taille de police adaptée */
  transition: text-decoration 0.3s ease; /* Transition pour le soulignement */
}

.nav-link:hover {
  text-decoration: underline; /* Ajouter un soulignement au survol */
}

/* Si vous souhaitez ajouter un style supplémentaire pour les éléments actifs */
.nav-link.active {
  border-bottom: 2px solid #7C86ED; /* Souligner le lien actif */
  padding-bottom: 4px; /* Un peu d'espace sous le lien */
}
</style>
