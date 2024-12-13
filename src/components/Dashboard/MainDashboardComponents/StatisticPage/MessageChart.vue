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
                // labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                // datasets: [
                //     {
                //         data: [40, 20, 12],
                //         backgroundColor: '#65B0FF',
                //     }

                // ],

            },
            options: {
                responsive: true
            }
        }
    },
    methods: {
        getMessagesProfile() {
            let messagesProfile = this.messagesProfile
            console.log(messagesProfile[0].id)
            return messagesProfile[0].id
        }
    },
    // props: {
    //     messagesProfile: {
    //         type: Array,
    //         required: true
    //     },
    //     charData: {
    //         type: Object,
    //         required: true
    //     }
    // },
}
</script>

<template>
    <div class="char">
        <Bar :data="store.charData" :options="options" />
    </div>
    {{ console.log(store.charData) }}
    {{ console.log(store.test) }}

</template>

<style scoped></style>