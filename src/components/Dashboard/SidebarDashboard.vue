<script>
import { store } from '../../../js/store.js'

export default {
    data() {
        return {
            store
        }
    },
    methods: {
        showMessages() {
            store.informationPage = false;
            store.reviewPage = false;
            store.sponsorshipPage = false;
            store.statisticPage = false;
            store.messagePage = true;
        },
        showProfile() {
            store.messagePage = false;
            store.reviewPage = false;
            store.sponsorshipPage = false;
            store.statisticPage = false;
            store.informationPage = true;
        },
        showReviews() {
            store.messagePage = false;
            store.informationPage = false;
            store.sponsorshipPage = false;
            store.statisticPage = false;
            store.reviewPage = true;
        },
        showSponsorship() {
            store.messagePage = false;
            store.informationPage = false;
            store.statisticPage = false;
            store.reviewPage = false;
            store.sponsorshipPage = true;
        },
        showStatistic() {
            store.messagePage = false;
            store.informationPage = false;
            store.sponsorshipPage = false;
            store.reviewPage = false;
            store.statisticPage = true;
        }
    }
}
</script>

<template>
    <nav>
        <RouterLink :to="{ name: 'homepage' }">
            <div class="title-logo d-flex">
                <div class="logo">
                    <div class="square-general square1"></div>
                    <div class="square-general square2"></div>
                    <div class="square-general square3"></div>
                    <div class="square-general square4"></div>
                </div>
                <div class="title">
                    <h1>bdoctors</h1>
                </div>
            </div>
        </RouterLink>
        <section class="link-pages">
            <h5 :class="store.informationPage ? 'selected-text' : ''" @click="showProfile">Profilo</h5>
            <h5 :class="store.messagePage ? 'selected-text' : ''" @click="showMessages">Messaggi</h5>
            <h5 :class="store.reviewPage ? 'selected-text' : ''" @click="showReviews">Recensioni</h5>
            <h5 :class="store.sponsorshipPage ? 'selected-text' : ''" @click="showSponsorship">Sponsorizzazione</h5>
            <h5 :class="store.statisticPage ? 'selected-text' : ''" @click="showStatistic">Statistiche</h5>
        </section>
    </nav>
</template>

<style scoped>
/* General */
nav {
    height: 100%;
    background-color: var(--color-primary);
    border-right: 2px solid lightgray;
    color: white;
}

a {
    text-decoration: none;
}

.link-pages {
    margin-top: 20px;
}

h5 {
    margin: 10px 0 0 0;
    padding: 10px 10px 10px 20px;
}

.selected-text {
    background-color: var(--color-secondary);
}

h5:hover {
    cursor: pointer;
    margin: 10px 0;
    border-bottom: 2px solid lightgray;
    border-top: 2px solid lightgray;
    background-color: #0E125D;
}

/* Logo */
h1 {
    color: white;
    text-transform: uppercase;
    margin: 0;
    font-size: 2rem;
}

.title-logo {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    height: 10%;
}

.logo {
    width: 30px;
    height: 30px;
    display: flex;
    flex-wrap: wrap;
}

.square-general {
    height: 15px;
    width: 15px;
}

.square1 {
    background-color: #65B0FF;
}

.square2 {
    background-color: white;
}

.square3 {
    background-color: white;
}

.square4 {
    background-color: #155489;
}


/* Responsive */
@media only screen and (max-width: 1024px) {
    .title {
        display: none;
    }
}
</style>