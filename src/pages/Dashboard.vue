<script>
import HeaderDashboard from '../components/Dashboard/HeaderDashboard.vue';
import MainDashboard from '../components/Dashboard/MainDashboard.vue';
import SidebarDashboard from '../components/Dashboard/SidebarDashboard.vue';
import axios from 'axios';
import { store } from '../../js/store.js';

export default {
    data() {
        return {
            store,
            messagesApiUrl: 'http://localhost:8000/api/messages',
            reviewsApiUrl: 'http://localhost:8000/api/reviews',

            messagesProfile: [],
            reviewsProfile: [],

        }
    },
    methods: {
        getApiMessages() {
            axios.get(this.messagesApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data);
                    let messagesProfiles = response.data.messages
                    console.log(messagesProfiles)
                    // let idProfile = store.profileDataGeneral.id
                    let idProfile = this.$route.params.id
                    console.log(idProfile)
                    console.log(this.$route.params.id)

                    const messagesProfile = messagesProfiles.filter(message => message.profile_id == idProfile)
                    console.log(messagesProfile)

                    // Trasformo il valore updated_at in una data leggibile facilmente in modo da riprenderla successivamente
                    messagesProfile.forEach(message => {
                        let hourDate = message.updated_at
                        console.log(hourDate)
                        const date = new Date(hourDate)

                        const options = {
                            year: "numeric",
                            month: "2-digit",
                        };

                        message.updated_at = date.toLocaleString("it-IT", options)
                    })
                    console.log(messagesProfile)
                    store.messagesProfile = messagesProfile

                    // Parte relativa alla creazione della statistisca dinamica
                    const messagesProfileJanuary = messagesProfile.filter(message => message.updated_at.startsWith('01/'));
                    const messagesProfileFebruary = messagesProfile.filter(message => message.updated_at.startsWith('02/'));
                    const messagesProfileMarch = messagesProfile.filter(message => message.updated_at.startsWith('03/'));
                    const messagesProfileApril = messagesProfile.filter(message => message.updated_at.startsWith('04/'));
                    const messagesProfileMay = messagesProfile.filter(message => message.updated_at.startsWith('05/'));
                    const messagesProfileJune = messagesProfile.filter(message => message.updated_at.startsWith('06/'));
                    const messagesProfileJuly = messagesProfile.filter(message => message.updated_at.startsWith('07/'));
                    const messagesProfileAugust = messagesProfile.filter(message => message.updated_at.startsWith('08/'));
                    const messagesProfileSeptember = messagesProfile.filter(message => message.updated_at.startsWith('09/'));
                    const messagesProfileOctober = messagesProfile.filter(message => message.updated_at.startsWith('10/'));
                    const messagesProfileNovember = messagesProfile.filter(message => message.updated_at.startsWith('11/'));
                    const messagesProfileDecember = messagesProfile.filter(message => message.updated_at.startsWith('12/'));


                    store.charData = {
                        labels: [
                            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
                        ],
                        datasets: [
                            {
                                data: [
                                    messagesProfileJanuary.length, messagesProfileFebruary.length, messagesProfileMarch.length, messagesProfileApril.length, messagesProfileMay.length, messagesProfileJune.length, messagesProfileJuly.length, messagesProfileAugust.length, messagesProfileSeptember.length, messagesProfileOctober.length, messagesProfileNovember.length, messagesProfileDecember.length
                                ],
                                backgroundColor: '#65B0FF',
                                // qui si può inserire il label
                                // label: 'test'
                            }
                        ]
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },

        getApiReviews() {
            axios.get(this.reviewsApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data);
                    let reviewsProfiles = response.data.reviews
                    console.log(reviewsProfiles[0].profile_id)
                    // let idProfile = store.profileDataGeneral.id
                    let idProfile = this.$route.params.id
                    console.log(idProfile)
                    console.log(this.$route.params.id)

                    const reviewsProfile = reviewsProfiles.filter(review => review.profile_id == idProfile)
                    console.log(reviewsProfile)

                    // Trasformo il valore updated_at in una data leggibile facilmente in modo da riprenderla successivamente
                    reviewsProfile.forEach(message => {
                        let hourDate = message.updated_at
                        console.log(hourDate)
                        const date = new Date(hourDate)

                        const options = {
                            year: "numeric",
                            month: "2-digit",
                        };

                        message.updated_at = date.toLocaleString("it-IT", options)
                    })
                    console.log(reviewsProfile)
                    store.reviewsProfile = reviewsProfile

                    // Parte relativa alla creazione della statistisca dinamica
                    const reviewsProfileJanuary = reviewsProfile.filter(message => message.updated_at.startsWith('01/'));
                    const reviewsProfileFebruary = reviewsProfile.filter(message => message.updated_at.startsWith('02/'));
                    const reviewsProfileMarch = reviewsProfile.filter(message => message.updated_at.startsWith('03/'));
                    const reviewsProfileApril = reviewsProfile.filter(message => message.updated_at.startsWith('04/'));
                    const reviewsProfileMay = reviewsProfile.filter(message => message.updated_at.startsWith('05/'));
                    const reviewsProfileJune = reviewsProfile.filter(message => message.updated_at.startsWith('06/'));
                    const reviewsProfileJuly = reviewsProfile.filter(message => message.updated_at.startsWith('07/'));
                    const reviewsProfileAugust = reviewsProfile.filter(message => message.updated_at.startsWith('08/'));
                    const reviewsProfileSeptember = reviewsProfile.filter(message => message.updated_at.startsWith('09/'));
                    const reviewsProfileOctober = reviewsProfile.filter(message => message.updated_at.startsWith('10/'));
                    const reviewsProfileNovember = reviewsProfile.filter(message => message.updated_at.startsWith('11/'));
                    const reviewsProfileDecember = reviewsProfile.filter(message => message.updated_at.startsWith('12/'));


                    store.charData = {
                        labels: [
                            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
                        ],
                        datasets: [
                            {
                                data: [
                                    messagesProfileJanuary.length, messagesProfileFebruary.length, messagesProfileMarch.length, messagesProfileApril.length, messagesProfileMay.length, messagesProfileJune.length, messagesProfileJuly.length, messagesProfileAugust.length, messagesProfileSeptember.length, messagesProfileOctober.length, messagesProfileNovember.length, messagesProfileDecember.length
                                ],
                                backgroundColor: '#65B0FF',
                                // qui si può inserire il label
                                // label: 'test'
                            }
                        ]
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },

        getNormalFormatDate() {
            let hourDate = message.updated_at
            console.log(hourDate)
            const date = new Date(hourDate)

            const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Rome"
            };

            return date.toLocaleString("it-IT", options)
        },
    },
    components: {
        SidebarDashboard,
        HeaderDashboard,
        MainDashboard,
    },
    mounted() {

    },
    created: function () {
        this.store.informationPageId = this.$route.params.id
        this.getApiMessages()
        this.getApiReviews()
    }
}
</script>

<template>
    <div :class="!store.sidebar ? 'general-structure-full' : 'general-structure'">
        <section class="sidebar" v-if="store.sidebar">
            <SidebarDashboard />
        </section>
        <section :class="!store.sidebar ? 'header-main-full' : 'header-main'">
            <div class="header">
                <HeaderDashboard />
            </div>
            <div class="main">
                <MainDashboard />
            </div>
        </section>
    </div>
</template>

<style scoped>
.general-structure {
    display: flex;
    min-height: 100vh;
    overflow: auto;
}

.sidebar {
    flex-basis: 20%;
}

.header-main {
    display: flex;
    flex-basis: 80%;
    flex-direction: column;
}

.header-main-full {
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
}

.header {
    flex-basis: 10%;
}

.main {
    flex-basis: 90%;
    margin: 20px 0 0 20px;
}
</style>