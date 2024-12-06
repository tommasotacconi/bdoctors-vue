import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'
import RegisterPage from '../src/pages/RegisterPage.vue'
import Dashboard from '../src/pages/Dashboard.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'
import Createpage from '../src/pages/Createpage.vue'
import AdvancedSearch from '../src/pages/AdvancedSearch.vue'

import axios from 'axios'
import { store } from './store'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/user/login', component: LoginPage, name: 'login' },
    {
        path: '/user/register', component: RegisterPage, name: 'register',
    },
    {
        path: '/user/:id',
        component: Dashboard,
        name: 'dashboard'

        // Da capire se funziona
        // beforeEnter(to, from, next) {
        //     let status = store.responseStatus

        //     if (from.status === true) {
        //         next();
        //     } else {
        //         next({ name: 'login' });
        //     }
        // }
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