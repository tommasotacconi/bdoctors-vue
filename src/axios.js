import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    }
});

// Interceptor per ottenere il CSRF token prima di ogni richiesta
instance.interceptors.request.use(async config => {
    // Escludi la richiesta del CSRF token stessa per evitare loop infiniti
    if (config.url.includes('sanctum/csrf-cookie')) {
        return config;
    }

    // Ottieni il CSRF token solo se non è già stato fatto
    if (!document.cookie.includes('XSRF-TOKEN')) {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
    }

    return config;
});

export default instance;