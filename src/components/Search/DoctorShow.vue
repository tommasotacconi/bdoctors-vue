<script>
	import axios from 'axios';
	import { store } from '../../../js/store.js';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';
	import { homepageStore } from '../../../js/homepageStore.js';
	import AppPopUpCard from '../Generics/AppPopUpCard.vue';
	import AppForm from '../Generics/AppForm.vue';
	import MessageForm from '../Generics/AppForm.vue';
	import ReviewForm from '../Generics/AppForm.vue';
	import { isNavigationFailure } from 'vue-router';
	import { KeepAlive } from 'vue';

	export default {
		data() {
			return {
				profileData: {},
				// loader temporary cancelled
				extraInfos: {
					curriculum: 'curriculum',
					specializations: 'altre specializzazioni',
					office_address: 'indirizzo',
					phone: 'telefono',
					services: 'prestazioni'
				},
				loaded: false,
				store,
				homepageStore,
				isSpecializationParamValid: undefined,
				doctorNotFound: false,
				doctorInfo: {
					first_name: null,
					last_name: null,
					homonymous_id: null,
				},
				// List of all form all elements to select from the singular form  
				formElements: {
					first_name: {
						id: 'firstName',
						type: 'text',
						label: 'Nome',
						placeholder: 'Inserisci il tuo nome'
					},
					last_name: {
						id: 'lastName',
						type: 'text',
						label: 'Cognome',
						placeholder: 'Inserisci il tuo cognome'
					},
					email: {
						id: 'email',
						type: 'email',
						label: 'Email',
						placeholder: 'Inserisci il tuo indirizzo email'
					},
					content: {
						id: undefined,
						label: undefined,
						placeholder: 'Scrivi qui'
					},
					vote: {
						id: 'vote',
						type: 'radio',
						label: 'Voto',
						placeholder: null
					}
				},
				messageApiRoute: 'messages',
				reviewApiRoute: 'reviews',
				currentFormType: null,
				formTitle: '',
				isCurrentFormShown: false,
				winInnerWidth: window.innerWidth,
			}
		},
		components: {
			AppPopUpCard,
			AppForm,
			MessageForm,
			ReviewForm
		},
		methods: {
			setDoctorInfo() {
				if (this.$route.params.specialization) {
					// Check specialization param's validity
					this.isSpecializationParamValid = this.homepageStore.allSpecializations.some(element => element.name.toLowerCase() === this.searchedSpecialization);

					if (this.isSpecializationParamValid && this.searchedDoctor) {
						const user = this.searchedDoctor.user;
						this.doctorInfo.first_name = user.first_name;
						this.doctorInfo.last_name = user.last_name;
						if (user.homonymous_id) this.doctorInfo.homonymous_id = user.homonymous_id;
					}

					this.loaded = true;
					this.$emit('loaded-pop-up');
				}
				else {
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
					this.doctorInfo.homonymous_id = name.match(re)?.[0];

					this.getProfileData();
				}
			},
			getProfileData() {
				axios.get(this.store.apiUri + 'profiles/' + this.$route.params.name)
					.then(response => {
						// console.log(response);
						this.profileData = response.data.profile;
					})
					.catch(() => {
						this.doctorNotFound = true;
					})
					.finally(() => {
						this.loaded = true;
					});
			},
			setCurrentForm(formType) {
				this.isCurrentFormShown = true;
				if (this.currentFormType !== null) this.currentFormType = '';
				if (formType === 'ReviewForm') this.formTitle = 'Lascia una recensione';
				else if (formType === 'MessageForm') this.formTitle = 'Contatta lo specialista';
				this.$nextTick(() => {
					setTimeout(() => {
						this.currentFormType = formType;
					}, 100);
				});
			},
			onResize(e) {
				this.winInnerWidth = window.innerWidth;
			}
		},
		props: {
			searchedSpecialization: {
				type: String,
				required: false
			},
			searchedDoctor: {
				type: Object,
				required: false
			},
			containerHeight: {
				type: Number,
				required: false,
			},
		},
		computed: {
			retrievedProfile() {
				return this.searchedDoctor ? this.searchedDoctor : this.profileData;
			},
			otherDoctorSpecializations() {
				if (!this.searchedSpecialization) return undefined;

				const searchedSpecialization = this.searchedSpecialization[0].toUpperCase() + this.searchedSpecialization.slice(1);
				const allDoctorSpecializations = this.searchedDoctor.user.specializations;

				return allDoctorSpecializations?.filter(({ name }) => name !== searchedSpecialization);
			},
			messageFormElements() {
				let formElements = {};
				for (const el in this.formElements) {
					if (el === 'content') {
						const elObject = { ...this.formElements[el], id: 'message', label: 'Messaggio' };
						elObject.placeholder += ' il tuo messaggio';
						formElements[el] = elObject;
					}
					else if (el !== 'vote') formElements[el] = this.formElements[el];
				}

				return formElements;
			},
			reviewFormElements() {
				let formElements = {};
				for (const el in this.formElements) {
					if (el === 'content') {
						const elObject = { ...this.formElements[el], id: 'review', label: 'Recensione' };
						elObject.placeholder += ' la tua recensione';
						formElements[el] = elObject;
					}
					else formElements[el] = this.formElements[el];
				}

				return formElements;
			},
			currentFormElements() {
				if (this.currentFormType === null) return undefined;
				if (this.currentFormType === 'MessageForm') return this.messageFormElements;
				if (this.currentFormType === 'ReviewForm') return this.reviewFormElements;
			},
			currentCreateResourceApiRoute() {
				if (this.currentFormType === 'MessageForm') return this.messageApiRoute;
				if (this.currentFormType === 'ReviewForm') return this.reviewApiRoute;
			},
			isComponentPopUp() {
				return !!this.containerHeight
			},
			areShowFormButtonsShown() {
				return this.isMessageFormButtonShown && this.isReviewFormButtonShown;
			},
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
		created() {
			this.setDoctorInfo();
			window.addEventListener('resize', this.onResize);
		},
		destroyed() {
			window.removeEventListener('resize', this.onResize);
		}
	}
</script>

<template>
	<main :class="{ 'pop-up-main': isComponentPopUp }" :style="{ 'min-height': containerHeight + 'px' }">
		<div class="d-flex justify-content-center container">
			<Loader v-if="!loaded" />
			<!-- Card for retrieved doctor -->
			<AppPopUpCard
				v-else-if="retrievedProfile && Object.keys(retrievedProfile).length && retrievedProfile.constructor === Object">
				<template #card-header>
					<div class="img-doctor">
						<img
							:src="getProfilePhotoPath(this.store.placeholderImg, retrievedProfile.photo, this.store.apiUri.slice(0, -4))"
							class="doctor-photo" alt="doctor photo">
					</div>
					<div class="card-header-title-section">
						<h1 class="card-title py-3">
							Dott. {{ retrievedProfile.user.first_name }} {{ retrievedProfile.user.last_name }}
						</h1>
						<div class="title-specializations d-flex">
							<h4 class="text-start">
								Specialista in:
							</h4>
							<ul class="specializations-list">
								<li class="specializations-list-item" v-if="retrievedProfile.specialization_name">
									{{ retrievedProfile.specialization_name }}</li>
								<template v-else-if="retrievedProfile.user.specializations.length">
									<li class="specializations-list-item" v-for="specialization in retrievedProfile.user.specializations">
										{{ specialization.name }}</li>
								</template>
								<li v-else>{{ 'Nessuna specializzazione indicata' }}</li>
							</ul>
						</div>
						<p class="address">
							<i class="fa-solid fa-location-dot"></i>{{ retrievedProfile.office_address }}
						</p>
						<button class="btn btn-close" v-if="$route.name !== 'search'" @click="$router.push({
							name: 'specializationDoctors', params: { specialization: $route.params.specialization }
						})"></button>
					</div>
				</template>

				<template #default>
					<div class="left-content col-5 py-3">
						<h5>Informazioni aggiuntive</h5>
						<ul class="d-flex flex-wrap row-gap-3 ul-child-elements py-3">
							<!-- repeated information .card-list-item -->
							<template v-for="(translation, info) in extraInfos">
								<li class="card-list-item"
									v-if="info === 'specializations' ? otherDoctorSpecializations?.length : true">
									<h3>{{ translation[0].toUpperCase() + translation.slice(1) }}</h3>
									<div class="data-element" :class="[info + '-element']">
										<template v-if="info === 'specializations'">
											<ul class="specializations-list">
												<li class="specializations-list-item" v-for="specialization in otherDoctorSpecializations">
													{{ specialization.name }}</li>
											</ul>
										</template>
										<template v-else-if="info === 'curriculum' && retrievedProfile[info]">
											<!-- Show a link depending on curriculum string value length. //Could be used in future for curriculum inserted as plain text -->
											<span v-if="retrievedProfile[info].length < 100">Visualizza il <a
													:href="getFilePath('storage/' + retrievedProfile[info], store.apiUri.slice(0, -3))"
													target="_blank">curriculum</a></span>
											<span v-else>{{ retrievedProfile[info] }}</span>
										</template>
										<template v-else>
											{{ retrievedProfile[info] }}
										</template>

									</div>
								</li>
							</template>
						</ul>
					</div>
					<div class="right-content col-5 py-3">
						<div class="buttons-wrapper mb-3">
							<Transition name="slide-up">
								<!-- Button to show message form -->
								<button class="btn btn-primary" v-if="currentFormType === 'ReviewForm' ||
									currentFormType === null" :class="{ 'pos-static': !isCurrentFormShown }"
									@click="setCurrentForm('MessageForm')">Contatta</button>
								<!-- Button to show review form -->
								<button v-else-if="currentFormType === 'MessageForm'" class="btn btn-primary"
									@click="setCurrentForm('ReviewForm')">Recensisci</button>
							</Transition>
							<button v-if="!isCurrentFormShown" class="btn btn-primary pos-static"
								:class="{ 'ms-3': winInnerWidth >= 768 }" @click="setCurrentForm('ReviewForm')">Recensisci</button>
						</div>
						<div v-show="isCurrentFormShown" class="review-form">
							<!-- Dynamic Form -->
							<h5 class="mb-3">{{ formTitle }}
							</h5>
							<Transition>
								<KeepAlive>
									<AppForm v-if="currentFormType" :key="currentFormType" class="mb-3"
										:apiRoute="currentCreateResourceApiRoute" :elements="currentFormElements" :doctorInfo />
								</KeepAlive>
							</Transition>
						</div>
					</div>
				</template>
			</AppPopUpCard>

			<!-- Card in case of no doctor retrieved -->
			<AppPopUpCard class="not-found" v-else>
				<template #card-header>
					<button class="btn btn-close" v-if="$route.name !== 'search' && isSpecializationParamValid" @click="$router.push({
						name: 'specializationDoctors', params: { specialization: $route.params.specialization }
					})"></button>
				</template>
				<template #default>
					{{
						isSpecializationParamValid ?
							"Nessuno specialista con questa specializzazione, verfica le specializzazioni del tuo medico " +
							"o che il nome inserito sia corretto." :
							!doctorNotFound ?
								"Specializzazione inserita non corretta, controlla la specializzazione inserita." :
								"Dottore cercato non trovato, controlla il nome inserito e l'id finale, se presente."
					}}
				</template>
			</AppPopUpCard>
		</div>
	</main>
