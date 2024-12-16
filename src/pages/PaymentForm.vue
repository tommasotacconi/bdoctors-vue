<template>
    <div>
        <div id="dropin-container"></div>
        <button @click="submitPayment">Paga ora</button>
    </div>
</template>

<script>
import dropin from 'braintree-web-drop-in';

export default {
    data() {
        return {
            instance: null,
        };
    },
    mounted() {
        this.fetchToken();
    },
    methods: {
        fetchToken() {
            // Effettua una richiesta alla tua API Laravel per ottenere il client token
            fetch('/api/braintree/token', {
                headers: {
                    'Authorization': 'Bearer ' + this.token // Includi il token di autenticazione
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.initializeBraintree(data.token);
                });
        },
        initializeBraintree(token) {
            dropin.create({
                authorization: token,
                container: '#dropin-container'
            }, (createErr, instance) => {
                if (createErr) {
                    console.error(createErr);
                    return;
                }
                this.instance = instance;
            });
        },
        submitPayment() {
            this.instance.requestPaymentMethod((err, payload) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // Invia il nonce e l'importo alla tua API Laravel per elaborare il pagamento
                fetch('/api/braintree/payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token // Includi il token di autenticazione
                    },
                    body: JSON.stringify({
                        payment_method_nonce: payload.nonce,
                        amount: this.amount // Sostituisci con l'importo da addebitare
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Gestisci la risposta dell'API
                        if (data.success) {
                            // Pagamento riuscito
                            // ...
                        } else {
                            // Pagamento fallito
                            // ...
                        }
                    });
            });
        }
    }
};
</script>