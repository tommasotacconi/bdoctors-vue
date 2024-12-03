import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import Profile from '../src/pages/Profile.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/profile', component: Profile, name: 'profile' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }