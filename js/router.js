import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'
import Dashboard from '../src/pages/Dashboard.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/Login', component: LoginPage, name: 'Login' },
    { path: '/user/:id', component: Dashboard, name: 'dashboard' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }