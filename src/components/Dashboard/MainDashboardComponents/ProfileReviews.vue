<script>
	import { store } from '../../../../js/store.js'
	import axios from 'axios';

	export default {
		data() {
			return {
				store,
				reviewsApiUrl: 'http://localhost:8000/api/reviews',
				loaded: false,
				reviewsProfiles: [],
				reviewsProfile: [],
				reviewSelected: [],
				averageVote: 0,
				reviewSelectedFlag: false,
			}
		},
		methods: {
			getApiReviews() {
				axios.get(this.store.apiUri + 'reviews', {
					withCredentials: true
				})
					.then(response => {
						// handle success
						// console.log(response.data);
						const { data: { reviews: profileReviews } } = response;
						console.log(profileReviews);
						this.reviewsProfile = profileReviews;

						// Calcola la media voti
						let totalNumberVote = 0
						for (let i = 0; i < this.reviewsProfile.length; i++) {
							let review = this.reviewsProfile[i]
							totalNumberVote += review.votes
						}
						this.averageVote = Math.round(totalNumberVote / this.reviewsProfile.length)
					})
					.catch(function (error) {
						// handle error
						console.log(error);
					})
			},
			selectReview(index) {
				this.reviewSelected = this.reviewsProfile[index]
				this.reviewSelectedFlag = true
			},
			getNormalFormatHourDate(index) {
				// Fixed date
				let hourDate = this.reviewsProfile[index].updated_at
				const date = new Date(hourDate)

				// Così posso togliere i secondi
				const options = {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					timeZone: "Europe/Rome"
				};

				return date.toLocaleString("it-IT", options)
			},
			// showAverageVote() {
			//     let totalNumberVote = 0
			//     let reviewsProfile = this.reviewsProfile
			//     for (let i = 0; i < reviewsProfile.length; i++) {
			//         let review = reviewsProfile[i]
			//         totalNumberVote += review.votes
			//     }
			//     this.averageVote = Math.round(totalNumberVote / reviewsProfile.length)
			//     console.log(this.averageVote)
			// }

		},
		mounted() {
			this.showLoader
		},
		created() {
			this.getApiReviews();
		},
		computed: {
			showLoader() {
				setTimeout(() => {
					this.loaded = true
				}, 2000)

			}
		},
	}
</script>

<template>
	<main class="container">
		<h2>Recensioni</h2>

		<Loader v-if="!loaded" />
		<div v-else>
			<div v-if="reviewsProfile.length > 0">
				<div class="card-reviews-container">
					<div class="card-general card-reviews">
						<div class="card-header-title">
							<h5 class="title">Recensioni ricevute</h5>
							<div class="profile-data d-flex">
								<div class="reviews-number">
									<strong>Totale: </strong>
									<span class="total-number">{{ reviewsProfile.length }}</span>
								</div>
								<div class="avg-vote-number">
									<strong>Gradimento medio: </strong>
									<span class="total-number">{{ averageVote }}</span>
								</div>
							</div>
						</div>
						<div class="card-body-list">
							<ul class="list-general" v-for="(review, index) in reviewsProfile" @click="selectReview(index)">
								<li class="list-date">{{ getNormalFormatHourDate(index) }}</li>
								<li class="list-vote"><i class="fa-solid fa-stethoscope" v-for="star in review.votes"></i>
								</li>
								<li class="list-email">{{ review.email }}</li>
								<li class="list-name">{{ review.first_name }} {{ review.last_name }}</li>
								<li class="list-content">{{ review.content }}</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="card-general card-review" v-if="reviewSelectedFlag">
					<div class="card-selected-review">
						<div class="title-star">
							<h5 class="title">Recensione selezionata</h5>
							<div class="star">
								<strong>Voto: </strong>
								<span>
									<i class="fa-solid fa-stethoscope" v-for="star in reviewSelected.votes"></i>
								</span>
							</div>
						</div>

						<div class="review-name">
							<strong>Da:</strong> {{ reviewSelected.first_name }} {{ reviewSelected.last_name }}
						</div>
						<div class="review-email">
							<strong>E-mail:</strong> {{ reviewSelected.email }}
						</div>
						<div class="review-content">
							<div><strong>Contenuto:</strong></div> <span>{{ reviewSelected.content }}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="empty-card-general mt-5">
				<div class="card mb-3">
					<div class="card-create">
						<div class="create-profile-text">
							Al momento non è ancora presente nessuna recensione, <span class="eng-sentence">keep up the
								good work!</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>

	/* General */
	h2 {
		margin-bottom: 40px;
		text-align: center;
	}

	li {
		text-decoration: none;
		list-style-type: none;
		display: flex;
		align-items: center;
		max-height: 25px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	ul {
		border-bottom: 3px dashed var(--color-secondary);
		padding-left: 10px;
		padding: 5px;

	}

	ul:hover {
		background-color: var(--color-secondary);
		color: white;
		cursor: pointer;
	}


	/* Card reviews */
	.card-reviews-container {
		border: 3px solid var(--color-complementary);
		border-radius: 20px;
		height: 300px;
		overflow: auto;
	}

	.card-header-title {
		padding: 10px 15px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: white;
	}

	.reviews-number,
	.avg-vote-number {
		border-radius: 20px;
		border: 3px dashed var(--color-secondary);
		padding: 8px 15px;
		background-color: var(--color-secondary);
		color: white;
	}

	.reviews-number {
		margin-right: 10px;
	}

	.total-number {
		font-weight: bold;
	}

	.card-body-list {
		display: flex;
		flex-direction: column;
		padding: 0 15px;
	}

	.list-general {
		display: flex;
		gap: 10px;
	}

	.list-date {
		flex-basis: 15%;
		border-right: 3px dashed var(--color-secondary);
	}

	.list-vote {
		flex-basis: 10%;
		border-right: 3px dashed var(--color-secondary);
	}

	.list-email {
		flex-basis: 20%;
		border-right: 3px dashed var(--color-secondary);
	}

	.list-name {
		flex-basis: 20%;
		border-right: 3px dashed var(--color-secondary);

	}

	.list-content {
		flex-basis: 50%;

	}

	.list-preview {
		flex-basis: 60%;
		border-bottom: 3px solid var(--color-secondary);
	}


	/* Card review */
	.card-review {
		margin-top: 40px;
		border: 3px solid var(--color-complementary);
		border-radius: 20px;
		padding: 15px;
	}

	.title-star {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 15px;
	}

	.fa-stethoscope {
		color: red;
		font-size: 1.2rem;
		padding-top: 5px;
	}

	.review-email,
	.review-name,
	.review-content {
		margin-top: 20px;
		padding-bottom: 5px;
	}

	.review-email,
	.review-name {
		border-bottom: 2px dashed var(--color-secondary);
	}


	/* Se non è presente nessuna recensione */
	.empty-card-general {
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

	.card-create {
		padding: 30px 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		align-items: center;
	}

	.create-profile-text {
		opacity: 0.5;
	}

	.eng-sentence {
		font-style: italic;
	}
</style>