import { createApp } from 'vue'
import App from '../src/App.vue'
import { router } from './router'
import 'bootstrap/dist/css/bootstrap.css';
import AppLoader from '../src/components/Generics/AppLoader.vue';

createApp(App).component('Loader', AppLoader).use(router).mount('#app')

// peffò commento a caso