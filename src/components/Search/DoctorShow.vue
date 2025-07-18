<script>
	import axios from 'axios';
	import { store } from '../../../js/store.js';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';

	export default {
		data() {
			return {
				profileData: {},
				// loader temporary cancelled
				loaded: false,
				store,
				doctorInfo: {
					first_name: null,
					last_name: null,
					homonymous_id: null,
				},
				messageForm: {
					first_name: '',
					last_name: '',
					email: '',
					content: '',
				},
				reviewForm: {
					first_name: '',
					last_name: '',
					email: '',
					content: '',
					votes: ''
				},
				errors: {
					messageForm: {
						first_name: '',
						last_name: '',
						email: "",
						content: ''
					},
					reviewForm: {
						first_name: '',
						last_name: '',
						email: "",
						content: '',
						votes: null,
					}

				},
				messageFormValidated: false,
				reviewFormValidated: false,
			}
		},
		components: {
		},
		methods: {
			setDoctorInfo() {
				const name = this.$route.params.name;
				// Match fisrst name and last name
				let re = /\w+/g;
				let result = name.match(re);
				const firstName = result[0];
				const lastName = result[1];
				this.doctorInfo.first_name = firstName;
				this.doctorInfo.last_name = lastName;
				// Match homonymous id
				re = /\d+/g;
				result = '';
				result = name.match(re)
				if (result !== null) {
					const homonymousId = result[0];
					this.doctorInfo.homonymous_id = homonymousId;
				}
			},
			getProfileData() {
				axios.get(this.store.apiUri + 'profiles/' + this.$route.params.name)
					.then(response => {
						console.log(response);
						this.profileData = response.data.profile;
						this.loaded = true;
						this.$emit('loaded-pop-up');
					})
					.catch(function (error) {
						console.log(error);
					});
			},
			// Method to send patients messages
			sendMessageForm() {
				axios.post('http://localhost:8000/api/messages', {
					doctor_details: this.doctorInfo,
					...this.messageForm,
				})
					.then(response => {
						console.log('Message sent.', response.data)
					})
					.catch(function (error) {
						// handle error
						console.error(error)
						console.log(error.response.data);
					})
					.finally(function () {
						// always executed
					});
			},
			// Method to send patients reviews
			sendReviewForm() {
				axios.post('http://localhost:8000/api/reviews', {
					doctor_details: this.doctorInfo,
					...this.reviewForm,
				})
					.then(response => {
						console.log('Review sent.', response.data)
					})
					.catch(function (error) {
						// handle error
						console.error(error)
						console.log(error.response.data.errors);
					})
					.finally(function () {
						// always executed
					});
			},
			//Validation methods
			resetErrorsMessageFields() {
				this.errors.messageForm.first_name = '';
				this.errors.messageForm.last_name = '';
				this.errors.messageForm.email = '';
				this.errors.messageForm.content = '';
			},
			resetErrorsReviewFields() {
				this.errors.reviewForm.first_name = '';
				this.errors.reviewForm.last_name = '';
				this.errors.reviewForm.email = '';
				this.errors.reviewForm.content = '';
				this.errors.reviewForm.votes = '';
			},
			validEmail(email) {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			},
			validateMessageForm() {
				this.resetErrorsMessageFields();
				if (!this.messageForm.first_name) {
					this.errors.messageForm.first_name = 'Il nome è obbligatorio.';
				} else if (this.messageForm.first_name.length <= 2) {
					this.errors.messageForm.first_name = 'Il nome deve contenere almeno 3 caratteri.';
				};
				if (!this.messageForm.last_name) {
					this.errors.messageForm.last_name = "Il cognome è obbligatorio."
				} else if (this.messageForm.last_name.length <= 2) {
					this.errors.messageForm.last_name = "Il cognome deve contenere almeno 3 caratteri."
				};
				if (!this.messageForm.email) {
					this.errors.messageForm.email = "L'email è obbligatoria.";
				} else if (!this.validEmail(this.messageForm.email)) {
					this.errors.messageForm.email = "L'email inserita non è valida.";
				}
				if (!this.messageForm.content) {
					this.errors.messageForm.content = "Inserisci il corpo del messaggio"
				}

				if (!this.errors.messageForm.first_name &&
					!this.errors.messageForm.last_name &&
					!this.errors.messageForm.email &&
					!this.errors.messageForm.content
				) {
					this.messageFormValidated = true;
					this.sendMessageForm();
				}

				console.log(this.messageForm);
				console.log(this.errors.messageForm);
			},
			validateReviewForm() {
				this.resetErrorsReviewFields();
				if (!this.reviewForm.first_name) {
					this.errors.reviewForm.first_name = 'Il nome è obbligatorio.';
				} else if (this.reviewForm.first_name.length <= 2) {
					this.errors.reviewForm.first_name = 'Il nome deve contenere almeno 3 caratteri.';
				};
				if (!this.reviewForm.last_name) {
					this.errors.reviewForm.last_name = "Il cognome è obbligatorio."
				} else if (this.reviewForm.last_name.length <= 2) {
					this.errors.reviewForm.last_name = "Il cognome deve contenere almeno 3 caratteri."
				};
				if (!this.reviewForm.email) {
					this.errors.reviewForm.email = "L'email è obbligatoria.";
				} else if (!this.validEmail(this.reviewForm.email)) {
					this.errors.reviewForm.email = "L'email inserita non è valida.";
				}
				if (!this.reviewForm.content) {
					this.errors.reviewForm.content = "Inserisci il corpo del messaggio"
				}
				if (!this.reviewForm.votes) {
					this.errors.reviewForm.votes = "Devi inserire da 1 a 5 stetoscopi per poter inviare la tua recensione"
				}

				if (!this.errors.reviewForm.first_name &&
					!this.errors.reviewForm.last_name &&
					!this.errors.reviewForm.email &&
					!this.errors.reviewForm.content &&
					!this.errors.reviewForm.votes
				) {
					this.reviewFormValidated = true;
					this.sendReviewForm();
				}
			},
			resetMessageForm() {
				this.messageFormValidated = false;
				this.messageForm.first_name = '';
				this.messageForm.last_name = '';
				this.messageForm.email = '';
				this.messageForm.content = '';
			},
			resetReviewForm() {
				this.reviewFormValidated = false;
				this.reviewForm.first_name = '';
				this.reviewForm.last_name = '';
				this.reviewForm.email = '';
				this.reviewForm.content = '';
				this.reviewForm.votes = null;
			}
		},
		props: {
			searchedSpecialization: {
				type: String,
				required: false
			}
		},
		computed: {
			retrievedProfileData() {
				return this.store.doctorProfile ? this.store.doctorProfile : this.profileData;
			},
			otherDoctorSpecializations() {
				if (!this.searchedSpecialization) return undefined;

				const specializationParam = this.$route.params.specialization;
				let searchedSpecialization = specializationParam.replace(/-/g, ' ').replace(/_/g, '-');
				searchedSpecialization = searchedSpecialization[0].toUpperCase() + searchedSpecialization.slice(1);
				const allDoctorSpecializations = this.store.doctorProfile?.user.specializations;

				return allDoctorSpecializations?.filter(({ name }) => name !== searchedSpecialization);
			},
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
		created: function () {
			this.setDoctorInfo();

			if (!this.store.doctorProfile) {
				this.getProfileData();

				return;
			}
			else if (this.store.doctorProfile) this.$emit('loaded-pop-up');
			this.loaded = true;
		},
	}
</script>

<template>
	<main>
		<div class="d-flex justify-content-center container">
			<Loader v-if="!loaded" />
			<section class="card-general" v-else>
				<div class="card mb-3">
					<div class="card-header">
						<div class="img-doctor">
							<img :src="getProfilePhotoPath(this.store.placeholderImg, retrievedProfileData.photo)"
								class="doctor-photo" alt="doctor photo">
						</div>
						<div class="card-body-title-section">
							<h1 class="card-title py-3">
								Dott. {{ retrievedProfileData.user.first_name }} {{ retrievedProfileData.user.last_name }}
							</h1>
							<div class="title-specializations d-flex">
								<h4 class="text-start">
									Specialista in:
								</h4>
								<ul class="specializations-list">
									<li class="specializations-list-item" v-if="retrievedProfileData.specialization_name">
										{{ retrievedProfileData.specialization_name }}</li>
									<template v-else-if="retrievedProfileData.user.specializations.length">
										<li class="specializations-list-item"
											v-for="specialization in retrievedProfileData.user.specializations">
											{{ specialization.name }}</li>
									</template>
									<li v-else>{{ 'Nessuna specializzazione indicata' }}</li>
								</ul>
							</div>
							<p class="address">
								<i class="fa-solid fa-location-dot"></i>{{ retrievedProfileData.office_address }}
							</p>
							<button class="btn btn-close" v-if="$route.name !== 'search'" @click="$router.push({
								name: 'specializationDoctors', params: { specialization: $route.params.specialization }
							})"></button>
						</div>
					</div>
					<div class="card-body-text-section d-flex justify-content-between">

						<div class="left-content col-5 py-3">
							<h5>Informazioni aggiuntive</h5>
							<ul class="d-flex flex-wrap row-gap-3 ul-child-elements py-3">
								<li id="curriculum-border" class="card-list-item">
									<h3>Curriculum</h3>
									<div class="data-element curriculum-element">
										Curriculum.pdf
									</div>
								</li>
								<li id="specialization-border" class="card-list-item" v-if="otherDoctorSpecializations?.length">
									<h3>Altre specializzazioni</h3>
									<div class="data-element specializations-element">
										<ul class="specializations-list">
											<li class="specializations-list-item" v-for="specialization in otherDoctorSpecializations">{{
												specialization.name }}</li>
										</ul>
									</div>
									<!-- {{ profileData.doctor.specializations[0].name }} -->
								</li>
								<li id="address-border" class="card-list-item">
									<h3>Indirizzo</h3>
									<div class="data-element address-element">
										{{ retrievedProfileData.office_address }}
									</div>
									<!-- {{ profileData.office_address }} -->
								</li>
								<li id="phone-border" class="card-list-item">
									<h3>Telefono</h3>
									<div class="data-element telephone-element">
										{{ retrievedProfileData.phone }}
									</div>
									<!-- {{ profileData.phone }} -->
								</li>
								<li id="services-border" class="card-list-item">
									<h3>Prestazioni</h3>
									<div class="data-element services-element">
										{{ retrievedProfileData.services }}
									</div>
									<!-- {{ profileData.services }} -->
								</li>
							</ul>
						</div>
						<div class="right-content col-5">
							<div class="forms">
								<!-- Message Form -->
								<h5 class="my-3">Contatta lo specialista</h5>
								<div class="form-frame">
									<form id="message-form" class="form-control py-3" @submit.prevent="validateMessageForm" novalidate
										v-if="messageFormValidated === false">
										<div class="mb-3 col-12">
											<label for="first_name" class="form-label">Nome</label>
											<input type="text" placeholder="Inserisci il tuo nome" class="form-control"
												:class="{ 'invalid-input': errors.messageForm.first_name }" id="first_name"
												v-model.trim="messageForm.first_name" required>
											<div class="invalid" v-if="errors.messageForm.first_name">
												<p> {{ errors.messageForm.first_name }} </p>
											</div>
										</div>
										<div class="mb-3 col-12">
											<label for="last_name" class="form-label">Cognome</label>
											<input type="text" placeholder="Inserisci il tuo cognome" class="form-control"
												:class="{ 'invalid-input': errors.messageForm.last_name }" id="last_name"
												v-model.trim="messageForm.last_name" required>
											<div class="invalid" v-if="errors.messageForm.last_name">
												<p> {{ errors.messageForm.last_name }} </p>
											</div>
										</div>
										<div class="mb-3 col-12">
											<label for="email" class="form-label">Email</label>
											<input type="email" class="form-control" :class="{ 'invalid-input': errors.messageForm.email }"
												id="email" placeholder="Inserisci il tuo indirizzo email" v-model.trim="messageForm.email"
												required>
											<div class="invalid" v-if="errors.messageForm.email">
												<p> {{ errors.messageForm.email }} </p>
											</div>
										</div>
										<div class="mb-3 col-12">
											<label for="content" class="form-label align-start">Messaggio</label>
											<textarea class="form-control" placeholder="Scrivi qui il tuo messaggio"
												:class="{ 'invalid-input': errors.messageForm.content }" id="content" rows="3"
												v-model="messageForm.content"></textarea>
											<div class="invalid" v-if="errors.messageForm.content">
												<p> {{ errors.messageForm.content }} </p>
											</div>
										</div>
										<button type="submit" class="btn btn-primary btn-submit"
											:class="{ 'disabled': messageFormValidated === true }">Invia
											messaggio</button>
									</form>

									<div v-else class="my-3">
										<p class="my-2">
											Il tuo messaggio è stato inviato correttamente.
										</p>
										<button type="button" @click="resetMessageForm" class="btn btn-sm btn-primary">Conferma</button>
									</div>
								</div>

								<div class="my-3 py-3">
									<h5 class="my-3">Lascia una recensione</h5>
									<div class="form-frame">
										<form id="review-form" class="form-control py-3" @submit.prevent="validateReviewForm" novalidate
											v-if="reviewFormValidated === false">

											<div class="mb-3 col-12">
												<label for="first_name" class="form-label">Nome</label>
												<input type="text" class="form-control" placeholder="Inserisci il tuo nome"
													:class="{ 'invalid-input': errors.reviewForm.first_name }" id="first_name"
													v-model.trim="reviewForm.first_name" required>
												<div class="invalid" v-if="errors.reviewForm.first_name">
													<p> {{ errors.reviewForm.first_name }} </p>
												</div>
											</div>
											<div class="mb-3 col-12">
												<label for="last_name" class="form-label">Cognome</label>
												<input type="text" class="form-control" placeholder="Inserisci il tuo cognome"
													:class="{ 'invalid-input': errors.reviewForm.last_name }" id="last_name"
													v-model.trim="reviewForm.last_name" required>
												<div class="invalid" v-if="errors.reviewForm.last_name">
													<p> {{ errors.reviewForm.last_name }} </p>
												</div>
											</div>
											<div class="mb-3 col-12">
												<label for="email" class="form-label">Email</label>
												<input type="email" class="form-control" :class="{ 'invalid-input': errors.reviewForm.email }"
													id="email" placeholder="Inserisci il tuo indirizzo email" v-model.trim="reviewForm.email"
													required>
												<div class="invalid" v-if="errors.reviewForm.email">
													<p> {{ errors.reviewForm.email }} </p>
												</div>
											</div>
											<div class="mb-3 col-12">
												<label for="content" class="form-label align-start">Messaggio</label>
												<textarea class="form-control" placeholder="Scrivi qui il tuo messaggio"
													:class="{ 'invalid-input': errors.reviewForm.content }" id="content" rows="3"
													v-model="reviewForm.content"></textarea>
												<div class="invalid" v-if="errors.reviewForm.content">
													<p> {{ errors.reviewForm.content }} </p>
												</div>
											</div>
											<div class="votes">
												<input type="radio" id="vote5" name="votes" value="5" v-model="reviewForm.votes">
												<label for="vote5"><i class="fa-solid fa-stethoscope"></i>
												</label>
												<input type="radio" id="vote4" name="votes" value="4" v-model="reviewForm.votes">
												<label for="vote4"><i class="fa-solid fa-stethoscope"></i>
												</label>
												<input type="radio" id="vote3" name="votes" value="3" v-model="reviewForm.votes">
												<label for="vote3"><i class="fa-solid fa-stethoscope"></i>
												</label>
												<input type="radio" id="vote2" name="votes" value="2" v-model="reviewForm.votes">
												<label for="vote2"><i class="fa-solid fa-stethoscope"></i>
												</label>
												<input type="radio" id="vote1" name="votes" value="1" v-model="reviewForm.votes">
												<label for="vote1"><i class="fa-solid fa-stethoscope"></i>
												</label>
											</div>
											<div class="invalid mb-3" v-if="errors.reviewForm.votes">
												<p> {{ errors.reviewForm.votes }} </p>
											</div>
											<button type="submit" class="btn btn-primary btn-submit"
												:class="{ 'disabled': reviewFormValidated === true }">Invia
												recensione</button>
										</form>
										<div v-else class="my-3">
											<p class="my-2">
												La tua recensione è stata inviata correttamente.
											</p>
											<button type="button" @click="resetReviewForm" class="btn btn-sm btn-primary">Conferma</button>
										</div>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</main>
