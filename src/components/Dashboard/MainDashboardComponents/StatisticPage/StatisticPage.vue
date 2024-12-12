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
        }
    },
    components: {
        MessageChart,
    },
    methods: {
        getApiMessages() {
            axios.get(this.messagesApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data);
                    let messagesProfiles = response.data.messages
                    console.log(messagesProfiles)
                    let idProfile = store.profileDataGeneral.id
                    console.log(idProfile)

                    const messagesProfile = messagesProfiles.filter(message => message.profile_id === idProfile)
                    console.log(messagesProfile)
                    this.messagesProfile = messagesProfile
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },

        // Per controllare la data e l'ora dei messaggi e recensioni
        getNormalFormatHourDate(index) {
            // Fixed date
            let hourDate = this.messagesProfile[index].updated_at
            console.log(hourDate)
            const date = new Date(hourDate)

            // Così posso togliere i secondi
            const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Rome"
            };

            return date.toLocaleString("it-IT", options)
        }
    },
    created() {
        this.getApiMessages()
    },
}
</script>

<template>
    <main>
        <div class="container">
            <h2>Statistiche</h2>
            <MessageChart :messagesProfile="messagesProfile" />
        </div>

    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}
</style>