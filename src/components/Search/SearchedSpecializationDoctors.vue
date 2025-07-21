<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import DoctorShow from './DoctorShow.vue';
	import { finiteOrDefault } from 'chart.js/helpers';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';
	import { nextTick } from 'vue';

	export default {
		data() {
			return {
				placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',
				store,
				searchedDoctor: [],
				filteredDoctorsProfiles: [],
				doctors: [],
				rating: null,
				inputReviews: null,
				loaded: false,
				loadingPopUp: !!this.$route.params.name,
				showDoctor: false,
				containerHeight: 0,
			}
		},
		components: {
			DoctorShow,
		},
		methods: {
			goToShowPage(doctorProfile, index) {
				let completeName = doctorProfile.user.first_name + '-' + doctorProfile.user.last_name;
				if (doctorProfile.user.homonymous_id !== null) completeName += '-' + doctorProfile.user.homonymous_id;
				store.doctorProfile = doctorProfile;
				this.$router.push({
					name: 'specializationDoctors.show', params: { name: completeName }
				});

				this.$refs.main.scrollTop = 0;
			},
			getFilteredReviewsData() {
				axios.get(this.store.apiUri + `reviews/filter/${this.$route.params.specialization}/${this.rating}/${this.inputReviews}`)
					.then(response => {
						// handle success
						this.filteredDoctorsProfiles = response.data;
						console.log('filtered doctors:', this.filteredDoctorsProfiles);
						this.loaded = true;
					})
					.catch(function (error) {
						// handle error
						console.log(error)
					});

				this.loaded = false
			},
			// getProfilePhotoPath(doctor) {
			// 	// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo profiles table
			// 	const photoPath = doctor.photo;
			// 	return photoPath?.includes('photos') ? this.getFilePath(`storage/${photoPath}`) : photoPath ?? new URL(this.store.placeholderImg).href;
			// },
			// getFilePath: function (filePath) {
			// 	return new URL(filePath, this.store.apiUri.slice(-3)).href;
			// },
			resetInputs() {
				this.rating = null;
				this.inputReviews = null;
				this.getFilteredReviews();
			},
			saveContainerHeight() {
				const height = this.$refs.container.getBoundingClientRect().height;
				// Compute margin using if present inside first and last child's margin due to margin collapse
				// and having container no margin
				const firstChild = this.$refs.titleDiv;
				const marginTopStringProperty = getComputedStyle(firstChild)['margin-top'];
				const marginTop = Number(marginTopStringProperty.slice(0, -2));
				console.log(height, marginTop)
				this.containerHeight = height + marginTop;
			}
		},
		computed: {
			orderedDoctors() {
				return this.orderBySponsorship(this.doctors);
			},
			specializationName() {
				return this.$route.params.specialization.replace(/-/g, ' ').replace(/_/g, '-');
			},
			voteLabels() {
				// Construct an objects array to bring label name and input value
				const labels = [];
				for (let i = 5; i >= 1; i--) {
					const name = 'filter-vote' + i;
					const inputValue = i;
					const label = { name, inputValue }
					labels.push(label);
				}

				return labels;
			},
		},
		watch: {
			'$route.params.specialization': {
				handler(newValue) {
					this.getFilteredReviewsData();
				},
				immediate: true
			},
			'filteredDoctorsProfiles': {
				handler(newValue) {
					const urlName = this.$route.params.name;
					if (urlName) {
						const doctorProfile = this.filteredDoctorsProfiles.find(({ user }) => {
							let result = false;
							// Compare user complete name, homonymous_id included, with in URL name
							const homonymousIdPart = user.homonymous_id ? `-${user.homonymous_id}` : null;
							const fullNamePart = `${user.first_name}-${user.last_name}`;
							let completeName = '';
							completeName = homonymousIdPart ? fullNamePart + homonymousIdPart : fullNamePart;
							result = completeName === urlName;

							return result;
						})

						this.store.doctorProfile = doctorProfile;
					}
				}
			},
			'loaded': {
				handler() {
					this.$nextTick(this.saveContainerHeight);
				}
			}
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
	}
</script>

<template>
	<!-- Loader -->
	<Loader v-if="!loaded" />

	<main ref="main" v-if="loaded" :style="{ overflow: loadingPopUp ? 'hidden' : 'hidden auto' }">
		<div ref="container" class="container">
			<div ref="titleDiv" class="title">
				<h2>Risultati per <span class="specialization-title">{{ specializationName }} </span><span
						v-if="!filteredDoctorsProfiles.length" class="total-specialization-doctor"> (Totale esperti:
						{{
							doctors.length
						}})</span>
					<span v-else class="total-specialization-doctor"> (Totale esperti: {{
						filteredDoctorsProfiles.length }})</span>
				</h2>
			</div>

			<div class="advanced-filter">
				<!-- Average Votes Filter Input -->
				<div class="average-votes">
					<div class="votes d-flex align-items-center">
						<p class="me-2">Filtra per media voti: </p>
						<div class="rating">
							<form id="filter-votes-form" class="form-control rating" @submit.prevent="getFilteredReviews">
								<button type="submit" class="btn btn-sm btn-secondary ms-2"
									:class="{ 'disabled': rating === null }">Filtra</button>
								<div class="input-group" v-for="label in voteLabels">
									<input type="radio" :id="label.name" name="rating" :value="label.inputValue" v-model="rating">
									<label :for="label.name"><i class="fa-solid fa-stethoscope"></i></label>
								</div>
							</form>
						</div>
					</div>
				</div>
				<!-- Reviews Number Filter Input-->
				<div class="reviews-number">
					<p>Filtra per numero di recensioni:</p>
					<form method="GET" class="form-control d-flex" @submit.prevent="getFilteredReviews">
						<input type="number" class="form-control" id="reviews" name="reviews" min="0" v-model="inputReviews">
						<button type="submit" :class="{ 'disabled': inputReviews === null }"
							class="btn btn-sm btn-secondary ms-2">Filtra</button>
					</form>
				</div>
				<!-- Reset Input Fields Button -->
				<button type="reset" class="btn btn-sm btn-primary"
					:class="{ 'disabled': rating === null && inputReviews === null }" @click="resetInputs">Cancella
					Filtri</button>
			</div>

			<!-- Doctors in selected specialization and eventually filtered -->
			<div class="doctors-list" v-if="filteredDoctorsProfiles.length">
				<div class="doctor-card" v-for="(doctorProfile, index) in filteredDoctorsProfiles"
					@click="goToShowPage(doctorProfile, index)" :key="index">
					<img class="doctor-photo" :src="getProfilePhotoPath(this.store.placeholderImg, doctorProfile.photo)"
						alt="doctor photo">
					<section class="doctor-information">
						<h5 class="doctor-name">
							{{ doctorProfile.user.first_name }} {{ doctorProfile.user.last_name }}
						</h5>
						<div class="doctor-address">
							<strong>Ufficio:</strong> {{ doctorProfile.office_address }}
						</div>
						<div class="doctor-average">
							<strong>Media voti:</strong> {{ doctorProfile.media_voti ? doctorProfile.media_voti : "-" }}
						</div>
						<div class="doctor-reviews">
							<strong>Recensioni ricevute:</strong> {{ doctorProfile.totalReviews ? doctorProfile.totalReviews :
								"-"
							}}
						</div>
					</section>
				</div>
			</div>
			<div v-else>
				<p>Nessun risultato trovato</p>
			</div>

			<div v-if="$route.params.name" class="pop-up doctor-show" :class="{ 'loading-pop-up': loadingPopUp }">
				<!-- DoctorShow.vue component passed with router -->
				<RouterView @loaded-pop-up="loadingPopUp = false" :searchedSpecialization="specializationName"
					:containerHeight />
			</div>
		</div>
	</main>
</template>

<style scoped>
	main {
		height: 100%;
		padding-bottom: 60px;

		overflow: hidden auto;
		scroll-behavior: smooth;
		position: relative;
	}

	.container {
		background-color: white;
	}

	h5 {
		margin-bottom: 15px;
		text-align: center;
	}

	.title {
		text-align: center;
		margin: 30px 0 20px 0;

		h2 {
			font-weight: 300;
		}
	}

	.specialization-title {
		text-transform: lowercase;
		font-weight: 500;
	}

	.advanced-filter {
		border: #65B0FF 2px solid;
		border-radius: 20px;
		margin: 20px 0;
		padding: 10px;
		display: flex;
		align-items: center;
		gap: 20px;
	}

	/*Rating */
	.rating {
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-end;

		& input {
			display: none;
		}

		& label {
			font-size: 24px;
			cursor: pointer;
		}

		label:hover,
		.input-group:has(label:hover)~.input-group label {
			color: var(--color-complementary)
		}

		input:checked+label,
		.input-group:has(input:checked+label)~.input-group label {
			color: var(--color-complementary)
		}
	}

	.reviews-number {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	/* Doctor list */
	.doctors-list {
		--col-gap: 50px;
	}

	.doctors-list {
		display: flex;
		gap: 50px var(--col-gap);
		flex-wrap: wrap;
		margin-top: 30px;
	}

	.doctor-photo {
		width: 100%;
		max-width: 230px;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center;
	}

	.doctors-list> :hover {
		scale: 1.2;
		cursor: pointer;
		outline: thin solid var(--color-complementary);
		outline-offset: 5px;
	}


	.total-specialization-doctor {
		font-style: oblique;
		font-weight: normal;
		font-size: 1.2rem;
	}

	.doctor-card {
		min-height: 450px;
		flex: 0 calc(100% / 3 - 2 / 3 * var(--col-gap));
		background-color: #D8F9FF;
		padding: 25px 30px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		align-items: center;
		border-radius: 30px;

		transition: scale 0.2s;
	}

	img {
		border-radius: 50%;
		border: 3px solid #65B0FF;
		/* height: 200px; */

	}

	.button-profile-show {
		background-color: var(--color-secondary);
		border-radius: 20px;
		padding: 8px 15px;
		text-decoration: none;
		color: var(--color-primary);
		font-weight: bold;
		border: 1px solid var(--color-primary);
	}

	/* Sponsored doctors */
	.sponsored-card-container {
		display: flex;
		gap: 30px;
		justify-content: center;
		flex-wrap: wrap;

	}

	.card-sponsored {
		background-color: #D8F9FF;
		border-radius: 40px;
		flex-direction: column;
		align-items: center;
		border: 0;
		text-align: center;
		border: 2px solid #FFCC00;
		transition: 0.8s;
	}

	/* Pop-up */
	.pop-up.doctor-show {
		padding-top: 30px;
		padding-bottom: 60px;
		backdrop-filter: blur(5px);

		position: absolute;
		top: 0;
		right: 0;
		left: 0;
	}

	.pop-up.loading-pop-up {
		bottom: 0;
	}

	/* Media Queries */
	/* Desktop (under 1024px) */
	@media (max-width: 1024px) {
		.doctors-list {
			--col-gap: 30px;
		}
	}

	/* Mobile */
	/* Large mobile */
	@media (max-width: 768px) {
		.advanced-filter {
			flex-direction: column;
			align-items: flex-start;
		}

		.average-votes,
		.reviews-number {
			width: 100%;
			margin-bottom: 15px;
		}

		.advanced-filter button {
			width: 100%;
			margin-top: 15px;
		}

		.doctors-list {
			--col-gap: 20px;
			justify-content: center;
		}

		.doctor-card {
			flex: 0 calc(100% / 2 - 1 / 2 * var(--col-gap));
		}

		.title h2 {
			font-size: 1.4rem;
		}

		.doctor-card img {
			height: 150px;
			width: 150px;
		}

		.doctor-name h5 {
			font-size: 1rem;
		}

		.doctor-information {
			text-align: start;
		}

		.average-votes {
			width: 100%;
		}
	}

	/* Small Mobile Screens */
	@media (max-width: 480px) {
		.doctors-list {
			--col-gap: 15px;

			&> :hover {
				scale: none;
			}
		}

		.doctor-card {
			/* Ensure 1 card per row on very small screens */
			flex: auto;
			min-height: 300px;
		}

		.doctor-name {
			font-size: 0.9rem;
		}

		.doctor-address,
		.doctor-average,
		.doctor-reviews {
			font-size: 0.8rem;
		}

		.rating {
			font-size: 20px;
			flex-grow: 1;
			align-items: center;
			flex-wrap: no-wrap;
			gap: 5px;
		}

		.votes {
			flex-wrap: wrap;
		}

		.average-votes,
		.reviews-number {
			flex-direction: column;
			align-items: flex-start;
		}

		button {
			width: 100%;
		}

		.title h2 {
			font-size: 1.2rem;
		}

		.doctor-card img {
			height: 120px;
			width: 120px;
		}
	}
</style>