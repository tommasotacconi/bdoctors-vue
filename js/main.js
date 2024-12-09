import { createApp } from 'vue'
import App from '../src/App.vue'
import { router } from './router'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'

// Configure axios defaults before making requests
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/' // backend URL
axios.defaults.withXSRFToken = true

// Get CSRF cookie
await axios.get('sanctum/csrf-cookie')

// Create and mount Vue app
createApp(App).use(router).mount('#app')