</template>

<style lang="scss" scoped>
	h1 {
		color: var(--color-complementary);
	}

	h4 {
		color: var(--color-primary);
	}

	h3 {
		font-size: 1.2rem;
	}

	h5 {
		margin: 0;
		color: var(--color-complementary);
	}

	p {
		margin: 0;
	}

	main {
		height: 100%;
		overflow: auto;
	}

	/* Card edit*/
	.card-general {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.card {
		min-height: 80vh;
		margin-top: 50px;
		border-radius: 40px;
		border: 3px solid #65B0FF;
		text-align: center;
		width: 100%;
		position: relative;

		.card-header {
			border-radius: 40px 40px 0 0;
			background-color: #D8F9FF;
			display: flex;
			flex-wrap: wrap;

			button.btn-close {
				position: absolute;
				--distance: 20px;
				top: var(--distance);
				right: var(--distance);
			}
		}
	}


	.img-doctor {
		max-width: 30%;
		flex-basis: 40%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 20px;
	}

	.doctor-photo {
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center;
	}

	.card img {
		width: 90%;
		margin: 15px;
		border-radius: 50%;
	}


	.card-body-title-section {
		display: flex;
		justify-content: center;
		flex-direction: column;
		flex-basis: 60%;
		align-items: start;
		padding: 20px;


		& .address {
			font-size: 1.1em;
			color: var(--color-primary);

			.fa-location-dot {
				margin-right: 10px;
			}
		}

		& .specializations-list {
			font-size: 1.3rem;
			color: var(--color-primary);
		}
	}


	.card-body-text-section {
		border-top: 2px solid var(--color-complementary);
		padding: 16px 50px;

		ul.ul-child-elements>* {
			flex-basis: 100%;
			min-height: 50px;
		}
	}

	.card-list-item {
		border: 1px grey;
		border-radius: 10px;
		box-shadow: -2px 2px 3px 1px var(--color-complementary);
		padding: 10px;
	}

	.card-list-item h3 {
		color: var(--color-primary);
	}

	.title-specializations ul {
		text-align: start;
		padding-left: 0;
		list-style-type: none;
		padding: 0 20px;
		color: var(--color-primary);
	}

	ul {
		text-align: start;
		padding-left: 0;
		list-style-type: none;
	}

	form {
		border-radius: 40px;
	}

	.form-frame {
		display: flex;
		min-height: 400px;
		justify-content: center;
		align-items: center;
		border-radius: 40px;
		border: 3px solid #65B0FF;
	}

	.edit-profile {
		background-color: var(--color-secondary);
		border-radius: 20px;
		padding: 8px 15px;
		text-decoration: none;
		color: var(--color-primary);
		font-weight: bold;
		border: 1px solid var(--color-primary);

		position: absolute;
		bottom: 15px;
		left: 50%;
		translate: -50% 0;
	}


	/* Card create */
	.card-create {
		padding: 30px 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		align-items: center;
	}

	.plus {
		border: 1px solid white;
		border-radius: 30px;
		display: inline;
		padding: 16px 26px;
		color: lightgray;
		background-color: white;
		width: 80px;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.create-profile-text {
		opacity: 0.5;
	}


	/* Message form */
	.invalid {
		color: red;
	}

	.invalid-input {
		border-color: red;
	}

	/*votes */
	.votes {
		margin-bottom: 20px;
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;

		& input {
			display: none;
		}

		& label {
			font-size: 24px;
			cursor: pointer;
		}

		& label:hover,
		& label:hover~label {
			color: var(--color-complementary)
		}

		& input:checked~label {
			color: var(--color-complementary)
		}
	}

	/* Responsive */
	@media (max-width: 576px) {
		.container {
			padding: 0 15px;
			/* Adjust the container padding */
		}

		.card-header {
			flex-direction: column;
			/* Stack the content vertically */
			align-items: center;
			/* Center align elements */
		}

		.card-body-title-section {
			text-align: center;
			/* Center the title and text */
		}

		.img-doctor img {
			width: 100%;
			min-width: 250px;
		}

		.card-body-text-section {
			flex-direction: column;
			/* Stack content vertically */
			padding-top: 20px;
		}

		.left-content,
		.right-content {
			width: 100%;
			/* Full width for each section */
			padding: 15px 0;
		}

		.form-frame {
			padding: 10px;
		}

		.votes input {
			width: 20px;
			/* Smaller radio buttons */
			height: 20px;
		}

		.votes label {
			font-size: 14px;
			/* Reduce font size */
		}

		.btn-submit {
			width: 100%;
			/* Full width button */
		}

		.specializations-list {
			display: block;
			margin-top: 10px;
		}

		.specializations-list-item {
			margin-bottom: 5px;
		}
	}

	@media (min-width: 768px) and (max-width: 991.98px) {
		.container {
			padding: 0 30px;
		}

		.card-header {
			flex-direction: row;
		}

		.card-body-text-section {
			flex-direction: row;
		}

		.left-content,
		.right-content {
			width: 48%;
			padding-right: 15px;
		}

		.form-frame form .form-control {
			width: 100%;
		}

		.votes input {
			margin-right: 5px;
		}
	}

	/* Desktop */
	@media (min-width: 992px) and (max-width: 1200px) {
		.container {
			padding: 0 50px;
		}

		.card-header {
			flex-direction: row;
		}

		.card-body-text-section {
			flex-direction: row;
		}

		.left-content,
		.right-content {
			width: 48%;
			padding-right: 15px;
		}

		.form-frame form .form-control {
			width: 100%;
		}

		.votes input {
			margin-right: 5px;
		}
	}

	/* Large Desktop */
	@media (min-width: 1200px) {
		.container {
			padding: 0 100px;
		}

		.card-header {
			flex-direction: row;
		}

		.card-body-text-section {
			flex-direction: row;
		}

		.left-content,
		.right-content {
			width: 48%;
			padding-right: 30px;
		}

		.form-frame form .form-control {
			width: 100%;
		}

		.votes input {
			margin-right: 10px;
		}
	}
</style>