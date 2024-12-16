<script>
import axios from 'axios';
import { store } from '../../../../js/store.js';
import dropin from 'braintree-web-drop-in';

export default {
    data() {
        return {
            store,
            price: null,
            profilesApiUrl: 'http://127.0.0.1:8000/api/profiles',
            sponsorships: [],
            sponsorship: false,
            cardBronze: false,
            cardSilver: false,
            cardGold: false,
            loaded: false,
            showPaymentForm: false,
            instance: null,
            loading: false,
            error: null,
            paymentSuccess: false
        }
    },
    methods: {
        async getPriceBronze() {
            this.price = 2.99;
            store.price = this.price;
            this.showPaymentForm = true;
            await this.initializePayment();
        },
        async getPriceSilver() {
            this.price = 5.99;
            store.price = this.price;
            this.showPaymentForm = true;
            await this.initializePayment();
        },
        async getPriceGold() {
            this.price = 9.99;
            store.price = this.price;
            this.showPaymentForm = true;
            await this.initializePayment();
        },
        async initializePayment() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/braintree/token');
                const clientToken = response.data.token;

                const dropinInstance = await dropin.create({
                    authorization: clientToken,
                    container: '#dropin-container',
                    locale: 'it_IT',
                    paypal: {
                        flow: 'checkout',
                        amount: this.price,
                        currency: 'EUR'
                    }
                });

                this.instance = dropinInstance;
            } catch (error) {
                this.error = 'Errore durante l\'inizializzazione del modulo di pagamento';
                console.error(error);
            }
        },
        async submitPayment() {
            if (!this.instance) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const { nonce } = await this.instance.requestPaymentMethod();
                const fakePayPalNonce = 'fake-paypal-one-time-nonce';

                await axios.post('http://127.0.0.1:8000/api/braintree/process-payment', {
                    payment_method_nonce: fakePayPalNonce,
                    amount: this.price
                });

                this.paymentSuccess = true;
                this.showPaymentForm = false;
                this.getApiProfiles();
            } catch (error) {
                this.error = 'Pagamento fallito. Per favore riprova.';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        getApiProfiles() {
            axios.get(this.profilesApiUrl)
                .then(response => {
                    let profileDataGeneral = store.profileDataGeneral
                    let sponsorships = response.data.profiles[profileDataGeneral.id].sponsorships
                    this.sponsorships = sponsorships

                    if (sponsorships.length) {
                        this.sponsorship = true
                    } else {
                        this.sponsorship = false
                    }

                    if (this.sponsorships[0].id === 1) {
                        this.cardBronze = true
                    } else if (this.sponsorships[0].id === 2) {
                        this.cardSilver = true
                    } else if (this.sponsorships[0].id === 3) {
                        this.cardGold = true
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getTypeSponsorship() {
            if (this.sponsorships[0].id === 1) {
                return 'card-bronze'
            } else if (this.sponsorships[0].id === 2) {
                return 'card-silver'
            } else if (this.sponsorships[0].id === 3) {
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

                <!-- Payment Form -->
                <div v-if="showPaymentForm" class="payment-container">
                    <h2>Completa il tuo pagamento</h2>
                    <p class="amount">Importo da pagare: €{{ price }}</p>

                    <div id="dropin-container"></div>

                    <div class="error" v-if="error">{{ error }}</div>

                    <button class="payment-button" @click="submitPayment" :disabled="loading">
                        {{ loading ? 'Elaborazione in corso...' : 'Paga ora' }}
                    </button>
                </div>

                <!-- Success Message -->
                <div v-if="paymentSuccess" class="success-container">
                    <div class="success-message">
                        <i class="fa-solid fa-circle-check"></i>
                        <h3>Pagamento completato con successo!</h3>
                        <p>La tua sponsorizzazione è stata attivata.</p>
                        <router-link to="/" class="dashboard-button">
                            Torna alla Homepage
                        </router-link>
                    </div>
                </div>
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

.is-sponsored {
    width: 50%;
}

/* Payment Form Styles */
.payment-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
}

.amount {
    text-align: center;
    font-size: 1.2em;
    margin-bottom: 30px;
}

#dropin-container {
    min-height: 300px;
}

.error {
    color: red;
    margin: 10px 0;
    text-align: center;
}

.payment-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

.payment-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.payment-button:hover:not(:disabled) {
    background-color: #0056b3;
}

/* Loader */
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

/* Success Message Styles */
.success-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
}

.success-message {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.success-message i {
    color: #28a745;
    font-size: 48px;
    margin-bottom: 20px;
}

.success-message h3 {
    color: #28a745;
    margin-bottom: 10px;
}

.success-message p {
    color: #6c757d;
    margin-bottom: 20px;
}

.dashboard-button {
    display: inline-block;
    padding: 12px 24px;
    background-color: var(--color-secondary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.dashboard-button:hover {
    background-color: #0056b3;
}
</style>