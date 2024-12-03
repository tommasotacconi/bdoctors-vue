import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/user/:id/profile-edit', component: ProfileEdit, name: 'profile-edit' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }