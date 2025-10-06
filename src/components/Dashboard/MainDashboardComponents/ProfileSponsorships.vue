<script>
	import axios from 'axios';
	import { store } from '../../../../js/store.js';
	import dropin from 'braintree-web-drop-in';
	import { nextTick } from 'vue';

	export default {
		data() {
			return {
				store,
				price: null,
				sponsorshipTypes: [],
				sponsorshipName: '',
				profileSponsorships: null,
				cardType: null,
				dropinInstance: null,
				error: null,
				isSponsorshipLoaded: false,
				isSponsorized: false,
				loadingDropin: false,
				showPaymentForm: false,
				loadingPayment: false,
				isWaitingToken: false,
				paymentSuccess: false,
			}
		},
		methods: {
			getSponsorshipTypes() {
				axios.get(this.store.apiUri + 'sponsorships')
					.then(({ data: { sponsorships } }) => {
						console.log(sponsorships);
						this.sponsorshipTypes = sponsorships;
					})
					.catch(err => {
					})
			},
			async setSponsorshipType({ name, price }) {
				this.sponsorshipName = name;
				this.price = price;
				this.showPaymentForm = true;
				await this.initializePayment();
			},
			async pay(e) {
				this.error = null;
				this.loadingPayment = true;

				try {
					const { bindata, description, details, nonce, type } = await this.dropinInstance.requestPaymentMethod();

					await axios.post(this.store.apiUri + 'braintree/process-payment', {
						payment_method_nonce: nonce,
						sponsorshipName: this.sponsorshipName,
						amount: this.price,
					}, {
						withCredentials: true
					});

					this.isSponsorshipLoaded = false;
					this.paymentSuccess = true;
					this.getApiProfile();
				} catch (error) {
					this.error = 'Pagamento fallito per favore riprova.'
				} finally {
					this.loadingPayment = false;
				}
			},
			async initializePayment() {
				this.error = null;
				// Disable buttons
				this.loadingDropin = true;

				await nextTick();
				// If another payment was previously initialized inside #dropin-container, remove it
				const container = this.$refs.dropinContainer;
				while (container.firstChild) {
					container.removeChild(container.firstChild);
					await nextTick();
				}

				try {
					this.isWaitingToken = true;
					const { data: { token } } = await axios.get(this.store.apiUri + 'braintree/token');
					this.isWaitingToken = false;

					const dropinInstance = await dropin.create({
						authorization: token,
						container: '#dropin-container',
						locale: 'it_IT',
						paypal: {
							flow: 'checkout',
							amount: this.price,
							currency: 'EUR'
						}
					});

					this.dropinInstance = dropinInstance;
				} catch (error) {
					this.isWaitingToken = false;
					this.error = 'Errore durante l\'inizializzazione del modulo di pagamento';
				}

				this.loadingDropin = false;
			},
			getApiProfile() {
				axios.get(this.store.apiUri + 'profiles/authenticated', {
					withCredentials: true
				})
					.then(response => {
						// console.log(response);
						const { data: { profile: { active_sponsorships: activeSponsorships } } } = response;
						this.profileSponsorships = activeSponsorships;

						// Set sponsorization status
						if (activeSponsorships.length) {
							this.isSponsorized = true;
							this.cardType = this.profileSponsorships[0].name.toLowerCase();
						}

						this.isSponsorshipLoaded = true;
					})
					.catch(function (error) {
						// console.log(error);
					})
			},
		},
		computed: {
		},
		created() {
			this.getSponsorshipTypes();
			this.getApiProfile()
		},
	}
</script>

<template>
	<main class="container">
		<h2>Sponsorizzazione</h2>
		<Loader :class="{ 'adapted-loader': paymentSuccess }" v-if="!isSponsorshipLoaded" />
		<div class="container-flex" v-else>
			<!-- Not sponsorized user case -->
			<div class="is-not-sponsored" v-if="!isSponsorized">
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
					<button v-for="type in sponsorshipTypes" class="sponsor-card" :class="['card-' + type.name.toLowerCase()]"
						@click="setSponsorshipType(type)" :disabled="loadingDropin">
						<div class="card-description">
							<p class="hour-sponsorship">Garantito per {{ type.duration }} ore</p>
							<p class="price">{{ type.price }}</p>
						</div>
						<div class="premium-star"><i class="fa-solid fa-star"></i></div>
					</button>
				</section>

				<!-- Payment Form -->
				<div v-if="showPaymentForm" class="checkout">
					<div class="checkout-container">
						<h3 class="heading-3">Pagamento</h3>
						<!-- Token request loader in container -->
						<div class="loader-container" v-show="isWaitingToken">
							<Loader id="payment-loader" />
						</div>
						<!-- Payment section -->
						<div class="checkout-form">
							<div class="input-group">
								<div class="input-box">
									<div ref="dropinContainer" id="dropin-container"></div>
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
									<button class="btn btn-pay" ref="btnPay" @click="pay" :disabled="loadingDropin || loadingPayment">
										{{ loadingPayment ? 'Elaborazione in corso...' : 'Procedi al pagamento' }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Sponsorized user case -->
			<div class="is-sponsored" v-else>
				<div class="sponsor-card card-bronze" :class="['card-' + this.profileSponsorships[0].name.toLowerCase()]">
					<div class="card-description">
						<p class="hour-sponsorship">Il tuo profilo è sponsorizzato</p>
					</div>
					<div class="premium-star"><i class="fa-solid fa-star"></i></div>
				</div>
			</div>
		</div>

		<!-- Success Message -->
		<div v-if="paymentSuccess" class="success-container">
			<div class="success-message">
				<i class="fa-solid fa-circle-check"></i>
				<h3>Pagamento completato con successo!</h3>
				<p>La tua sponsorizzazione è stata attivata.</p>
				<router-link :to="{ name: 'homepage' }" class="dashboard-button">
					Torna alla Homepage
				</router-link>
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

	/* Riposition loader when showing success payment message */
	.loader.adapted-loader {
		width: 34px;
		margin: 60px auto;
		translate: none;
		position: static;
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

		/* Loader sizing */
		.loader-container {
			height: 150px;
			position: relative;

			.loader {
				width: 34px;
			}
		}
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
		/* background-color: var(--color-complementary); */
		/* border-radius: 10px; */
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.btn-pay:hover,
	.btn-pay:active,
	.btn-pay:first-child:active {
		background-color: var(--color-complementary);
		color: #fff;
	}

	.sponsor-card:disabled,
	.btn-pay:disabled {
		opacity: 0.75;
		cursor: not-allowed;
		color: #fff;
		background-color: var(--color-tertiary);
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