<script>
	import axios from "axios";
	import Multiselect from "../../../Generics/Multiselect.vue";
	import AppAlert from "../../../Generics/AppAlert.vue";
	import { store } from "../../../../../js/store";
	import { dashboardStore } from "../../../../../js/dashboardStore";
	import { emitter } from "../../../../../js/eventBus";
	import FormField from "../../../../../js/utils/FormField";
	import AppForm from "../../../Generics/AppForm.vue";
	import { useHandler } from "../../../../../js/composables/useHandler";


	export default {
		data() {
			return {
				formData: {},
				formElements: {
					firstName: new FormField('first-name-input', 'text', 'Nome', { wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'text', 'Cognome', { wS: 'col-md-6' }),
					email: new FormField('email-input', 'text', 'Email', { d: true, wS: 'col-md-6' }),
					homeAddress: new FormField('home-address-input', 'text', 'Indirizzo di residenza', { p: 'Via/Piazza...', wS: 'col-md-6' }),
					specializationsId: new FormField('specializations-input', 'multiselect', 'Specializzazioni', { p: 'Seleziona una o più specializzazioni' }),
					phone: new FormField('phone-input', 'tel', 'Telefono ufficio', { p: 'numero di telefono senza prefisso', wS: 'col-md-6' }),
					officeAddress: new FormField('office-address-input', 'text', 'Indirizzo d\'ufficio', { p: 'Piazza/Via...', wS: 'col-md-6' }),
					services: new FormField('services-input', 'textarea', 'Prestazioni erogate', { p: 'Indicare le prestazioni prefissandole con un asterisco', wS: 'col-md-12' }),
					photo: new FormField('photo-input', 'file', 'Foto profilo', { a: 'image/jpeg,image/png,imgage/jpg,application/pdf', s: 2048, sP: true, wS: 'col-md-6' }),
					curriculum: new FormField('curriculum-input', 'file', 'Curriculum', { a: 'application/pdf,text/plain', s: 2048, sP: true, wS: 'col-md-6' }),
					_method: new FormField('form-method', 'hidden', 'method', { v: 'PATCH' }),
				},
				isResponseStatusSuccess: false,
				store,
				dashboardStore,
			}
		},
		components: {
			Multiselect,
			AppAlert,
			AppForm
		},
		methods: {

			handlePhoto(photo) {
				this.formData.photo = photo;
			},

			handleCurriculum(curriculum) {
				this.formData.curriculum = curriculum;
			},

			updateProfile() {
				axios.post(this.store.apiUri + 'profiles', this.formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true
				})
					.then(response => {
						// console.log('Profile updated', response.data);
						this.isResponseStatusSuccess = true;
						emitter.emit('reset-dashboard-header');
					})
					.catch(function (error) {
						// console.log('profile update error: ', error.response.data.errors);
					})
					.finally(function () {
						// always executed
					});
			},
			validateForm() {
				this.isResponseStatusSuccess = false;
				this.resetErrorsFields();
				// if (!this.formData.first_name) {
				//     this.errors.first_name = 'Il nome è obbligatorio.';
				// } else if (this.formData.first_name.length <= 2) {
				//     this.errors.first_name = 'Il nome deve contenere almeno 3 caratteri.';
				// };
				// if (!this.formData.last_name) {
				//     this.errors.last_name = "Il cognome è obbligatorio."
				// } else if (this.formData.last_name.length <= 2) {
				//     this.errors.last_name = "Il cognome deve contenere almeno 3 caratteri."
				// };
				if (!this.formData.email) {
					this.errors.email = "L'email è obbligatoria.";
				} else if (!this.validEmail(this.formData.email)) {
					this.errors.email = "L'email inserita non è valida.";
				}
				// if (!this.formData.password) { this.errors.password = "La password è obbligatoria." }
				// else if (!this.validPassword(this.formData.password)) { this.errors.password = "La password deve contenere almeno una maiuscola, una minuscola ed un numero" };
				if (!this.formData.phone) { this.errors.phone = "Il numero di telefono è obbligatorio." }
				// else if (isNaN(this.formData.phone)) { this.errors.phone = "Il numero di telefono può contenere solo numeri" };
				if (!this.formData.office_address) this.errors.office_address = "L'indirizzo è obbligatorio.";
				if (!this.formData.specializations.length) this.errors.specializations = "Inserire almeno una specializzazione.";
				if (!this.formData.services) this.errors.services = "Inserire almeno una prestazione.";
				// if (!this.formData.photo) this.errors.photo = "La foto è obbligatoria";
				// if (!this.formData.curriculum) this.errors.curriculum = "Il curriculum è obbligatorio.";

				if (!this.errors.phone &&
					!this.errors.office_address &&
					!this.errors.specializations &&
					!this.errors.services &&
					!this.errors.photo &&
					!this.errors.curriculum
				) {
					this.validated = true;
					this.updateProfile();
				}
				// console.log(this.formData);
				// console.log(this.errors);
			},
			validEmail(email) {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			},
			getProfileData() {
				axios.get(this.store.apiUri + 'profiles/edit', { withCredentials: true })
					.then(({ data: { data } }) => {
						const { doctor, doctor: { specializations }, ...usableData } = data;
						const userData = { ...doctor, specializations_id: specializations, ...usableData };

						for (const key in this.formElements) {
							if (key !== '_method') this.formElements[key].value = userData[key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)];
							// console.log(`value inserted in 'this.formElements['${key}'].value'-->`, this.formElements[key].value);
						}
					})
					.catch(function (err) {
						// console.error(err)
					})
					.finally(function () {
						// always executed
					});
			},
			customValidation(formInstance) {
				const data = formInstance.formData;
				const elements = formInstance.elements;
				const errors = formInstance.errors;
				// Prepare a 'send' property on 'formData' to track what values have changed
				data.send = [];

				for (const field in data) {
					// Prevent logic for '_method'
					if (['_method', 'send'].includes(field)) continue;

					const value = data[field];
					const previousValue = elements[field].value;
					const label = elements[field].label;

					// Decide how to evaluate if input's content changed
					let isChanged = false;
					if (['photo', 'curriculum'].includes(field)) isChanged = !!value;
					else if (field === 'specializationsId') {
						let allPreviousArePresent = true;
						let sameNumberOfSpecs = true;

						for (const el in value) {
							if (!value.every(({ id }) => previousValue.some(({ id: prevId }) => prevId === id))) allPreviousArePresent = false;
						}
						if (!(value.length === previousValue.length)) sameNumberOfSpecs = false;

						if (!allPreviousArePresent || !sameNumberOfSpecs) isChanged = true;
					}
					else isChanged = value !== previousValue;
					if (isChanged) console.log(field + ': \'' + value + '\' has changed (\'isChanged\'=' + isChanged + ')');

					if (isChanged) {
						// Register new field to send
						data.send.push(field);

						if (field === 'phone' && value) {
							// Use regex 
							const reResult = /^\+?\d[\d\s]*$/.test(value);
							if (!reResult) errors[field] = `Il ${label.toLowerCase()} può essere composto da numeri separati da spazi ed eventualmente iniziare con un prefisso '+##'`;
						}
						else if (field === 'officeAddress' && value.length > 50) errors[field] = `L\'${label.toLowerCase()} non può essere più lungo di 50 caratteri`;
						else if (field === 'services' && !value) errors[field] = `Le ${label.toLowerCase()} sono obbligatorie`;
						else if (field === 'photo' || field === 'curriculum' && value === null) errors[field] = '';
					}
					// Remove errors cause in this case they are not relevant
					else {
						errors[field] = '';
						// Register fields to send
					}
				}
			}
		},
		computed: {
		},
		setup() {
			const { handleUploadedNewFile } = useHandler();

			return { handleUploadedNewFile };
		},
		created: function () {
			this.getProfileData();
		},
	}
