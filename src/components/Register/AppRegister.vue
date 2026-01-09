<script>
	import axios from 'axios';
	import Multiselect from '../Generics/Multiselect.vue';
	import AppAlert from '../Generics/AppAlert.vue'
	import AppForm from '../Generics/AppForm.vue';
	import FormField from '../../../js/utils/FormField';

	export default {
		data() {
			return {
				/* List of all form elements */
				formElements: {
					firstName: new FormField('first-name-input', 'text', 'Nome', { wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'text', 'Cognome', { wS: 'col-md-6' }),
					homeAddress: new FormField('home-address-input', 'text', 'Indirizzo di residenza'),
					specializationsId: new FormField('specializations-input', 'multiselect', 'Specializzazioni', { p: 'Seleziona una o più specializzazioni' }),
					email: new FormField('email-input', 'email', 'Email'),
					password: new FormField('password-input', 'password', 'Password'),
					pwConf: new FormField('password-conf-input', 'password', 'Conferma password')
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
		<AppForm class="user-data-form alone-dimensions" :doctorInfo="null" :apiRouteAndMethod="{ route: 'register', method: 'post', useApiRoute: false }" :elements="formElements"
			:nameArtConc="['registrazione', 'la', 'a']" :wrapperInnerDiv="['row']" :perfectValidation="customValidation" />
	</main>
</template>

<style lang="scss" scoped>
	@use '../../styles/forms';

	/* Generics */
	main {
		height: 100%;
		overflow: auto;
		padding-top: 0;
	}

	/* Form custom-style using specific class */

	:deep() {
		form {
			@include forms.set-fields-color(var(--color-secondary));
		}

		/* Utilities */
		.specializations-multiselect {
			height: 75%;

			.multiselect {
				height: 100%;
				
				.multiselect__tags {
					padding-top: 20px;
					border-bottom-width: 0;
					height: 100%;
					overflow: auto;
				}
			}
		}

		#result-alert {
			padding-left: 10px;
			padding-right: 10px;
			display: block;
			border-width: 2px;
		}
	}
</style>