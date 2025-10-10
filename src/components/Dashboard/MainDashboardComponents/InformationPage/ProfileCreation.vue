<script>
	import axios from "axios";
	import { store } from "../../../../../js/store.js";
	import Multiselect from "../../../Generics/Multiselect.vue";
	import AppAlert from "../../../Generics/AppAlert.vue";
	import { dashboardStore } from "../../../../../js/dashboardStore.js";
	import { emitter } from "../../../../../js/eventBus.js";
	import AppForm from "../../../Generics/AppForm.vue";
	import FormField from "../../../../../js/utils/FormField.js";

	export default {
		data() {
			return {
				formData: {
					//user_id: localStorage.getItem('user_id'),
					phone: "",
					office_address: "",
					specializations: "",
					services: "",
					photo: null,
					curriculum: null,
					user_id: store.informationPageId
				},
				apiUrl: 'http://127.0.0.1:8000/api/profiles',
				errors: {
					phone: "",
					office_address: "",
					services: "",
					photo: "",
					curriculum: ""
				},
				validated: false,
				isResponseStatusSuccess: false,
				store,
				dashboardStore,
				profileData: {},
				// List of all form all elements to select from the singular form  
				formElements: {
					firstName: new FormField('first-name-input', 'text', 'Nome', { d: true, wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'text', 'Cognome', { d: true, wS: 'col-md-6' }),
					phone: new FormField('phone-input', 'tel', 'Telefono ufficio', { p: 'numero di telefono senza prefisso', wS: 'col-md-6' }),
					officeAddress: new FormField('office-address-input', 'text', 'Indirizzo d\'ufficio', { p: 'Piazza/Via...', wS: 'col-md-6' }),
					services: new FormField('services-input', 'textarea', 'Prestazioni erogate', { p: 'Inicare le prestazioni prefissandole con un asterisco', wS: 'col-md-12' }),
					photo: new FormField('photo-input', 'file', 'Foto profilo', { wS: 'col-md-6' }),
					curriculum: new FormField('curriculum-input', 'file', 'Curriculum', { wS: 'col-md-6' }),
				}
			}
		},
		components: {
			AppForm,
			Multiselect,
			AppAlert,
		},

		methods: {
			isObjectEmpty(objectName) {
				return objectName && Object.entries(objectName).length === 0 && objectName.constructor === Object;
			},
			handleUploadedNewFile(file, formData, errors, field) {
				errors[field] = '';

				if (file && !this.isObjectEmpty(file)) formData[field] = file;
				else errors[field] = `Inserire un file di dimensioni non superiori a 2048KB e del tipo indicato nel selettore di file`;
			},
			customValidation(formInstance) {
				const data = formInstance.formData;
				const elements = formInstance.elements;
				const errors = formInstance.errors;

				for (const field in data) {
					const value = data[field];
					const label = elements[field].label;
					console.log(field, ': ', value);

					if (field === 'phone' && value) {
						// Use regex 
						const reResult = /^\+?\d[\d\s]*$/.test(value);
						if (!reResult) errors[field] = `Il ${label.toLowerCase()} può essere composto da numeri separati da spazi ed eventualmente iniziare con un prefisso '+##'`;
					}
					else if (field === 'officeAddress' && value.length > 50) errors[field] = `L\'${label.toLowerCase()} non può essere più lungo di 50 caratteri`;
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
			openProfile() {
				// Once the user's been redirected to his profile, the modal's backdrop disappears
				// const backdrop = document.querySelector('.modal-backdrop');
				// if (backdrop) {
				//     backdrop.remove();
				// }
				// redirect to user profile
				this.$router.push({ name: 'dashboard', params: { id: this.profileData.id } });
			}
			// onPickFile() {
			//     this.$refs.fileInput.click()
			// },
			// onFilePicked(event) {
			//     const files = event.target.files
			//     let filename = files[0].name
			//     const fileReader = new FileReader()
			//     fileReader.addEventListener('load', () => {
			//         this.imageUrl = fileReader.result
			//     })
			//     fileReader.readAsDataURL(files[0])
			//     this.photo = files[0]
			// },
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

		<!-- Form -->
		<AppForm class="user-data-form" id="" :apiRoute="'profiles'" :elements="formElements" :doctorInfo="null"
			:wrapperInnerDiv="['row']" :perfectValidation="customValidation"
			:optionalPropsObject="{ handleUploadedNewFile }" />
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
		color: #fff;
		transition: color 0.3s;
		padding: 10px 0;
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
