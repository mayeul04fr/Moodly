<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="register">
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
        <button type="submit">S'inscrire</button>
      </form>
      
      <!-- Affiche un message après l'inscription -->
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';  // Importation d'axios pour les requêtes HTTP
  
  export default {
    data() {
      return {
        username: '',  // Nom d'utilisateur
        email: '',     // Email
        password: '',  // Mot de passe
        message: '',   // Message de retour
      };
    },
    methods: {
      async register() {
        try {
          // Envoi des données d'inscription à l'API Strapi
          const response = await axios.post('http://localhost:1337/api/auth/local/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          });
          
          // Message de succès après une inscription réussie
          this.message = 'Inscription réussie. Confirmez votre email via le mail reçu.';
          console.log(response.data); // Log des données de réponse (token et infos utilisateur)
  
          // Optionnel : Redirection vers la page de connexion ou autre page après inscription
          // this.$router.push('/login');
        } catch (error) {
          // Gestion des erreurs
          this.message = 'Erreur lors de l\'inscription : ' + error.response.data.error.message;
          console.error(error); // Log de l'erreur pour le débogage
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles pour les messages d'erreur ou de succès */
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
  </style>
  