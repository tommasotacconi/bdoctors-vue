<script>
import { store } from '../../js/store.js';
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            store
        }
    }
}
</script>

<template>
    <div class="success-container">
        <div class="success-content">
            <i class="fa-solid fa-circle-check success-icon"></i>
            <h1>Pagamento completato con successo!</h1>
            <p>Il tuo profilo è stato sponsorizzato.</p>
            <RouterLink :to="{ name: 'dashboard', params: { id: store.userId } }" class="back-button">
                Torna alla Dashboard
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.success-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.success-content {
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.success-icon {
    font-size: 4rem;
    color: #4CAF50;
    margin-bottom: 1rem;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
}

.back-button {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.back-button:hover {
    background-color: #45a049;
}
</style>
