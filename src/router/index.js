import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login.vue";
import home from "@/views/Home.vue";
import signUp from "@/views/SignUp.vue";


const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: signUp
  },
  {
    path: '/home',
    name: 'Home',
    component: home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
