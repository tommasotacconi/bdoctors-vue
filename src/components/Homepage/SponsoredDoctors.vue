<script>
	import axios from 'axios';
	import { RouterLink } from 'vue-router';
	import { store } from '../../../js/store.js';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';


	export default {
		data() {
			return {
				store,
				sponsoredProfiles: [],
				requestedPage: 1,
				elementsPerPage: 20,
				totalSponsoredProfiles: null,
				// profilesId: [],
				// filteredProfile: [],
			}
		},
		methods: {
			getSponsoredProfiles(perPage = this.elementsPerPage, page = this.requestedPage) {
				axios.get(this.store.apiUri + 'sponsorships/sponsored', {
					params: {
						page,
						per_page: perPage
					}
				})
					.then(response => {
						const sponsored = response.data.paginated_profiles.data;
						this.sponsoredProfiles.push(...sponsored);
						this.totalSponsoredProfiles = response.data.paginated_profiles.total;

						this.$emit('loadedSponsoredProfiles');
					})
					.catch(function (err) {
						// console.log('error GET /api/sponsorships/sponsored: ', err);
					})

				// Update next requested page
				this.requestedPage += 1;
			},
			goToShowPage(doctorProfile, index) {
				store.doctorProfile = doctorProfile;
				let completeName = doctorProfile.user.first_name + '-' + doctorProfile.user.last_name;
				if (doctorProfile.user.homonymous_id !== null) completeName += '-' + doctorProfile.user.homonymous_id;
				this.$router.push({ name: 'search', params: { name: completeName } })
				// console.log('doctor position inside homepage ', index);
				// console.log(store.searchedSpecialization)
			},
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath };
		},
		mounted() {
			this.getSponsoredProfiles();
		},
		computed: {
		},
	}
</script>

<template>
	<div class="container component-container">
		<h3>Dottori in evidenza</h3>
		<div class="sponsored-card-container">
			<div class="card card-sponsored d-flex" style="width: 18rem;" v-for="(sponsored, index) in sponsoredProfiles"
				@click="goToShowPage(sponsored, index)">
				<img :src="getProfilePhotoPath(this.store.placeholderImg, sponsored.photo, this.store.apiUri.slice(0, -4))"
					:alt="'foto profilo di' + sponsored.user.first_name + sponsored.user.last_name">
				<div class="card-body">
					<h5 class="card-title">{{ sponsored.user.first_name }} {{ sponsored.user.last_name }}</h5>
					<div class="card-text">
						<h6>Specializzazioni:</h6>
						<ul class="list-unstyled">
							<li v-for="doctorSpecialization in sponsored.user.specializations">
								{{ doctorSpecialization.name }}
							</li>
						</ul>
					</div>
				</div>
			</div>
			<p class="info-box">
				Visualizzati {{ sponsoredProfiles.length }} profili di {{ totalSponsoredProfiles }}
			</p>
		</div>
		<div class="buttons-wrapper mx-auto">
			<button v-if="!(sponsoredProfiles.length === totalSponsoredProfiles)" class="btn mt-4 mb-2"
				@click="requestedPage === 2 ? getSponsoredProfiles(elementsPerPage = 5, requestedPage = 5) : getSponsoredProfiles()"><i
					class="fa-regular fa-circle-down fa-2xl"></i></button>
		</div>
	</div>
</template>

<style scoped>
	h3 {
		text-align: center;
		margin-bottom: 20px;

	}

	ul {
		text-align: start;
		padding-left: 0;
	}

	li {
		border: 2px solid white;
		margin-bottom: 5px;
		padding: 10px;
		border-radius: 20px
	}

	main {
		background-image: url(../../public/tile_background.png);
	}

	/* Sponsored Doctor */
	.component-container h2 {
		text-align: center;
		margin-bottom: 20px;
	}

	.component-container {
		/* background-color: var(--color-complementary); */
		border-radius: 25px;
		padding: 20px;
		margin-bottom: 50px;
	}

	.sponsored-card-container {
		padding: 10px 5px;
		background-color: white;
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
		flex-basis: 230px;
		border: 2px solid #FFCC00;
		transition: 0.8s;
	}

	.card-sponsored:hover {
		scale: 1.1;
		cursor: pointer;
		/* border: 4px solid #FFCC00; */
		background-color: #FFCC00;
		color: #0033FF;
	}

	.card-sponsored:hover img {
		border: 2px solid #0033FF;
	}

	.card img {
		border-radius: 50%;
		width: 70%;
		border: 2px solid var(--color-primary);
		margin-top: 10px;
	}

	.card-text {
		text-align: start;
	}

	p.info-box {
		padding: 15px 25px;
		flex: 1 0 100%;
		text-align: right;
	}

	.buttons-wrapper {
		width: fit-content;

		.fa-circle-down {
			color: var(--color-secondary);

			transition: color 0.6s ease-out;
			;

			&:hover {
				color: var(--color-primary);
			}
		}
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
		left: 48%;
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
</style>