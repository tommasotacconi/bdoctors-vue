<script>
	import axios from '../../../js/axios';
	import { store } from '../../../js/store';
	import { emitter } from '../../../js/eventBus';

	export default {
		data() {
			return {
				inputEmail: '',
				inputPassword: '',
				isRequestPending: false,
				store,
				isAnimationActive: false,
				positiveAuthenticationSymbol: '',
				loginButtonText: 'Login'
			}
		},
		methods: {
			sendLoginData() {
				this.isRequestPending = true;
				axios.post(this.store.apiUri.slice(0, -4) + 'login', {
					email: this.inputEmail,
					password: this.inputPassword
				})
					.then(response => {
						this.store.isAuthenticated = true;
						this.loginButtonText = '';
						this.positiveAuthenticationSymbol = '✅';
						this.isRequestPending = false;
						emitter.emit('reset-dashboard');
						setTimeout(() => {
							this.$router.push({ name: 'dashboard', params: { id: response.data.user_id } })
						}, 100);
					})
					.catch(err => {
						this.isRequestPending = false;
						this.isAnimationActive = true;
						setTimeout(() => { this.isAnimationActive = false }, 250);
						// console.log('error POST /api/login: ', err);
					});
			},
		},
		computed: {
			loginButtonContent() {
				return !this.isRequestPending ? this.loginButtonText + this.positiveAuthenticationSymbol : null;
			}
		},
	}
</script>

<template>
	<form class="" action="post" @submit.prevent="sendLoginData">
		<div class="card login-card row" id="login-card">
			<div class="col-12">
				<!-- Email input -->
				<label for="email-input" class="badge rounded-pill">Email</label>
				<input type="text" id="email-input" class="form-control mb-3" v-model="inputEmail">
			</div>
			<div class="col-12">
				<!-- Password input -->
				<label for="password-input" class="badge rounded-pill">Password</label>
				<input type="password" id="password-input" class="form-control mb-3" v-model="inputPassword">
			</div>
			<!-- Button wrappers -->
			<div class="buttons-wrapper col-12 d-flex justify-content-center">
				<button type="submit" id="login-button" class="btn btn-primary d-flex justify-content-center mt-4 mb-3"
					:class="{ ['shaking-animation']: isAnimationActive }">
					{{ loginButtonContent }}
					<Loader class="repositioned-loader" v-if="isRequestPending" />
				</button>
			</div>
		</div>
	</form>
</template>

<style lang="scss" scoped>
	form {
		height: calc(100vh - 80px);
		display: flex;
		align-items: center;
	}

	.card {
		background-color: #FFB465;
	}

	.login-card {
		margin: 0 auto;
		width: 350px;
	}

	label {
		width: fit-content;
		font-size: 0.9rem;
		/* padding: 0 10px; */
		background-color: #65B0FF;
		color: white;

		position: relative;
		left: 15px;
		top: 12px;
	}

	input {
		height: 3.2rem;
		border: 2px solid #65B0FF;
	}

	.buttons-wrapper {
		padding: 0;
	}

	#login-button {
		width: calc(100% - 24px);
		position: relative;
	}

	#login-button.shaking-animation {
		color: #ff0000;
		background-color: currentColor;
		border-color: currentColor;

		animation-name: horizontal-shaking;
		animation-duration: 0.5s;
	}

	/* Shake animation (credits, https://unused-css.com/blog/css-shake-animation/) */
	@keyframes horizontal-shaking {
		0% {
			transform: translateX(0)
		}

		20% {
			transform: translateX(4px)
		}

		40% {
			transform: translateX(-4px)
		}

		60% {
			transform: translateX(4px)
		}

		80% {
			transform: translateX(-4px)
		}

		75% {
			transform: translateX(4px)
		}

		100% {
			transform: translateX(0)
		}
	}

	button .repositioned-loader {
		width: 24px;
		position: static;
		translate: none;

		border: 2px solid #fff;
	}
</style>