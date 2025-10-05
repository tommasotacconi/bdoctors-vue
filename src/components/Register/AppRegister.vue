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
			customValidation(formInstance) {
				// Start validation
				const data = formInstance.formData;
				const elements = formInstance.elements;
				const errors = formInstance.errors;

				for (const field in data) {
					const value = data[field];
					const label = elements[field].label;

					if ((field === 'firstName' || field === 'lastName') && value && (value.length < 2 || value.length > 50))
						errors[field] = `Il ${label.toLowerCase()} può essere composto da 2 a 50 caratteri`;
					if ((field === 'firstName' || field === 'lastName') && value.includes(' '))
						errors[field] = `Il ${label.toLowerCase()} non può contenere spazi`;
					if (field === 'homeAddress' && (value.length < 3 || value.length > 100))
						errors[field] = "L'indirizzo di residenza può essere composto da 3 a 100 caratteri";
					if (field === 'specializationsId' && !value.length) errors[field] = "Selezionare almeno una specializzazione";
					if (field === 'email' && (value.length < 6 || value.length > 50))
						errors[field] = "La email può essere composta da 6 a 50 caratteri";
					if (field === 'password') {
						if (value.includes(' ')) errors[field] = "La password non può contenere spazi";
						if (value.length < 8) errors[field] = "La password può essere composta da minimo 8 caratteri";
					}
					if (field === 'pwConf') {
						if (!errors['password'] && value && value !== data['password']) errors[field] = "Le password non coincidono";
						else errors[field] = "";
					}
				}
			},
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

		div:has(> .specializations-multiselect) {
			height: 10rem;
			overflow: clip;
			overflow-clip-margin: 190px;

			label {
				position: relative;
				z-index: 51;
			}

			.specializations-multiselect {
				border: 2px solid var(--color-secondary);
				border-radius: 7px;
			}

			.specializations-multiselect.invalid-input {
				border-color: var(--color-error);
			}
		}
	}
</style>