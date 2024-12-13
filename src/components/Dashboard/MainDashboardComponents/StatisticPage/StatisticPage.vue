<script>
import axios from 'axios';
import MessageChart from './MessageChart.vue';
import { store } from '../../../../../js/store';

export default {
    data() {
        return {
            store,
            messagesApiUrl: 'http://localhost:8000/api/messages',
            messagesProfile: [],
            charData: {
                labels: [
                    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
                ],
                datasets: [
                    {
                        data: [
                            40, 20, 12, 15, 16, 10, 42, 34, 37, 25, 41, 5
                        ],
                        backgroundColor: '#65B0FF',
                    }
                ]
            }
        }
    },
    components: {
        MessageChart,
    },
    methods: {

    },
    created() {
        // this.getApiMessages()
    },
}
</script>

<template>
    <main>
        <div class="container">
            <h2>Statistiche</h2>
            <MessageChart />

        </div>

    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}
</style>