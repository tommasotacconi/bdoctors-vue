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
	import FormField from '../../../js/utils/FormField.js';

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
					firstName: new FormField('first-name', 'text', 'Nome', { p: 'Inserisci il tuo nome' }),
					lastName: new FormField('last-name', 'text', 'Cognome', { p: 'Inserisci il tuo cognome' }),
					email: new FormField('email', 'email', 'Email', { p: 'Inserisci il tuo indirizzo email' }),
					content: new FormField(undefined, 'textarea', undefined, { p: 'Scrivi qui' }),
					vote: new FormField('vote', 'radio', 'Voto')
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
					const homId = name.match(re)?.[0];
					if (homId) this.doctorInfo.homonymous_id = homId;

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
			currentNameArtConc() {
				if (this.currentFormType === 'MessageForm') return ['messaggio', 'il', 'o']
				else if (this.currentFormType === 'ReviewForm') return ['recensione', 'la', 'a'];
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
					<div class="photo-wrapper">
						<img
							:src="getProfilePhotoPath(this.store.placeholderImg(retrievedProfile.user.first_name, retrievedProfile.user.last_name), retrievedProfile.photo, this.store.apiUri.slice(0, -4))"
							class="doctor-photo" alt="doctor photo">
					</div>
					<div class="card-header-title-section">
						<h1 class="card-title py-3 align-self-center">
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
					</div>
					<button class="btn btn-close" v-if="$route.name !== 'search'" @click="$router.push({
						name: 'specializationDoctors', params: { specialization: $route.params.specialization }
					})"></button>
				</template>

				<template #default>
					<div class="left-content col-md-5 col-xl-4 py-3">
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
					<div class="right-content col-md-6 col-xl-6 mx-auto py-3">
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
									<AppForm v-if="currentFormType" :key="currentFormType" class="mb-3" :doctorInfo
										:apiRouteAndMethod="{ route: currentCreateResourceApiRoute, method: 'post' }"
										:elements="currentFormElements" :nameArtConc="currentNameArtConc" />
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
	@use '../../styles/forms';

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

	ul {
		text-align: start;
		padding-left: 0;
		list-style-type: none;

		margin: {
			top: 0;
			bottom: 0
		}
	}

	// Utilities
	main.pop-up-main {
		padding: 0;
	}

	main:not(.pop-up-main) {
		height: 100%;
		padding-bottom: 60px;
		scroll-behavior: smooth;

		overflow: hidden auto
	}

	.pop-up-card .card-header {
		.photo-wrapper {
			--img-size: 150px;
			max-width: var(--img-size);
			flex-basis: var(--img-size);
			display: flex;
			align-items: center;
			justify-content: center;

			img.doctor-photo {
				max-width: 100%;
				margin: 15px;
				border-radius: 50%;
				aspect-ratio: 1;
				object-fit: cover;
				object-position: center;
			}
		}

		.title-specializations ul {
			text-align: start;
			padding-left: 0;
			list-style-type: none;
			padding: 0 20px;
			color: var(--color-primary);
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
				margin-bottom: 15px;
				font-size: 1.3rem;
				color: var(--color-primary);
			}

			& .specializations-list-item {
				margin-bottom: 5px;
				border: 4px solid #fff;
				border-radius: 10px;
				border-top-width: 1px;
				padding: 10px 6px;
			}
		}
	}


	.pop-up-card .card-body {
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

		.card-list-item {
			border: 1px solid grey;
			border-radius: 10px;
			box-shadow: 0 8px 12px -3px var(--color-complementary);
			padding: 10px;
		}

		.card-list-item h3 {
			color: var(--color-primary);
		}
	}

	.btn {
		background-color: var(--color-tertiary);

		position: absolute;
		translate: -50% 0;

		&.btn-close {
			// 2.7px is approximately the computed card-br-width that needs to be subtracted since it's from its inner side that is displaced hte button external border 
			$btn-dist-from-corner: vars.$card-br-radius - vars.$btn-close-br-radius - 2.7px;
			translate: 0;
			right: $btn-dist-from-corner;
			top: $btn-dist-from-corner;
		}

		&:hover {
			background-color: var(--color-primary);
		}

		span {
			margin-right: 5px;
			display: none;
		}
	}

	:deep() {
		.btn.btn-submit {
			width: 100%;
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

	/* Responsive */
	:deep() {
		@media (min-width: 576px) {
			.container:not(.form-frame) {
				padding: 0 15px;
				/* Adjust the container padding */
			}

			.card.pop-up-card {
				.photo-wrapper img {
					width: 100%;
					// min-width: 250px;
				}

				.form-frame {
					padding: 10px;
				}

				.specializations-list {
					display: block;
				}
			}
		}

		@media (min-width: 768px) {
			.card-header {
				.photo-wrapper {
					--img-size: 175px;
				}
			}

			.card-body {
				.vote {
					@include forms.vote-label-dimension(2.2rem, 1.1rem);
				}
			}
		}

		/* Desktop */
		@media (min-width: 992px) {
			.container:not(.form-frame) {
				padding: 0 50px;
			}

			.card-header {
				.photo-wrapper {
					--img-size: 250px;
				}
			}

			.card-body {
				.vote {
					@include forms.vote-label-dimension;
				}
			}
		}

		/* Large Desktop */
		@media (min-width: 1200px) {
			.container:not(.form-frame) {
				padding: 0 100px;
			}

			.votes input {
				margin-right: 10px;
			}
		}
	}
</style>