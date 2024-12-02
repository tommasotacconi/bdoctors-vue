import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }