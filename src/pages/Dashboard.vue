<script>
	import HeaderDashboard from '../components/Dashboard/HeaderDashboard.vue';
	import MainDashboard from '../components/Dashboard/MainDashboard.vue';
	import SidebarDashboard from '../components/Dashboard/SidebarDashboard.vue';
	import axios from 'axios';
	import { store } from '../../js/store.js';
	import { dashboardStore } from '../../js/dashboardStore.js';

	export default {
		data() {
			return {
				store,
				dashboardStore,
				profileMessages: [],
				profileReviews: [],
				windowWidth: window.innerWidth
			};
		},
		methods: {
			getApiMessages() {
				axios.get(this.store.apiUri + 'messages', {
					withCredentials: true
				})
					.then(({ data: { messages } }) => {
						this.prepareChartWithProfileData(messages, 'profileMessages', 'chartDataMessages', 'messagesPerMonthNumbers');
					})
					.catch(function (err) {
						// handle error
						console.log('ERROR in GET /api/messages: ' + err.response.data.message);

					})
			},
			getApiReviewsAndVotes() {
				axios.get(this.store.apiUri + 'reviews', {
					withCredentials: true,
				})
					.then(({ data: { reviews } }) => {
						this.prepareChartWithProfileData(reviews, 'profileReviews', 'chartDataReviews', 'reviewsPerMonthNumbers');
						this.getApiVotes();
					})
					.catch(function (err) {
						// handle error
						if (err.response?.data?.message) console.log('ERROR IN GET /api/reviews: ' + err.response.data.message);
					})
			},
			getApiVotes() {
				const profileReviews = this.store.profileReviews
				// Funzione che calcola la media dei voti
				this.prepareChartWithProfileData(profileReviews, 'profileVotes', 'chartDataVotes', 'meanVotePerMonthNumbers')

			},
			calcAverageVote(profileReviews) {
				if (profileReviews.length === 0) return undefined
				let totalNumberVote = 0

				for (let i = 0; i < profileReviews.length; i++) {
					let review = profileReviews[i]
					totalNumberVote += review.votes
				}
				return Math.round(totalNumberVote / profileReviews.length)
			},
			getFormattedDate(dateToFormat) {
				const date = new Date(dateToFormat);
				const options = {
					year: "numeric",
					month: "2-digit",
				};

				return date.toLocaleString("it-IT", options)
			},
			calcDataPerMonthArray(elementsArray, option) {
				let result = [];
				for (let i = 0; i < 12; i++) {
					const month = i;
					result[month] = 0;
				}
				if (!option) {
					// Count reviews in each month by examining reviews array
					elementsArray.forEach(element => {
						const revMonth = Number(element.updated_at.slice(0, 2) - 1);
						result[revMonth] += 1;
					})
					return result;
				} else if (option === 'mean') {
					for (let i = 0; i < 12; i++) {
						const inMonthElements = elementsArray.filter(element => Number(element.updated_at.slice(0, 2) - 1) === i);
						result[i] += this.calcAverageVote(inMonthElements) ?? 0;
						console.log(result[i]);
					}
					return result;
				}
			},
			prepareChartWithProfileData(dataArray, dataName, chartDataName, computedDataName) {
				const data = dataArray;

				// Trasformo il valore updated_at in una data leggibile facilmente in modo da riprenderla successivamente
				data.forEach(element => {
					const dateFormatRE = /\d{2}\/\d{4}/;
					const elementDate = element.updated_at;
					if (!dateFormatRE.test(elementDate)) element.updated_at = this.getFormattedDate(elementDate);
				});
				console.log(`${dataName}: `, data);
				this.store[dataName] = data;
				// Chart data object structure: {
				// 	labels: [],
				// 	datasets: [
				// 		{ data: [], backgroundColor: '#65B0FF', /* qui si può inserire il label */ }
				// 	]
				// }
				this.store[chartDataName] = this.chartDataStructure;
				this.store[chartDataName].labels = this.monthsArray;
				this.store[chartDataName].datasets[0].data = this[computedDataName];
			},
			updateWidth() {
				this.windowWidth = window.innerWidth;
			}
		},
		components: {
			SidebarDashboard,
			HeaderDashboard,
			MainDashboard,
		},
		mounted() {
			window.addEventListener('resize', this.updateWidth)
		},
		created: function () {
			this.getApiMessages();
			this.getApiReviewsAndVotes();
		},
		computed: {
			messagesPerMonthNumbers() {
				return this.calcDataPerMonthArray(this.store.profileMessages);
			},
			reviewsPerMonthNumbers() {
				return this.calcDataPerMonthArray(this.store.profileReviews);
			},
			meanVotePerMonthNumbers() {
				return this.calcDataPerMonthArray(this.store.profileReviews, 'mean');
			},
			monthsArray() {
				const months = Array.from({ length: 12 }, (item, i) => {
					return new Date(0, i).toLocaleString('it-IT', { month: 'long' })
				});
				return months;
			},
			chartDataStructure() {
				return {
					labels: [],
					datasets: [
						{ data: [], backgroundColor: '#65B0FF', /* qui si può inserire il label */ }
					]
				}
			}
		}
	}
</script>

<template>
	<div class="general-structure">
		<Transition>
			<section class="sidebar" v-show="dashboardStore.sidebar">
				<SidebarDashboard />
			</section>
		</Transition>
		<section class="header-main">
			<div class="header">
				<HeaderDashboard />
			</div>
			<div class="main">
				<MainDashboard />
			</div>
		</section>
	</div>
</template>

<style scoped>
	.general-structure {
		display: flex;
		min-height: 100vh;
		overflow: auto;
	}

	.sidebar {
		flex-basis: 280px;
		overflow: hidden;

		&.compressed {
			flex-basis: 200px;
		}
	}

	/* Sidebar's transition */
	.sidebar.v-enter-active,
	.sidebar.v-leave-active {
		transition: flex-basis 0.4s ease;
	}

	.sidebar.v-enter-from,
	.sidebar.v-leave-to {
		flex-basis: 0%;
	}

	.header-main {
		flex: 1;

		display: flex;
		flex-direction: column;
	}

	.header-main-full {
		display: flex;
		flex-basis: 100%;
		flex-direction: column;
	}

	.header {
		flex-basis: 10%;
	}

	.main {
		flex-basis: 90%;
		margin: 20px 0 0 20px;
	}

	/* Media queries */
	@media only screen and (max-width: 1024px) {
		.sidebar {
			flex-basis: 200px;
		}
	}
</style>