</template>

<style lang="scss" scoped>
	:deep() {
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

		main.pop-up-main {
			padding: 0;
		}

		main:not(.pop-up-main) {
			height: 100%;
			padding-bottom: 60px;
			scroll-behavior: smooth;

			overflow: hidden auto
		}

		/* Card edit*/
		.card .card-header {
			button.btn-close {
				position: absolute;
				--distance: 20px;
				top: var(--distance);
				right: var(--distance);
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

		.card-header-title-section {
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


		.card-body {
			ul.ul-child-elements>* {
				flex-basis: 100%;
				min-height: 50px;
			}

			.right-content {
				h5 {
					color: var(--color-tertiary);
				}

				.buttons-wrapper {
					min-height: 50px;
					position: relative;
				}
			}
		}

		.card-list-item {
			border: 1px solid grey;
			border-radius: 10px;
			box-shadow: 0 8px 12px -3px var(--color-complementary);
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

		.btn {
			background-color: var(--color-tertiary);

			position: absolute;
			left: 50%;
			translate: -50% 0;

			&:hover {
				background-color: var(--color-primary);
			}

			span {
				margin-right: 5px;
				display: none;
			}
		}

		/* Buttons animations */
		.slide-up-enter-active,
		.slide-up-leave-active {
			transition: all 0.25s ease-out;
		}

		.slide-up-enter-from {
			opacity: 0;
			transform: translateY(30px);
		}

		.slide-up-leave-to {
			opacity: 0;
			transform: translateY(-30px);
		}

		/* Form entrance animation */
		.form-frame {
			animation: forwards move-up;
		}

		.v-enter-active {
			animation: 1.2s ease-in move-up;
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


		/* Responsive */
		@media (max-width: 576px) {
			.container {
				padding: 0 15px;
				/* Adjust the container padding */
			}

			.card.pop-up-card {
				.card-header {
					flex-direction: column;
					/* Stack the content vertically */
					flex-wrap: nowrap;
					align-items: center;
					/* Center align elements */

					.img-doctor {
						padding: 0;
					}
				}

				.card-header-title-section {
					text-align: center;
					/* Center the title and text */
				}

				.img-doctor img {
					width: 100%;
					min-width: 250px;
				}

				.card-body {
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
		}

		@media (min-width: 768px) and (max-width: 991.98px) {
			.container {
				padding: 0 30px;
			}

			.card-header {
				flex-direction: row;
			}

			.card-body {
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

			.card-body {
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

			.card-body {
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
	}
</style>