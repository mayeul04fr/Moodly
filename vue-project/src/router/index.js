import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/moods',
      name: 'moods',
      component: () => import('../views/EmployeeMoods.vue')  // Ajout de la route pour les moods
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')  // Page de Login
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')  // Page de Register
    },
    {
      path: '/createuser',
      name: 'createuser',
      component: () => import('../views/CreateUser.vue')  // Page de Register
    },
    {
      path: '/team-members/:teamId',
      name: 'TeamMembers',
      component: () => import('../views/TeamMembers.vue'),
      props: true
    },
    {
      path: '/details',
      name: 'AllUsersDetails',
      component: () => import('@/views/AllUsersDetails.vue') // Assurez-vous que le chemin est correct
    }
    
  ]
})

export default router