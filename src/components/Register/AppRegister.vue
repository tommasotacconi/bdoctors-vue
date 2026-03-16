<script>
	import axios from 'axios';
	import Multiselect from '../Generics/Multiselect.vue';
	import AppAlert from '../Generics/AppAlert.vue'
	import AppForm from '../Generics/AppForm.vue';
	import FormField from '../../../js/utils/FormField';
	import { homepageStore } from '../../../js/homepageStore';
	import { useDefaultValidation } from '../../../js/composables/useDefaultValidation';
	import { store } from '../../../js/store';
	import { dashboardStore } from '../../../js/dashboardStore';

	export default {
		data() {
			return {
				/* List of all form elements */
				formElements: {
					firstName: new FormField('first-name-input', 'input', 'Nome', { t: 'text', r: true, wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'input', 'Cognome', { t: 'text', r: true, wS: 'col-md-6' }),
					homeAddress: new FormField('home-address-input', 'input', 'Indirizzo di residenza', { t: 'text', r: true }),
					specializations: new FormField('specializations-input', 'multiselect', 'Specializzazioni', { p: 'Seleziona una o più specializzazioni', fGN: ['f', 'p'], r: true }),
					email: new FormField('email-input', 'input', 'Email', { t: 'email', fGN: ['f', 's'], r: true }),
					password: new FormField('password-input', 'input', 'Password', { t: 'password', fGN: ['f', 's'], r: true }),
					pwConf: new FormField('password-conf-input', 'input', 'Conferma password', { t: 'password', fGN: ['f', 's'], r: true })
				},
				triggerPersistedForm: 0,
				homepageStore,
				dashboardStore,
				store
			}
		},
		methods: {
			/**
			 * Validate form
			 * @param data Form data 
			 * @param els Form elements 
			 * @param errs Form errors
			 */
			validate(data, els, errs) {
				for (const field in data) {
					const value = data[field];
					const label = els[field].label;

					if (errs[field]) continue;

					console.log(field);
					switch (field) {
						case 'password':
							if (value.includes(' ')) errs[field] = "La password non può contenere spazi";
							else if (value.length < 8) errs[field] = "La password può essere composta da minimo 8 caratteri";
							break;
						case 'pwConf':
							if (value && value !== data['password']) errs[field] = "Le password non coincidono";
							break;
						default:
							const result = this['validate' + field[0].toUpperCase() + field.slice(1)](value, label);
							if (result) errs[field] = result;
							break;
					}
				}
			},
			handleSuc(res) {
				this.store.isAuthenticated = true;
				const action = () => this.$router.push({ name: 'dashboard' });
				this.triggerAlert(res.data.message, this.homepageStore.headerHeight + 10, undefined, {
					txt: 'Visualizza',
					action
				});
				this.dashboardStore.profileDataGeneral = res.data.profile;
			},
			handleErr({ status, response: res }) {
				this.triggerAlert(res.data.message ?? 'Profilo creato', this.homepageStore.headerHeight + 10, 'warning');
				this.triggerPersistedForm++;
				// this.showAlert = true;
			},
		},
		components: {
			AppForm
		},
		setup() {
			const { validateFirstName, validateLastName, validateHomeAddress, validateSpecializations, validateEmail } = useDefaultValidation();

			return { validateFirstName, validateLastName, validateHomeAddress, validateSpecializations, validateEmail }
		},
		inject: ['triggerAlert']
	}
</script>

<template>
	<!-- Register form -->
	<main>
		<AppForm class="user-data-form alone-dimensions" :doctorInfo="null"
			:apiRouteAndMethod="{ route: 'register', method: 'post', useApiRoute: false }" :elements="formElements"
			:nameArtConc="['registrazione', 'la', 'a']" :wrapperInnerDiv="['row']" :perfectValidation="validate"
			:triggerPersistedForm submitBtnTxt="Registrati" @success="handleSuc" @error="handleErr" />
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
		#result-alert {
			padding-left: 10px;
			padding-right: 10px;
			display: block;
			border-width: 2px;
		}
	}
</style>