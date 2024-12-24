<script>
import axios from 'axios';
import { store } from '../../js/store.js';
import dropin from 'braintree-web-drop-in';

export default {
    data() {
        return {
            store,
            instance: null,
            loading: false,
            error: null
        }
    },
    async mounted() {
        try {
            // Get client token from your server
            const response = await axios.get('http://localhost:8000/api/braintree/token');
            const clientToken = response.data.token;

            // Create drop-in instance
            const dropinInstance = await dropin.create({
                authorization: clientToken,
                container: '#dropin-container',
                locale: 'it_IT',
                paypal: {
                    flow: 'checkout',
                    amount: store.price,
                    currency: 'EUR'
                }
            });

            this.instance = dropinInstance;
        } catch (error) {
            this.error = 'Errore durante l\'inizializzazione del modulo di pagamento';
            console.error(error);
        }
    },
    methods: {
        async submitPayment() {
            if (!this.instance) {
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                const { nonce } = await this.instance.requestPaymentMethod();

                // For testing - use fake PayPal nonce
                const fakePayPalNonce = 'fake-paypal-one-time-nonce';

                // Send payment nonce to server
                await axios.post('http://localhost:8000/api//braintree/process-payment', {
                    payment_method_nonce: fakePayPalNonce,
                    amount: store.price
                });

                // Payment successful
                this.$router.push('/payment-success');
            } catch (error) {
                this.error = 'Pagamento fallito. Per favore riprova.';
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<template>
    <div class="payment-container">
        <h2>Completa il tuo pagamento</h2>
        <p class="amount">Importo da pagare: €{{ store.price }}</p>

        <div id="dropin-container"></div>

        <div class="error" v-if="error">{{ error }}</div>

        <button class="payment-button" @click="submitPayment" :disabled="loading">
            {{ loading ? 'Elaborazione in corso...' : 'Paga ora' }}
        </button>
    </div>
</template>

<style scoped>
.payment-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
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
</style>
