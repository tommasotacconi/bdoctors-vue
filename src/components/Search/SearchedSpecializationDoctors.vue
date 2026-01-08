<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import DoctorShow from './DoctorShow.vue';
	import { finiteOrDefault } from 'chart.js/helpers';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';
	import { nextTick } from 'vue';
	import AppPopUpCard from '../Generics/AppPopUpCard.vue';
	import AppForm from '../Generics/AppForm.vue';
	import FormField from '../../../js/utils/FormField.js';

	export default {
		data() {
			return {
				placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',
				store,
				searchedDoctor: null,
				filteredDoctors: [],
				doctors: [],
				isFiltering: false,
				loaded: false,
				loadingPopUp: !!this.$route.params.name,
				containerHeight: 0,
				specializationNotFound: false,
				formElements: {
					vote: new FormField('vote', 'radio', 'Voto'),
					revsNum: new FormField('revsNum', 'number', 'Numero recensioni'),
				},

			}
		},
		components: {
			DoctorShow,
			AppPopUpCard,
			AppForm
		},
		methods: {
			goToShowPage(doctor, fName, lName, homId) {
				let completeName = fName + '-' + lName;
				if (homId !== null) completeName += '-' + homId;
				this.searchedDoctor = doctor;
				this.$router.push({
					name: 'specializationDoctors.show', params: { name: completeName }
				});

				this.$refs.main.scrollTop = 0;
			},
			getFilteredReviewsData() {
				axios.get(this.store.apiUri + `reviews/filter/${this.$route.params.specialization}/${this.rating}/${this.reviewsNumber}`)
					.then(response => {
						// handle success
						this.doctors = response.data;
					})
					.catch(error => {
						this.specializationNotFound = true;
					})
					.finally(() => {
						this.loaded = true;
					})

				this.loaded = false
			},
			filterDoctors(filterInputs) {
				const { vote, revsNum } = filterInputs 
				if (vote || revsNum) this.isFiltering = true;
				else return;
				
				this.filteredDoctors.length = 0;

				if (vote) {
					const param = 'avg_vote';
					this.filteredDoctors = this.filterFunction(param, vote, this.doctors);
				}
				if (revsNum) {
					const param = 'total_reviews';
					const target = this.filteredDoctors.length ? this.filteredDoctors : this.doctors;
					this.filteredDoctors = this.filterFunction(param, revsNum, target);
				}
			},
			filterFunction(filteringParam, comparisonValue, target) {
				// Filter out doctors with a filter value not valid, i.e. equal to null for avg_vote or 0 for reviews
				console.log(target);
				const result = target.filter(({ [filteringParam]: param }) => {
					if (!param) return true;
					return param >= comparisonValue
				});

				return result;
			},
			stopFiltering() {
				this.isFiltering = false;
				this.filteredDoctors.length = 0;
			},
			saveContainerHeight() {
				const height = this.$refs.container.getBoundingClientRect().height;
				// Compute margin using if present inside first and last child's margin due to margin collapse
				// and having container no margin
				const firstChild = this.$refs.titleDiv;
				const marginTopStringProperty = getComputedStyle(firstChild)['margin-top'];
				const marginTop = Number(marginTopStringProperty.slice(0, -2));
				this.containerHeight = height + marginTop;
			}
		},
		computed: {
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
			showSponsoredFirst() {
				const docs = [...this.isFiltering ? this.filteredDoctors : this.doctors];
				let firstDocRemoved = undefined;

				for (let i = docs.length - 1; i >= 0; i--) {
					const doc = docs[i];
					if (!!doc.active_sponsorship) {
						// Check if the removed item has already been removed to end execution
						if (firstDocRemoved === doc) break;

						const removed = docs.splice(i, 1)[0];
						docs.unshift(removed);
						if (!firstDocRemoved) firstDocRemoved = removed;
						
						// Needed to not jump one element
						i++;
					}
				}

				return docs;
			},
		},
		watch: {
			'$route.params.specialization': {
				handler(newValue) {
					this.getFilteredReviewsData();
				},
				immediate: true
			},
			'doctors': {
				handler(newValue) {
					const urlName = this.$route.params.name;
					if (urlName) {
						const doctorProfile = this.doctors.find(({ user }) => {
							let result = false;
							// Compare user complete name, homonymous_id included, with in URL name
							const homonymousIdPart = user.homonymous_id ? `-${user.homonymous_id}` : null;
							const fullNamePart = `${user.first_name}-${user.last_name}`;
							let completeName = homonymousIdPart ? fullNamePart + homonymousIdPart : fullNamePart;
							result = completeName === urlName;

							return result;
						})

						if (doctorProfile) this.searchedDoctor = doctorProfile;
					}
				}
			},
			'loaded': {
				handler(newValue) {
					this.$nextTick(() => {
						if (newValue && this.$refs.container) this.$nextTick(this.saveContainerHeight);
					})
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
		<div ref="container" class="container" v-if="!specializationNotFound">
			<div ref="titleDiv" class="title">
				<h2>Risultati per <span class="specialization-title">{{ specializationName }} </span><span
						v-if="!filteredDoctors.length" class="total-specialization-doctor"> (Totale esperti:
						{{
							doctors.length
						}})</span>
					<span v-else class="total-specialization-doctor"> (Totale esperti: {{
						filteredDoctors.length }})</span>
				</h2>
			</div>

			<div class="advanced-filter">
				<AppForm :elements="formElements" :apiRouteAndMethod="null" :formAction="filterDoctors"
					:nameArtConc="['Filtro per recensioni', 'Il', 'o']" :doctorInfo="null" >
					<template #title>
						Filtra medici
					</template>
					<template #subtitle>
						Seleziona il voto medio e/o un numero di recensioni ricevute per trovare il medico che preferesci all'interno
						della specializzazione selezionata.
					</template>
					<template #buttons="{ formData: { vote, revsNum }, resetForm }">
						<div class="col">
							<button type="submit" class="btn btn-sm btn-secondary"
							:disabled="vote === null && revsNum === null">Filtra</button>
							<button type="reset" class="btn btn-sm btn-primary"
								:disabled="vote === null && revsNum === null" @click="() => {resetForm(); stopFiltering()}">Cancella Filtri
							</button>
						</div>
					</template>
				</AppForm>
			</div>

			<!-- Doctors in selected specialization and eventually filtered -->
			<div class="doctors-list" v-if="isFiltering ? filteredDoctors.length : doctors.length">
				<div class="doctor-card" v-for="({ office_address, avg_vote, total_reviews, photo, user: { first_name, last_name, homonymous_id: hom_id } }, index) in showSponsoredFirst"
					@click="goToShowPage(showSponsoredFirst[index], first_name, last_name, hom_id)" :key="index">
					<img class="doctor-photo"
						:src="getProfilePhotoPath(this.store.placeholderImg(first_name, last_name), photo, store.apiUri.slice(0, -4))"
						alt="doctor photo">
					<section class="doctor-information">
						<h5 class="doctor-name">
							{{ first_name }} {{ last_name }}
						</h5>
						<div class="doctor-address">
							<strong>Ufficio:</strong> {{ office_address }}
						</div>
						<div class="doctor-average">
							<strong>Media voti:</strong> {{ avg_vote ? avg_vote : "-" }}
						</div>
						<div class="doctor-reviews">
							<strong>Recensioni ricevute:</strong> {{ total_reviews ? total_reviews :
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
				<RouterView @loaded-pop-up="loadingPopUp = false" :searchedSpecialization="specializationName" :searchedDoctor
					:containerHeight />
			</div>
		</div>

		<AppPopUpCard class="not-found mx-auto" v-else>
			<template #default>
				Specializzazione inserita non corretta, controlla la specializzazione inserita.
			</template>
		</AppPopUpCard>
	</main>
</template>

<style lang="scss" scoped>
	@use "../../styles/forms" as f;
	@use "../../styles/variables" as v;

	main {
		height: 100%;
		padding-bottom: 60px;

		overflow: hidden auto;
		scroll-behavior: smooth;
		position: relative;
	}

	
	h5 {
		margin-bottom: 15px;
		text-align: center;
	}
	
	img {
		border-radius: 50%;
		border: 3px solid #65B0FF;
		/* height: 200px; */
	}

	/* Utilities */
	.container {
		background-color: white;
	}
	
	.title {
		text-align: center;
		margin: 30px 0 20px 0;

		h2 {
			font-size: 1.2rem;
			font-weight: 300;
		}
	}

	.title.not-found {
		h2 {
			font-size: 1.5rem;
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

		.row {
			button.btn {
				width: 100%;
				
				&:nth-of-type(2) {
					margin: {
						left: 0;
						top: 10px;
					} 
				}
			}
		}
	}

	/* Filter form */
	$height: 2rem;
	:deep() {
		.advanced-filter {
			.form-frame {
				padding-bottom: 0;
				min-height: auto;
	
				form {
					@include f.set-fields-color(var(--color-secondary));
					.vote {
						margin-bottom: 0;
					}

					.vote label {
						height: $height * 0.85;
						line-height: $height * 0.7;
			
						.fa-stethoscope {
							font-size: v.$font-size-sm;
						}
					}

					#revsNum {
						margin-bottom: 30px;
					}
				}
			}
		}
	}

	/* Doctor list */
	.doctors-list {
		--col-gap: 15px;
		display: flex;
		gap: 50px var(--col-gap);
		flex-wrap: wrap;
		margin-top: 30px;

		& > :hover {
			cursor: pointer;
			outline: thin solid var(--color-complementary);
			outline-offset: 5px;
		}
	}

	.doctor-photo {
		width: 100%;
		max-width: 230px;
		aspect-ratio: 1;
		object-fit: cover;
		object-position: center;
	}

	.total-specialization-doctor {
		font-style: oblique;
		font-weight: normal;
		font-size: 1.2rem;
	}

	.doctor-card {
		min-height: 300px;
		flex-basis: 100%;
		background-color: #D8F9FF;
		padding: 25px 30px;
		display: flex;
		flex-direction: column;
		gap: 15px;
		align-items: center;
		border-radius: 30px;
		transition: scale 0.2s;

		img {
			height: 120px;
			width: 120px;
		}
	}

	.doctor-name {
		font-size: 0.9rem;
	}

	.doctor-address,
	.doctor-average,
	.doctor-reviews {
		font-size: 0.8rem;
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
	/* Large mobile */
	@media (min-width: 480px) {
		:deep() {
			.advanced-filter {
				.row {
					& > div {
						width: 50%;
					}

					button.btn {
						width: max-content;

						&:nth-of-type(2) {
							margin: {
								top: 0;
								left: 15px;
							}
						}
					}
				}
		
				.form-frame form .vote label {
					height: $height * 0.9;
					line-height: $height * 0.75;
					margin-top: 3px;
		
					.fa-stethoscope {
						font-size: v.$font-size-base;
					}
				}
			}
		}

		// .advanced-filter {
		// 	flex-direction: column;
		// 	align-items: flex-start;
		// }

		.doctors-list {
			--col-gap: 20px;
			justify-content: center;
		}

		.doctor-card {
			flex: 0 calc(100% / 2 - 1 / 2 * var(--col-gap));

			img {
				height: 150px;
				width: 150px;
			}
		}

		.title h2 {
			font-size: 1.4rem;
		}

		.doctor-name h5 {
			font-size: 1rem;
		}

		.doctor-information {
			text-align: start;
		}
	}
	
	/* Desktop (above 768px) */
	@media (min-width: 768px) {
		.doctors-list {
			--col-gap: 30px;
		}

	.doctor-name {
		font-size: v.$h5-font-size;
	}

	.doctor-address,
	.doctor-average,
	.doctor-reviews {
		font-size: v.$font-size-base;
	}


		:deep() {
			.advanced-filter {
				.form-frame form .vote label {
					height: $height;
					line-height: $height * 0.9;
					margin-top: 0;
				}
			}
		}
	}

	/* Big desktop (above 1024px) */
	@media (min-width: 1024px) {
		.doctors-list {
			--col-gap: 50px;

			& > :hover {
				scale: 1.2;
			}
		}
		
		.doctor-card {
		/* Ensure 1 card per row on very small screens */
		flex: 0 calc(100% / 3 - 2 / 3 * var(--col-gap));
		min-height: 450px;
		}

		.title h2 {
			font-size: v.$h2-font-size;
		}
	}

</style>