<script>
	import axios from 'axios';
	import Multiselect from '../Generics/Multiselect.vue';
	import AppAlert from '../Generics/AppAlert.vue'
	import AppForm from '../Generics/AppForm.vue';

	class formField {
		constructor(id, type, label, placeholder = undefined, wrapperStyle = undefined) {
			this.id = id,
				this.type = type,
				this.label = label,
				this.placeholder = placeholder,
				this.wrapperStyle = wrapperStyle
		}
	}

	export default {
		data() {
			return {
				errors: {
					firstName: [],
					lastName: [],
					homeAddress: [],
					specializations: [],
					email: [],
					password: [],
					passwordConfirmation: [],
				},
				isValidated: false,
				firstName: '',
				lastName: '',
				homeAddress: '',
				specializations: [],
				email: '',
				password: '',
				passwordConfirmation: '',
				isAlertShown: false,
				responseStatus: false,
				/* List of all form elements */
				formElements: {
					firstName: new formField('first-name-input', 'text', 'Nome', '', 'col-md-6'),
					lastName: new formField('last-name-input', 'text', 'Cognome', '', 'col-md-6'),
					homeAddress: new formField('home-address-input', 'text', 'Indirizzo di residenza'),
					specializationsId: new formField('specializations-input', 'multiselect', 'Specializzazioni', 'Seleziona una o più specializzazioni'),
					email: new formField('email-input', 'email', 'Email'),
					password: new formField('password-input', 'password', 'Password'),
					pwConf: new formField('password-conf-input', 'password', 'Conferma password')
				}
			}
		},
		methods: {
		},
		components: {
			Multiselect,
			AppAlert,
			AppForm
		},
		computed: {
		}
	}
</script>

<template>
	<!-- Register form -->
	<main>
		<AppForm :apiRoute="'register'" :elements="formElements" :doctorInfo="null"
			:wrapperInnerDiv="['row', 'register-card', 'card']" :perfectValidation="customValidation" />
	</main>
</template>

<style scoped>

	/* Generics */
	main {
		height: 100%;
		overflow: auto;
		padding-top: 0;
	}

	/* Form custom-style using specific class */
	:deep() {
		form {
			min-height: 900px;
			height: calc(100vh - 80px);
			display: flex;
			align-items: center;

			label.badge.rounded-pill {
				width: fit-content;
				font-size: 0.9rem;
				/* padding: 0 10px; */
				background-color: #65B0FF;
				color: white;

				position: relative;
				left: 15px;
				top: 12px;
			}

			input[type="text"],
			input[type="password"],
			input[type="email"] {
				&.form-control {
					height: 3.2rem;
					border: 2px solid #65B0FF;
				}
			}
		}


		/* Utilities */
		.card {
			padding-bottom: 20px;
			background-color: var(--color-complementary);
			/* #FFB465; */
			flex-direction: row;
		}

		.register-card {
			margin: 0 auto;
			width: 600px;
		}

		#result-alert {
			padding-left: 10px;
			padding-right: 10px;
			display: block;
			border-width: 2px;
		}

		.invalid-element,
		div#multiselect-container .specializations-input.invalid-element {
			color: #e4005b;
			border-color: currentColor;
		}

		div:has(> .specializations-multiselect) {
			height: 10rem;
			overflow: clip;
			overflow-clip-margin: 190px;

			label {
				position: relative;
				z-index: 51;
			}

			.specializations-multiselect {
				border: 2px solid #65B0FF;
				border-radius: 7px;
			}
		}

		.btn-warning {
			color: #fff;
			background-color: #ca9400;
		}

		#register-button {
			background-color: #65B0FF;

			&:hover {
				background-color: #0E395D;
			}
		}
	}
</style>