import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import Dashboard from '../src/pages/Dashboard.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/user/:id', component: Dashboard, name: 'dashboard' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }