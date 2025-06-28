<script>
	import axios from 'axios';
	import { store } from '../../../../js/store.js';
	import { dashboardStore } from '../../../../js/dashboardStore.js';

	export default {
		data() {
			return {
				loaded: false,
				placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',
				store,
				dashboardStore
			}
		},
		methods: {
			getProfileData() {
				axios.get(this.store.apiUri + 'profiles/show', {
					withCredentials: true,
				})
					.then(({ data: { data: profile } }) => {
						console.log('Profile: ', profile);
						this.loaded = true;
						this.store.isAuthenticated = true;

						// Data to share inside other components
						this.dashboardStore.profileDataGeneral = profile;
						// localStorage.setItem('user_id', response.data.data.doctor.id)
						// localStorage.setItem('profile_id', response.data.data.id)
					})
					.catch(err => {
						console.log('ERROR IN GET /api/profiles: ' + err.response.data.message);
						this.loaded = true;
					});
			},
			getFilePath: function (filePath) {
				return new URL(filePath, 'http://localhost:8000/').href;
			},
		},
		computed: {
			/* showLoader() {
				setTimeout(() => {
					this.loaded = true
				}, 2000)
			}, */
			profilePhotoPath() {
				// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo profiles table
				const photoPath = this.dashboardStore.profileDataGeneral.photo;
				return photoPath.includes('photos') ? this.getFilePath(`storage/${this.dashboardStore.profileDataGeneral.photo}`) : photoPath ?? new URL(this.placeholderImg).href;
			},
			curriculumFileName() {
				// Truncate curriculum lenght to 30 string characters
				// 1. Retrieve data to be computed
				const curriculumFilePath = this.dashboardStore.profileDataGeneral.curriculum;
				// 2. If it is too long, truncate it
				if (curriculumFilePath.length >= 30) curriculumFilePath.slice(0, 30);
				// 3. If is included the parent directories 'curricula/', remove it
				if (curriculumFilePath.includes('curricula/')) return curriculumFilePath.slice(10);

			}
		},
		created: function () {
			this.getProfileData();
		},
		mounted() {
			// this.showLoader
		}
	}
</script>

<template>
	<main class="container d-flex justify-content-center">
		<div class="general-main">
			<h2>Profilo</h2>

			<!-- Loader -->
			<Loader v-if="!loaded" />

			<!-- Section with doctor info -->
			<section class="card-general">
				<!-- <section class="card-general" v-if="loaded && store.isAuthenticated"> -->
				<!-- Card with info -->
				<div class="card mb-3" v-if="Object.keys(dashboardStore.profileDataGeneral).length">
					<div class="card-flex">
						<div class="img-doctor">
							<img :src="profilePhotoPath" alt="doctor photo">
						</div>
						<div class="card-body-general">
							<div class="card-body">
								<div class="card-title-section">
									<h4 class="card-title">{{ dashboardStore.profileDataGeneral.doctor.first_name }} {{
										dashboardStore.profileDataGeneral.doctor.last_name }}
									</h4>
									<div class="main-information-section">
										<section class="email-section d-flex gap-1 align-items-center">
											<h5>Email:</h5>
											<p>{{ dashboardStore.profileDataGeneral.doctor.email }}</p>
										</section>
										<section class="password-section d-flex gap-1 align-items-center">
											<h5>Password:</h5>
											<p>*********</p>
										</section>
									</div>
								</div>
								<div class="card-text">
									<ul>
										<li>
											<strong>Curriculum: </strong>
											<a :href="getFilePath(`storage/${dashboardStore.profileDataGeneral.curriculum}`)"
												target="_blank">{{
													curriculumFileName
												}}</a>
										</li>
										<li>
											<strong>Specializzazione:</strong> {{
												dashboardStore.profileDataGeneral.doctor.specializations[0].name }}
										</li>
										<li>
											<strong>Indirizzo:</strong> {{ dashboardStore.profileDataGeneral.office_address }}
										</li>
										<li>
											<strong>Telefono:</strong> {{ dashboardStore.profileDataGeneral.phone }}
										</li>
										<li>
											<strong>Prestazioni:</strong> {{ dashboardStore.profileDataGeneral.services }}
										</li>
									</ul>
								</div>
								<button href="#" class="edit-profile"
									@click="dashboardStore.currentProfileSectionComponentIndex = 2">Modifica il tuo profilo</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Placeholder card when a profile needs to be created -->
				<div class="card mb-3">
					<!-- <div class="card mb-3" v-else> -->
					<div class="card-create">
						<button class="plus" @click="dashboardStore.currentProfileSectionComponentIndex = 1">
							<div><i class="fa-solid fa-plus"></i></div>
						</button>
						<div class="create-profile-text">
							Il tuo profilo sembra essere un po' vuoto... che ne dici di aggiungerci qualcosa?
						</div>
					</div>
				</div>
			</section>

			<!-- Section unauthorized content -->
			<section class="card-general" v-if="loaded && !store.isAuthenticated">
				<div class="card mb-3">
					<div class="card-body">
						Contenuto non autorizzato
					</div>
				</div>

			</section>
		</div>
	</main>
</template>

<style scoped>
	h2 {
		margin-bottom: 40px;
		text-align: center;
	}

	h4 {
		margin: 0;
	}

	h5 {
		margin: 0;
	}

	p {
		margin: 0;
	}

	/* Card edit*/

	.card-general {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.card {
		border-radius: 40px;
		background-color: #D8F9FF;
		border: 0;
		text-align: center;
		width: 80%;
	}

	.card-flex {
		display: flex;
	}

	.img-doctor {
		flex-basis: 40%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-body-general {
		flex-basis: 60%;
	}

	.card img {
		width: 90%;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 3px solid #65B0FF;
		margin: 15px;
		object-fit: cover;
	}

	.card-body {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.card-text {
		border-top: 2px solid var(--color-complementary);
		padding-top: 16px;
	}

	.main-information-section {
		padding: 15px 0;
	}

	.email-section,
	.password-section {
		padding: 5px 0;
	}

	ul {
		text-align: start;
	}

	.edit-profile {
		background-color: var(--color-secondary);
		border-radius: 20px;
		padding: 8px 15px;
		text-decoration: none;
		color: var(--color-primary);
		font-weight: bold;
		border: 1px solid var(--color-primary);
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

	/* Old loader, classic */
	/* Loader */
	/* .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid;
    border-color: #000 #0000;
    animation: l1 1s infinite;
    position: absolute;
    top: 50%;
    left: 59%;
	}

	@keyframes l1 {
    to {
        transform: rotate(.5turn)
    }
	}
*/

	/* Responsive */
	@media only screen and (max-width: 1300px) {
		.card-flex {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.img-doctor {
			width: 70%;
		}
	}
</style>