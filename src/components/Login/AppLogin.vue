<script>
	import axios from 'axios';
	import { store } from '../../../js/store.js';

	export default {
		data() {
			return {
				store,
				inputEmail: '',
				inputPassword: '',
				responseStatus: false,
				isAnimationActive: false,
				positiveAuthenticationSymbol: '',
			}
		},
		methods: {
			sendLoginData() {
				axios.post(this.store.apiUri + 'login', {
					email: this.inputEmail,
					password: this.inputPassword
				}, {
					withCredentials: true,
				})
					.then(response => {
						console.log(response);
						this.responseStatus = true;
						this.positiveAuthenticationSymbol = '✅';
						setTimeout(() => {
							this.$router.push({ name: 'dashboard', params: { id: response.data.user_id } })
						}, 200);
					})
					.catch(error => {
						// Trigger animation
						this.isAnimationActive = true;
						setTimeout(() => { this.isAnimationActive = false }, 500);
						console.log(error);
					});
			},
		},
		created: function () {
			axios.get(this.store.apiUri + 'login/check', {
				withCredentials: true,
			})
				.then(({ data: { authentication: { userId } } }) => {
					console.log('Current authenticated user id: ' + userId);
					if (userId) this.$router.push({ name: 'dashboard', params: { id: userId } })
				})
				.catch(err => { });
		}
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
				<button type="submit" id="login-button" class="btn btn-primary mt-4 mb-3"
					:class="{ ['shaking-animation']: isAnimationActive }">Login <span>{{ positiveAuthenticationSymbol
					}}</span></button>
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
		background-color: #65B0FF;

		&:hover {
			background-color: #0E395D;
		}
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
</style>