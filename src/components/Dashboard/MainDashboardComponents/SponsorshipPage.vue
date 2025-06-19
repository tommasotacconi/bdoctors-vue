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
		<Loader v-if="!loaded" />
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
				<div v-if="showPaymentForm" class="checkout">
					<div class="checkout-container">
						<h3 class="heading-3">Pagamento</h3>
						<div class="checkout-form">
							<div class="input-group">
								<div class="input-box">
									<div id="dropin-container"></div>
								</div>
							</div>

							<div class="input-group">
								<div class="input-box">
									<h4>Totale da pagare: €{{ price }}</h4>
								</div>
							</div>

							<div class="error-message" v-if="error">
								<i class="fa-solid fa-circle-exclamation"></i>
								{{ error }}
							</div>

							<div class="input-group">
								<div class="input-box">
									<button class="btn-pay" @click="submitPayment" :disabled="loading">
										{{ loading ? 'Elaborazione in corso...' : 'Procedi al pagamento' }}
									</button>
								</div>
							</div>
						</div>
					</div>
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
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.sponsor-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.card-bronze {
		background: linear-gradient(135deg, #A56C41 0%, #CD7F32 100%);
	}

	.card-silver {
		background: linear-gradient(135deg, #C4C4C4 0%, #E8E8E8 100%);
	}

	.card-gold {
		background: linear-gradient(135deg, #FFCC00 0%, #FFD700 100%);
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
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.card-description {
		text-align: center;
	}

	.hour-sponsorship {
		font-size: 1.2rem;
		margin-bottom: 8px;
	}

	.price {
		font-style: italic;
		font-size: 1.1rem;
		opacity: 0.9;
	}

	.is-sponsored {
		width: 50%;
	}

	/* Payment Form Styles */
	.checkout {
		margin: 50px auto;
		width: 100%;
		max-width: 800px;
		padding: 20px;
	}

	.checkout-container {
		background-color: white;
		padding: 30px;
		border-radius: 20px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
	}

	.heading-3 {
		text-align: center;
		font-size: 24px;
		color: #333;
		margin-bottom: 30px;
	}

	.checkout-form {
		padding: 20px;
	}

	.input-group {
		margin-bottom: 25px;
	}

	.input-box {
		width: 100%;
	}

	.btn-pay {
		width: 100%;
		height: 50px;
		border: none;
		background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
		color: white;
		border-radius: 10px;
		font-size: 16px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-pay:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
	}

	.btn-pay:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	/* Success Message Styles */
	.success-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
	}

	.success-message {
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border-radius: 16px;
		padding: 40px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.success-message i {
		color: #22c55e;
		font-size: 54px;
		margin-bottom: 20px;
	}

	.success-message h3 {
		color: #15803d;
		font-size: 1.8rem;
		margin-bottom: 15px;
	}

	.success-message p {
		color: #374151;
		font-size: 1.1rem;
		margin-bottom: 25px;
	}

	.dashboard-button {
		display: inline-block;
		padding: 14px 28px;
		background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
		color: white;
		text-decoration: none;
		border-radius: 12px;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
	}

	.dashboard-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
		background: linear-gradient(135deg, #4338ca 0%, #7c3aed 100%);
		color: white;
	}
</style>