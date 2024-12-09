import { createApp } from 'vue'
import App from '../src/App.vue'
import { router } from './router'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'

await axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000/' // il tuo backend URL
axios.defaults.withXSRFToken = true;

createApp(App).use(router).mount('#app')
