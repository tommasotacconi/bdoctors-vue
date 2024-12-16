<script>
import { store } from '../../../../../js/store.js';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    name: 'App',
    components: {
        Bar
    },
    data() {
        return {
            store,
            data: {
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        }
    },
    methods: {

    },
}
</script>

<template>
    <h4>Recensioni ricevute <span class="total-year">(Totale anno: {{ store.reviewsProfile.length }})</span>
    </h4>
    <div class="char">
        <Bar :data="store.charDataReviews" :options="options" />
    </div>
</template>

<style scoped>
h4 {
    text-align: center;
    margin-bottom: 20px;
}

.total-year {
    opacity: 0.8;
    font-style: italic;
}
</style>