<script>
	import axios from "axios";
	import { store } from "../../../../../js/store.js";
	import Multiselect from "../../../Generics/Multiselect.vue";
	import AppAlert from "../../../Generics/AppAlert.vue";
	import { dashboardStore } from "../../../../../js/dashboardStore.js";
	import { emitter } from "../../../../../js/eventBus.js";
	import AppForm from "../../../Generics/AppForm.vue";
	import FormField from "../../../../../js/utils/FormField.js";
	import { useHandler } from "../../../../../js/composables/useHandler.js";

	export default {
		data() {
			return {
				isResponseStatusSuccess: false,
				store,
				dashboardStore,
				profileData: {},
				// List of all form all elements to select from the singular form  
				formElements: {
					firstName: new FormField('first-name-input', 'text', 'Nome', { v: dashboardStore.tmp.first_name, d: true, wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'text', 'Cognome', { v: dashboardStore.tmp.last_name, d: true, wS: 'col-md-6' }),
					phone: new FormField('phone-input', 'tel', 'Telefono d\'ufficio', { p: '+39 333.../333...', wS: 'col-md-6' }),
					officeAddress: new FormField('office-address-input', 'text', 'Indirizzo d\'ufficio', { p: 'Piazza/Via...', wS: 'col-md-6' }),
					services: new FormField('services-input', 'textarea', 'Prestazioni erogate', { p: 'Indicare le prestazioni prefissandole con un asterisco', wS: 'col-md-12' }),
					photo: new FormField('photo-input', 'file', 'Foto profilo', { a: 'image/jpeg,image/png,imgage/jpg,application/pdf', s: 2048, wS: 'col-md-6' }),
					curriculum: new FormField('curriculum-input', 'file', 'Curriculum', { a: 'application/pdf,text/plain', s: 2048, wS: 'col-md-6' }),
				},
			}
		},
		components: {
			AppForm,
			Multiselect,
			AppAlert,
		},
		methods: {
			customValidation(formInstance) {
				const data = formInstance.formData;
				const elements = formInstance.elements;
				const errors = formInstance.errors;

				for (const field in data) {
					const value = data[field];
					const label = elements[field].label;

					if (field === 'phone' && value) {
						// Use regex further check on phone validity
						const reResult = /^\+?\d[\d\s]*$/.test(value);

						if (value.length > 20) errors[field] = `Il ${label.toLowerCase()} non può essere più lungo di 20 caratteri prefisso incluso`
						else if (!reResult) errors[field] = `Il ${label.toLowerCase()} può essere composto da numeri separati da spazi ed eventualmente iniziare con un prefisso '+##'`;
					}
					else if (field === 'officeAddress') {
						if (!value) errors[field] = errors[field].replace('Il', 'L\'');
						else if (value.length > 50) errors[field] = `L\'${label.toLowerCase()} non può essere più lungo di 50 caratteri`;
					}
					else if (field === 'services' && !value) errors[field] = `Le ${label.toLowerCase()} sono obbligatorie`;
				}
			},
			//commento per commit 2
			createProfile() {
				axios.post(this.store.apiUri + 'profiles', this.formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true
				})
					.then(response => {
						// console.log('created profiles', response.data);
						this.profileData = response.data.profile;
						this.isResponseStatusSuccess = true;
						emitter.emit('reset-dashboard-header');
						// Data da condividere all'interno degli altri componenti
						//store.profileDataGeneral = response.data.data
						//localStorage.setItem('user_id', response.data.data.doctor.id)
					})
					.catch(function (err) {
						// console.error(err)
					})
					.finally(function () {
						// always executed
					});
			},
		},
		computed: {
			firstName() {
				return;
			},
			lastName() {
				return this.dashboardStore.tmp.last_name;
			}
		},
		setup() {
			const { handleUploadedNewFile } = useHandler();

			return { handleUploadedNewFile };
		},

	}
</script>

<template>
	<div class="container py-3">
		<header class="page-header row">
			<div class="col-2 align-items-center">
				<button class="btn back-arrow" @click="dashboardStore.currentProfileSectionComponentIndex = 0">
					<i class="fa-solid fa-circle-arrow-left fa-xl"></i></button>
			</div>
			<h1 class=" col-8 text-center">Crea il tuo profilo</h1>
		</header>

		<!-- Alert
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
		</div> -->

		<!-- Form -->
		<AppForm class="user-data-form" id="" :doctorInfo="null" :apiRouteAndMethod="{ route: 'profiles', method: 'post' }"
			:elements="formElements" :nameArtConc="['nuovo profilo', 'il', 'o']" :wrapperInnerDiv="['row']"
			:perfectValidation="customValidation" :optionalPropsObject="{ handleUploadedNewFile }" />
	</div>

</template>

<style scoped lang="scss">
	@use '../../../../styles/forms';

	header {
		margin-bottom: 30px;

		h1 {
			margin-bottom: 0;
		}
	}

	.btn.back-arrow {
		width: 60px;
		padding: 10px 0;
		background-color: var(--color-primary);
		transition: 0.4s;

		&:hover {
			color: var(--color-secondary);
		}
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

	.alert-footer button {
		background-color: var(--color-complementary);
		border-color: var(--color-complementary);
	}

	:deep() {
		form {
			@include forms.set-fields-color(var(--color-secondary));

			textarea {
				height: 200px;
			}
		}
	}
</style>
