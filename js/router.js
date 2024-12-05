import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'
import RegisterPage from '../src/pages/RegisterPage.vue'
import Dashboard from '../src/pages/Dashboard.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/user/login', component: LoginPage, name: 'login' },
    { path: '/user/register', component: RegisterPage, name: 'register' },
    { path: '/user/:id', component: Dashboard, name: 'dashboard' },
    { path: '/user/:id/profile-edit', component: ProfileEdit, name: 'profile-edit' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }