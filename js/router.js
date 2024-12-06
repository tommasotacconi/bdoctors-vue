import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'
import RegisterPage from '../src/pages/RegisterPage.vue'
import Dashboard from '../src/pages/Dashboard.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'
import Createpage from '../src/pages/Createpage.vue'
import AdvancedSearch from '../src/pages/AdvancedSearch.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/user/login', component: LoginPage, name: 'login' },
    {
        path: '/user/register', component: RegisterPage, name: 'register',
    },
    {
        path: '/user/:id',
        component: Dashboard,
        name: 'dashboard',
        beforeEnter(to, from, next) {
            if (from.name === 'dashboard') {
                next();
            } else {
                next({ name: 'homepage' });
            }
        }
    },
    { path: '/user/:id/edit', component: ProfileEdit, name: 'edit' },
    { path: '/user/:id/create', component: Createpage, name: 'create' },
    { path: '/search/:id', component: AdvancedSearch, name: 'search' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }