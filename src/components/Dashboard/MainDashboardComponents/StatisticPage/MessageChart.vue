<script>
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
            data: {
                labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                datasets: [
                    {
                        data: [40, 20, 12],
                        backgroundColor: '#65B0FF',
                    }
                ],

            },
            options: {
                responsive: true
            }
        }
    },
    props: {
        messagesProfile: Array,
        required: true,
    }
}
</script>

<template>
    <div class="char">
        <Bar :data="data" :options="options" />
    </div>
</template>

<style scoped></style>