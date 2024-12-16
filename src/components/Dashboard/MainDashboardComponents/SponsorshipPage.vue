<script>
import axios from 'axios';
import { store } from '../../../../js/store.js';

export default {
    data() {
        return {
            store,
            price: null,
            profilesApiUrl: 'http://localhost:8000/api/profiles',
            sponsorships: [],
            sponsorship: false,
            cardBronze: false,
            cardSilver: false,
            cardGold: false,
            loaded: false,
        }
    },
    methods: {
        getPriceBronze() {
            this.price = 2.99
            console.log(this.price)
            this.$router.push('/payment-form')
        },
        getPriceSilver() {
            this.price = 5.99
            console.log(this.price)
            this.$router.push('/payment-form')
        },
        getPriceGold() {
            this.price = 9.99
            console.log(this.price)
            this.$router.push('/payment-form')
        },
        getApiProfiles() {
            axios.get(this.profilesApiUrl)
                .then(response => {
                    // Controllo per verificare se l'utente ha la sponsorizzazione o meno
                    // Al momento non tiene conto del fatto che sia attiva o meno visto nessuna lo è
                    // In caso sarebbe sufficiente usare l'api e cercare ...doctor.has_active_sponsorship

                    let profileDataGeneral = store.profileDataGeneral

                    let sponsorships = response.data.profiles[profileDataGeneral.id].sponsorships
                    this.sponsorships = sponsorships
                    console.log(this.sponsorships)

                    if (sponsorships.length) {
                        this.sponsorship = true
                    } else {
                        this.sponsorship = false
                    }

                    console.log(this.sponsorship)


                    if (this.sponsorships[0].id === 1) {
                        console.log('test')
                        this.cardBronze = true
                    } else if (this.sponsorships[0].id === 2) {
                        this.cardSilver = true
                    } else if (this.sponsorships[0].id === 3) {
                        this.cardGold = true
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
        // Metodo non adoperato, inglobato nella chiamata api
        getTypeSponsorship() {
            if (this.sponsorships[0].id === 1) {
                console.log('test')
                return 'card-bronze'
            } else if (this.sponsorships[0].id === 2) {
                console.log('test')

                return 'card-silver'
            } else if (this.sponsorships[0].id === 3) {
                console.log('test')

                return 'card-gold'
            }

        }
    },
    computed: {
        showLoader() {
            setTimeout(() => {
                this.loaded = true
            }, 2000)

        }
    },
    created() {
        this.getApiProfiles()
    },
    mounted() {
        this.showLoader
    }
}
</script>

<template>
    <main class="container">
        <h2>Sponsorizzazione</h2>
        <div class="loader" v-if="!loaded"></div>
        <div class="container-flex" v-else>
            <div class="is-not-sponsored" v-if="!sponsorship">
                <div class="sponsored-description">
                    <p>
                        Investi nelle tue competenze, sponsorizza il tuo profilo!
                        <br>
                        Un profilo sponsorizzato compare nella homepage e viene sempre posizionato in cima nella pagina
                        di
                        ricerca.
                    </p>
                    <p>

                    </p>
                </div>
                <h3>Scegli la tua sponsorizzazione:</h3>
                <section class="sponsor-cards">
                    <button class="sponsor-card card-bronze" @click="getPriceBronze()">
                        <div class="card-description">
                            <p class="hour-sponsorship">Garantito per 24 ore</p>
                            <p class="price">2,99€</p>
                        </div>
                        <div class="premium-star"><i class="fa-solid fa-star"></i></div>
                    </button>
                    <button class="sponsor-card card-silver" @click="getPriceSilver()">

                        <div class="card-description">
                            <p class="hour-sponsorship">Garantito per 72 ore</p>
                            <p class="price">5,99€</p>
                        </div>
                        <div class="premium-star"><i class="fa-solid fa-star"></i></div>

                    </button>
                    <button class="sponsor-card card-gold" @click="getPriceGold()">
                        <div class="card-description">
                            <p class="hour-sponsorship">Garantito per 144 ore</p>
                            <p class="price">9,99€</p>
                        </div>
                        <div class="premium-star"><i class="fa-solid fa-star"></i></div>
                    </button>
                </section>
            </div>
            <div class="is-sponsored" v-else>
                <div class="sponsor-card card-bronze" v-if="cardBronze">
                    <div class="card-description">
                        <p class="hour-sponsorship">Il tuo profilo è sponsorizzato</p>
                    </div>
                    <div class="premium-star"><i class="fa-solid fa-star"></i></div>
                </div>
                <div class="sponsor-card card-silver" v-else-if="cardSilver">
                    <div class="card-description">
                        <p class="hour-sponsorship">Il tuo profilo è sponsorizzato</p>
                    </div>
                    <div class="premium-star"><i class="fa-solid fa-star"></i></div>
                </div>
                <div class="sponsor-card card-gold" v-else-if="cardGold">
                    <div class="card-description">
                        <p class="hour-sponsorship">Il tuo profilo è sponsorizzato</p>
                    </div>
                    <div class="premium-star"><i class="fa-solid fa-star"></i></div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.container-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

p {
    margin: 0
}

h2 {
    margin-bottom: 40px;
    text-align: center;
}

h3 {
    margin: 30px 0 30px 0;
    text-align: center;
}

button {
    border: 0;
}

.sponsored-description {
    padding-bottom: 20px;
    text-align: center;
    font-size: 1.2rem;
}


/* Cards */
.sponsor-cards {
    display: flex;
    justify-content: center;
    gap: 30px;
}

.sponsor-card {
    margin-top: 10px;
    padding: 25px 35px;
    border-radius: 25px;
    color: white;
    font-weight: bold;
    /* box-shadow: 5px 5px 15px 1px black; */
    position: relative;
    flex-basis: 30%;
    cursor: pointer;
}

.sponsor-card:hover {
    scale: 1.1;
}

.card-bronze {
    background-color: #A56C41;
}

.card-silver {
    background-color: #C4C4C4;
}

.card-gold {
    background-color: #FFCC00;
}

.fa-star {
    display: inline;
    font-size: 0.9rem;
    background-color: white;
    border-bottom-left-radius: 35%;
    border: 1px solid white;
    padding: 10px;
    color: #FFCC00;
    position: absolute;
    top: 0px;
    right: 0px;
}

.card-description {
    text-align: center;
}

.hour-sponsorship {
    font-size: 1.2rem;
}

.price {
    font-style: italic;
    font-size: 0.9rem;
}

.button-pay-now-general {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.button-pay-now {
    background-color: var(--color-complementary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}

.button-pay-now:hover {
    scale: 1.1;
}

.is-sponsored {
    width: 50%;
}


/* Loader progressive */
.loader {
    --r1: 154%;
    --r2: 68.5%;
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
        radial-gradient(var(--r1) var(--r2) at bottom, var(--color-secondary) 79.5%, #0000 80%),
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
        #ccc;
    background-size: 50.5% 220%;
    background-position: -100% 0%, 0% 0%, 100% 0%;
    background-repeat: no-repeat;
    animation: l9 2s infinite linear;
    position: absolute;
    top: 50%;
    left: 59%;
}

@keyframes l9 {
    33% {
        background-position: 0% 33%, 100% 33%, 200% 33%
    }

    66% {
        background-position: -100% 66%, 0% 66%, 100% 66%
    }

    100% {
        background-position: 0% 100%, 100% 100%, 200% 100%
    }
}
</style>