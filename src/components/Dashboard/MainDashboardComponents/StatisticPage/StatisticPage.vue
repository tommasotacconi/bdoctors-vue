<script>
import axios from 'axios';
import MessageChart from './MessageChart.vue';
import { store } from '../../../../../js/store';
import ReviewsChart from './ReviewsChart.vue';
import VotesChart from './VotesChart.vue';

export default {
    data() {
        return {
            store,
            messagesApiUrl: 'http://localhost:8000/api/messages',
            messagesProfile: [],
            messagesFlag: true,
            reviewsFlag: false,
            votesFlag: false,
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
        ReviewsChart,
        VotesChart,
    },
    methods: {
        getMessagesChart() {
            this.messagesFlag = true
            this.reviewsFlag = false
            this.votesFlag = false
        },
        getReviewsChart() {
            this.messagesFlag = false
            this.reviewsFlag = true
            this.votesFlag = false
        },
        getVotesChart() {
            this.messagesFlag = false
            this.reviewsFlag = false
            this.votesFlag = true
        }
    },
    created() {
    },
}
</script>

<template>
    <main>
        <div class="container">
            <h2>Statistiche</h2>
            <div class="display-button">
                <button class="button-char" @click="getMessagesChart">Statistiche messaggi</button>
                <button class="button-char" @click="getReviewsChart">Statistiche recensioni</button>
                <button class="button-char" @click="getVotesChart">Statistiche voti</button>
            </div>
            <div class="component-chart">
                <MessageChart v-if="messagesFlag" />
                <ReviewsChart v-if="reviewsFlag" />
                <VotesChart v-if="votesFlag" />
            </div>
        </div>

    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}

.display-button {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 30px;
}

.button-char {
    background-color: var(--color-secondary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}
</style>