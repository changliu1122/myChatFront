import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login.vue";
import home from "@/views/Home.vue";
import signUp from "@/views/SignUp.vue";
import chat from "@/views/chat.vue";
import contact from "@/views/contact.vue";
import explore from "@/views/explore.vue";
import setting from "@/views/setting.vue";
import contactInfo from "@/views/contactInfo.vue";
import testpage from "@/views/testpage.vue";


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
    component: home,
    children:[
      {
        path: '/chat',
        name: 'chat',
        component: chat
      },
      {
        path: '/contact',
        name: 'contact',
        component: contact,

      },
      {
        path: '/explore',
        name: 'explore',
        component: explore
      },
      {
        path: '/setting',
        name: 'setting',
        component: setting
      },
    ]
  },
  {
    path:'/test',
    name: 'test',
    component: testpage
  },
  {
  path: '/contactInfo',
  name: 'contactInfo',
  component: contactInfo
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
