import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MailBox from '@/views/MailBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    { path: '/mail', name: 'mailbox', component: MailBox },
  ],
})

export default router
