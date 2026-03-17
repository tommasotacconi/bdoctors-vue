<script>
	import axios from '../../../js/axios';
	import { store } from '../../../js/store';
	import { emitter } from '../../../js/eventBus';
	import AppForm from '../Generics/AppForm.vue';
	import FormField from '../../../js/utils/FormField';
	import AppAlert from '../Generics/AppAlert.vue';

	export default {
		data() {
			return {
				triggerPersistedForm: 0,
				formElements: {
					email: new FormField('email-input', 'input', 'Email', { t: 'email' }),
					password: new FormField('password-input', 'input', 'Password', { t: 'password' }),
				},
				store,
				// isAnimationActive: false,
			}
		},
		methods: {
			handleRequest({ status, response: res }) {
				if (status < 400) {
					this.store.isAuthenticated = true;
					emitter.emit('reset-dashboard');
					setTimeout(() => {
						this.$router.push({ name: 'dashboard' })
					}, 100);
				} else {
					const headerHeightVal = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
					this.triggerAlert(res?.data.message, parseInt(headerHeightVal.slice(0, -2)) + 10, 'warning');
					this.triggerPersistedForm++;
				}
			}
		},
		components: {
			AppForm,
			AppAlert
		},
		inject: ['triggerAlert'],
	}
</script>

<template>
	<main>
		<AppForm class="user-data-form alone-dimensions" :doctorInfo="null"
			:apiRouteAndMethod="{ route: 'login', method: 'post', useApiRoute: false }" :elements="formElements"
			:nameArtConc="['accesso', 'l\'', 'o']" :wrapperInnerDiv="['row']" :triggerPersistedForm @success="handleRequest"
			@error="handleRequest">
			<template v-slot:submitBtnTxt>Accedi</template>
		</AppForm>
	</main>
</template>

<style lang="scss" scoped>
	.form-frame.alone-dimensions {
		width: 350px;
		min-height: 0;
		margin-top: calc((100vh - var(--header-h)) / 2);
		translate: 0 -50%;
	}

	// .buttons-wrapper {
	// 	padding: 0;
	// }

	// #login-button {
	// 	width: calc(100% - 24px);
	// 	position: relative;
	// }

	// #login-button.shaking-animation {
	// 	color: #ff0000;
	// 	background-color: currentColor;
	// 	border-color: currentColor;

	// 	animation-name: horizontal-shaking;
	// 	animation-duration: 0.5s;
	// }

	/* Shake animation (credits, https://unused-css.com/blog/css-shake-animation/) */
	// @keyframes horizontal-shaking {
	// 	0% {
	// 		transform: translateX(0)
	// 	}

	// 	20% {
	// 		transform: translateX(4px)
	// 	}

	// 	40% {
	// 		transform: translateX(-4px)
	// 	}

	// 	60% {
	// 		transform: translateX(4px)
	// 	}

	// 	80% {
	// 		transform: translateX(-4px)
	// 	}

	// 	75% {
	// 		transform: translateX(4px)
	// 	}

	// 	100% {
	// 		transform: translateX(0)
	// 	}
	// }

	button .repositioned-loader {
		width: 24px;
		position: static;
		translate: none;

		border: 2px solid #fff;
	}
</style>