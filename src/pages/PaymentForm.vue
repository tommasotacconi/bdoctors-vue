<template>
    <div>
        <div id="dropin-container"></div>
        <button @click="submitPayment" :disabled="!instance">Paga ora</button>
    </div>
</template>

<script>
import dropin from 'braintree-web-drop-in';
import { store } from '../../js/store';

export default {
    data() {
        return {
            instance: null,
            store,
            amount: store.price
        };
    },
    mounted() {
        this.fetchToken();
    },
    methods: {
        fetchToken() {
            // Effettua una richiesta alla tua API Laravel per ottenere il client token
            fetch('http://127.0.0.1:8000/api/braintree/token')
                .then(response => response.json())
                .then(data => {
                    this.initializeBraintree(data.token);
                })
                .catch(error => {
                    console.error('Error fetching token:', error);
                });
        },
        initializeBraintree(token) {
            dropin.create({
                authorization: token,
                container: '#dropin-container'
            })
                .then(instance => {
                    this.instance = instance;
                })
                .catch(error => {
                    console.error('Error initializing Braintree:', error);
                });
        },
        submitPayment() {
            if (!this.instance) {
                console.error('Payment instance not initialized');
                return;
            }

            this.instance.requestPaymentMethod()
                .then(payload => {
                    // Invia il nonce e l'importo alla tua API Laravel per elaborare il pagamento
                    return fetch('http://127.0.0.1:8000/api/braintree/payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            payment_method_nonce: payload.nonce,
                            amount: this.amount
                        })
                    });
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Pagamento riuscito
                        console.log('Payment successful');
                        this.$router.push('/payment-success');
                    } else {
                        // Pagamento fallito
                        console.error('Payment failed');
                        this.$router.push('/payment-error');
                    }
                })
                .catch(error => {
                    console.error('Payment error:', error);
                });
        }
    }
};
</script>