import { createApp } from 'vue'
import App from '../src/App.vue'
import { router } from './router'
import '../src/styles/general.scss';
import AppLoader from '../src/components/Generics/AppLoader.vue';

// Dynamically loads the Vue Devtools bridge *before* Vue starts
if (import.meta.env.DEV) {
    const script = document.createElement('script');
    script.src = 'http://localhost:8098';
    document.head.appendChild(script);
}
 
createApp(App).component('Loader', AppLoader).use(router).mount('#app')

// peffò commento a caso