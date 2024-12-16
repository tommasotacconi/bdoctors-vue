import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../src/pages/Homepage.vue'
import LoginPage from '../src/pages/LoginPage.vue'
import RegisterPage from '../src/pages/RegisterPage.vue'
import Dashboard from '../src/pages/Dashboard.vue'
import ProfileEdit from '../src/pages/ProfileEdit.vue'
import Createpage from '../src/pages/Createpage.vue'
import AdvancedSearch from '../src/pages/AdvancedSearch.vue'
import DoctorShow from '../src/components/Search/DoctorShow.vue'
import PaymentSuccess from '../src/pages/PaymentSuccess.vue'
import { store } from './store.js';

const routes = [
  { path: '/', component: Homepage, name: 'homepage' },
  { path: '/user/login', component: LoginPage, name: 'login' },
  { path: '/user/register', component: RegisterPage, name: 'register' },
  { path: '/user/:id', component: Dashboard, name: 'dashboard' },
  { path: '/user/:id/edit', component: ProfileEdit, name: 'edit' },
  { path: '/user/:id/create', component: Createpage, name: 'create' },
  // Path to all doctors with selected specialization id  
  // { path: '/search/:searchId', component: AdvancedSearch, name: 'search' },
  // // Path to doctor, within specialization id, of doctord id selected (first id for specialization
  // // second for doctor)
  { path: '/search/:searchId/:inputRating?/:inputReviews?', component: AdvancedSearch, name: 'search' },
  // Path to doctor, within specialization id, of doctord id selected (first id for specialization
  // second for doctor)
  { path: '/search/:searchId/:id', component: DoctorShow, name: 'search.show' },
  { path: '/payment-success', component: PaymentSuccess, name: 'payment-success', params: { id: store.userId } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }