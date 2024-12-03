import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import Profile from '../src/pages/Profile.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'

const routes = [
    { path: '/', component: Homepage, name: 'homepage' },
    { path: '/profile', component: Profile, name: 'profile' },
    { path: '/profile/edit', component: ProfileEdit, name: 'profile-edit' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router }