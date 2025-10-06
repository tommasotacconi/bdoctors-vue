<script>
	import axios from "axios";
	import Multiselect from "../../../Generics/Multiselect.vue";
	import PhotoUpload from "../../../Generics/PhotoUpload.vue";
	import CvUpload from "../../../Generics/CvUpload.vue";
	import AppAlert from "../../../Generics/AppAlert.vue";
	import { store } from "../../../../../js/store";
	import { dashboardStore } from "../../../../../js/dashboardStore";
	import { emitter } from "../../../../../js/eventBus";


	export default {
		data() {
			return {
				formData: {
					// user_id: localStorage.getItem('user_id'),
					// profile_id: localStorage.getItem('profile_id'),
					first_name: "",
					last_name: "",
					// email: "",
					// password: "",
					phone: "",
					office_address: "",
					specializations: "",
					services: "",
					photo: null,
					// photoUrl: "",
					curriculum: null,
					// curriculumUrl: "",
					// Set method to enable a content-type header with form-data 
					_method: 'PATCH'
				},
				oldSpecializations: [],
				oldPhoto: '',
				oldCurriculum: '',
				apiUrl: 'http://127.0.0.1:8000/api/profiles/edit/',
				errors: {
					// first_name: "",
					// last_name: "",
					// email: "",
					// password: "",
					phone: "",
					office_address: "",
					specializations: "",
					services: "",
					photo: "",
					curriculum: ""
				},
				isResponseStatusSuccess: false,
				store,
				dashboardStore,
			}
		},
		components: {
			Multiselect,
			PhotoUpload,
			CvUpload,
			AppAlert
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

			resetErrorsFields() {
				this.errors.first_name = '';
				this.errors.last_name = '';
				this.errors.email = '';
				this.errors.password = '';
				this.errors.phone = '';
				this.errors.office_address = '';
				this.errors.specializations = '';
				this.errors.services = '';
				this.errors.photo = '';
				this.errors.curriculum = '';
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
			validPassword(password) {
				const lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
				const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
				const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

				let isLowercase = false;
				let isUppercase = false;
				let isNumber = false;

				for (let i = 0; i < password.length; i++) {
					const char = password[i];
					if (lowercase.includes(char)) isLowercase = true;
					if (uppercase.includes(char)) isUppercase = true;
					if (numbers.includes(char)) isNumber = true;
				}

				return isLowercase && isUppercase && isNumber;
			},

			updateSpecs(specializations) {
				// Prepare a constant array result to insert ids value
				const result = [];
				// Insert ids taken from specializations parameter in reactive variable specializations, property of errors --CHECK THIS COMMENT-- 
				for (let i = 0; i < specializations.length; i++) {
					result.push(specializations[i].id);
				}
				this.formData.specializations = result;
				// console.log('--current specializations--', this.formData.specializations);
			},

			getProfileData() {
				axios.get(this.store.apiUri + 'profiles/edit', {
					withCredentials: true
				})
					.then(response => {
						// console.log(response);
						this.formData.user_id = response.data.data.doctor.id;
						this.formData.first_name = response.data.data.doctor.first_name;
						this.formData.last_name = response.data.data.doctor.last_name;
						this.formData.email = response.data.data.doctor.email;
						this.formData.phone = response.data.data.phone;
						this.formData.office_address = response.data.data.office_address;
						// Insert only ids of specializations in formData.specializations
						this.formData.specializations = response.data.data.doctor.specializations.map(e => e.id);
						this.oldSpecializations = response.data.data.doctor.specializations;
						this.formData.services = response.data.data.services;
						this.oldPhoto = response.data.data.photo;
						this.oldCurriculum = response.data.data.curriculum;
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
				this.$router.push({ name: 'dashboard', params: { id: this.formData.profile_id } });
			}
		},
		computed: {
		},
		created: function () {
			this.getProfileData();
		},
	}
</script>

<template>
	<div class="container py-3" v-if="formData.first_name">
		<header class="page-header row">
			<button class="btn back-arrow col-1" @click="dashboardStore.currentProfileSectionComponentIndex = 0">
				<i class="fa-solid fa-circle-arrow-left fa-2xl"></i></button>
			<h1 class="col-10 text-center">Modifica le tue informazioni</h1>
		</header>

		<form action="" method="POST" class="row py-4 my-4" id="edit-form" @submit.prevent="validateForm" novalidate>

			<div class="mb-3 col-3">
				<label for="first_name" class="form-label me-3">Nome</label>
				<div class="fw-bold" v-html="formData.first_name"></div>
			</div>
			<div class="mb-3 col-3">
				<label for="last_name" class="form-label">Cognome </label>
				<div class="fw-bold" v-html="formData.last_name"></div>
			</div>
			<div class="mb-3 col">
				<label for="phone" class="form-label">Telefono</label>
				<input type="tel" class="form-control" :class="{ 'invalid-input': errors.phone }" id="phone"
					v-model.trim="formData.phone" required>
				<div class="invalid" v-if="errors.phone">
					<p> {{ errors.phone }} </p>
				</div>
			</div>
			<div class="mb-3 col-6">
				<label for="office_address" class="form-label">Indirizzo</label>
				<input type="text" class="form-control" :class="{ 'invalid-input': errors.office_address }" id="office_address"
					v-model='formData.office_address' required>
				<div class="invalid" v-if="errors.office_address">
					<p> {{ errors.office_address }} </p>
				</div>
			</div>
			<!-- <div class="mb-3 col-6">
                    <label for="specializations" class="form-label">Specializzazioni</label>
                    <select class="form-select" aria-label="Default select example" id="specializations"
                        v-model="formData.specializations" >
                        <option disabled selected>Seleziona la/e tua/e specializzazione/i</option>
                        <option value="surgery">Chirurgia</option>
                        <option value="cardiology">Cardiologia</option>
                        <option value="ophthalmology">Oculistica</option>
                    </select>
                </div> -->
			<div class="mb-3 col-6">
				<label for="specializations" class="form-label">Specializzazioni</label>
				<Multiselect @send-values="updateSpecs" :specializations="oldSpecializations" />
				<div class="invalid" v-if="errors.specializations">
					<p> {{ errors.specializations }} </p>
				</div>
			</div>
			<div class="mb-3">
				<label for="services" class="form-label">Prestazioni</label>
				<textarea class="form-control" :class="{ 'invalid-input': errors.services }" id="services"
					v-model="formData.services" required></textarea>
				<div class="invalid" v-if="errors.services">
					<p> {{ errors.services }} </p>
				</div>
			</div>
			<div class="mb-3 col-6">
				<label for="photo" class="form-label mb-3">
					Foto profilo <span class="badge text-bg-secondary">{{ 'file presenti:' + (oldPhoto ? '1' : '0') }}</span>
				</label>
				<div class="file-input d-flex flex-column align-items-center">
					<PhotoUpload v-model="formData.photo" @file-selected="handlePhoto"></PhotoUpload>
					<!-- <input type="text" class="form-control" :class="{ 'invalid-input': errors.photo }" id="photo"
                    placeholder="Inserisci un file valido" @change="formData.photo" required> -->
					<div class="invalid" v-if="errors.photo">
						<p> {{ errors.photo }} </p>
					</div>
				</div>
			</div>
			<div class="mb-3 col-6">
				<label for="curriculum" class="form-label mb-3">
					Curriculum Vitae <span class="badge text-bg-secondary">{{ 'file presenti:' + (oldPhoto ? '1' : '0') }}</span>
				</label>
				<div class="file-input d-flex flex-column align-items-center">
					<CvUpload v-model="formData.curriculum" @cv-selected="handleCurriculum"></CvUpload>
					<!-- <input type="text" class="form-control" :class="{ 'invalid-input': errors.curriculum }" id="curriculum"
                    placeholder="Inserisci un file valido" @change="formData.curriculum" required> -->
					<div class="invalid" v-if="errors.curriculum">
						<p> {{ errors.curriculum }} </p>
					</div>
				</div>
			</div>
			<div class="mb-3">
				<!-- <button type="submit" class="btn me-2 btn-submit">Modifica</button>
                    <button type="reset" class="btn btn-reset">Reset</button> -->
				<button type="submit" class="btn btn-submit me-2 mt-4" data-bs-toggle="myModal" data-bs-target="myModal"
					:disabled="isResponseStatusSuccess">Modifica</button>
				<button type="reset" class="btn btn-reset mt-4" :disabled="isResponseStatusSuccess">Reset</button>
			</div>

			<!-- Alert -->
			<div class="col-6" v-if="isResponseStatusSuccess">
				<AppAlert class="alert-success d-flex">
					<div class="col alert-body">
						I tuoi dati sono stati aggiornati.
					</div>
					<div class="alert-footer">
						<button type="button" class="btn btn-primary"
							@click="dashboardStore.currentProfileSectionComponentIndex = 0">
							Torna al profilo
						</button>
					</div>
				</AppAlert>
			</div>

		</form>
	</div>

</template>

<style scoped lang="scss">

	#edit-form,
	#errors {
		border: 1px solid;
		border-radius: 20px;
	}

	.btn.back-arrow {
		padding-left: 0;
		color: var(--color-primary);

		transition: color 0.3s;
		text-align: start;

		&:hover {
			color: var(--color-secondary);
		}
	}


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