</script>

<template>
	<div class="container py-3"
		v-if="Object.values(formElements).filter(el => el.value).map(el => el.value).length === Object.entries(formElements).length">
		<header class="page-header row">
			<div class="col-2">
				<button class="btn back-arrow align-self-center"
					@click="dashboardStore.currentProfileSectionComponentIndex = 0">
					<i class="fa-solid fa-circle-arrow-left fa-xl"></i></button>
			</div>
			<h1 class="col-8 text-center">Modifica le tue informazioni</h1>
		</header>


		<!-- Alert -->
		<div class="col-6" v-if="isResponseStatusSuccess">
			<AppAlert class="alert-success d-flex">
				<div class="col alert-body">
					I tuoi dati sono stati aggiornati.
				</div>
				<div class="alert-footer">
					<button type="button" class="btn btn-primary" @click="dashboardStore.currentProfileSectionComponentIndex = 0">
						Torna al profilo
					</button>
				</div>
			</AppAlert>
		</div>

		<AppForm class="user-data-form" id="" :doctorInfo="null" :apiRouteAndMethod="{ route: 'profiles', method: 'post' }"
			:elements="formElements" :nameArtConc="['modifica di profilo', 'la', 'a']" :wrapperInnerDiv="['row']"
			:perfectValidation="customValidation" :optionalPropsObject="{ handleUploadedNewFile, showPreviousFiles: true }" />
	</div>

</template>

<style scoped lang="scss">

	.file-input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.btn-submit {
		background-color: var(--color-secondary);
	}

	.btn-reset {
		background-color: var(--color-tertiary);
		color: white;

		&:hover {
			color: black;
		}
	}

	.invalid {
		color: red;
	}

	.invalid-input {
		border-color: red;
	}

	.alert-footer button {
		background-color: var(--color-complementary);
		border-color: var(--color-complementary);
	}
</style>
