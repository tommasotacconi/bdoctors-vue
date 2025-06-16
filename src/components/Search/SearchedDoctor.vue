<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import DoctorShow from './DoctorShow.vue';
	import { RouterLink } from 'vue-router';
	import { finiteOrDefault } from 'chart.js/helpers';

	export default {
		data() {
			return {
				store,
				searchedDoctor: [],
				doctors: [],
				rating: null,
				inputReviews: null,
				loaded: false,
				showDoctor: false,
				filteredDoctorsProfiles: [],
				placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
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
					name: 'search.show', params: { searchId: this.$route.params.specialization, nameId: completeName }
				})
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
			getProfilePhotoPath(doctor) {
				// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo profiles table
				const photoPath = doctor.photo;
				return photoPath?.includes('photos') ? this.getFilePath(`storage/${photoPath}`) : photoPath ?? new URL(this.store.placeholderImg).href;
			},
			getFilePath: function (filePath) {
				return new URL(filePath, this.store.apiUri.slice(-3)).href;
			},
			resetInputs() {
				this.rating = null;
				this.inputReviews = null;
				this.getFilteredReviews();
			},
		},
		computed: {
			orderedDoctors() {
				return this.orderBySponsorship(this.doctors);
			},
			specializationName() {
				return this.$route.params.specialization.replace(/-/g, ' ').replace(/_/g, '-');
			},
		},
		watch: {
			'$route.params.specialization': {
				handler(newValue) {
					this.getFilteredReviewsData();
				},
				immediate: true
			}
		},
	}
</script>

<template>
	<main class="bg">
		<div class="container">
			<!-- Loader -->
			<div class="loader" v-if="!loaded"></div>

			<!-- Components -->
			<div v-if="loaded">
				<div>
					<div class="title">
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
									<form method="get" class="form-control rating" @submit.prevent="getFilteredReviews">
										<button type="submit" class="btn btn-sm btn-secondary ms-2"
											:class="{ 'disabled': rating === null }">Filtra</button>
										<input type="radio" id="vote5" name="rating" value="5" v-model="rating">
										<label for="vote5"><i class="fa-solid fa-stethoscope"></i>
										</label>
										<input type="radio" id="vote4" name="rating" value="4" v-model="rating">
										<label for="vote4"><i class="fa-solid fa-stethoscope"></i>
										</label>
										<input type="radio" id="vote3" name="rating" value="3" v-model="rating">
										<label for="vote3"><i class="fa-solid fa-stethoscope"></i>
										</label>
										<input type="radio" id="vote2" name="rating" value="2" v-model="rating">
										<label for="vote2"><i class="fa-solid fa-stethoscope"></i>
										</label>
										<input type="radio" id="vote1" name="rating" value="1" v-model="rating">
										<label for="vote1"><i class="fa-solid fa-stethoscope"></i>
										</label>
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

					<div class="doctors-list" v-if="filteredDoctorsProfiles.length">
						<div class="doctor-card" v-for="(doctorProfile, index) in filteredDoctorsProfiles"
							@click="goToShowPage(doctorProfile, index)" :key="index">
							<img class="doctor-photo" :src="getProfilePhotoPath(doctorProfile)" alt="doctor photo">
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

				</div>
			</div>
			<div v-else-if="filteredDoctorsProfiles.length"></div>
		</div>
	</main>
</template>

<style scoped>
	.bg {
		background-image: url(../../public/tile_background.png);
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

		& label:hover,
		& label:hover~label {
			color: var(--color-complementary)
		}

		& input:checked~label {
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
		display: flex;
		gap: 50px 110px;
		justify-content: start;
		flex-wrap: wrap;
		align-content: stretch;
		margin-top: 30px;

	}

	.doctor-photo {
		height: 200px;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center;
	}

	.doctors-list> :hover {
		scale: 1.1;
		cursor: pointer;
		transition: 0.8s;
	}


	.total-specialization-doctor {
		font-style: oblique;
		font-weight: normal;
		font-size: 1.2rem;
	}

	.doctor-card {
		background-color: #D8F9FF;
		padding: 25px 30px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		justify-content: center;
		align-items: center;
		width: calc((100% / 3) - 80px);
		border-radius: 30px;

		/* height: 400px; */
	}

	img {
		border-radius: 50%;
		border: 3px solid #65B0FF;
		height: 200px;

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


	/* Loader progressive */
	.loader {
		--r1: 154%;
		--r2: 68.5%;
		width: 60px;
		aspect-ratio: 1;
		border-radius: 50%;
		background:
			radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
			radial-gradient(var(--r1) var(--r2) at bottom, var(--color-secondary) 79.5%, #0000 80%),
			radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
			#ccc;
		background-size: 50.5% 220%;
		background-position: -100% 0%, 0% 0%, 100% 0%;
		background-repeat: no-repeat;
		animation: l9 2s infinite linear;
		position: absolute;
		top: 50%;
		left: 50%;
	}

	@keyframes l9 {
		33% {
			background-position: 0% 33%, 100% 33%, 200% 33%
		}

		66% {
			background-position: -100% 66%, 0% 66%, 100% 66%
		}

		100% {
			background-position: 0% 100%, 100% 100%, 200% 100%
		}
	}



	/* Media Queries */

	/* Mobile */
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
			gap: 20px;
			justify-content: center;
		}

		.doctor-card {
			width: calc(100% - 40px);
			margin: 5px;
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

	/* Large Mobile Screens */

	@media (max-width: 480px) {
		.doctors-list {
			gap: 15px;
		}

		.doctor-card {
			width: calc(100% - 20px);
			/* Ensure 1 card per row on very small screens */
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

	/* Desktop (above 1024px) */
	@media (min-width: 1024px) {
		.doctors-list {
			gap: 50px 110px;
		}

		.doctor-card {
			width: calc((100% / 3) - 80px);
			/* 3 cards per row */
		}
	}
</style>