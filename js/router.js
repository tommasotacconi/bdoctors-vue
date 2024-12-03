import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/Login', component: LoginPage, name: 'Login' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }