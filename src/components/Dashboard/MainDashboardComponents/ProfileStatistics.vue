<script>
	import axios from 'axios';
	import MessagesChart from './StatisticsPage/MessagesChart.vue';
	import { store } from '../../../../js/store';
	import ReviewsChart from './StatisticsPage/ReviewsChart.vue';
	import VotesChart from './StatisticsPage/VotesChart.vue';
	import { dashboardStore } from '../../../../js/dashboardStore';

	export default {
		data() {
			return {
				store,
				dashboardStore,
				chartContainerStyle: {
					width: '100%',
					aspectRatio: 5 / 3,
					padding: '20px 20px 0',
					position: 'relative',
					backgroundColor: '#fff',
					overflow: 'hidden',
				}
			}
		},
		methods: {
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
			/**
			 * Set chartDataObjec in dashboardStore for a given data category, ex. messages
			 * 
			 * @param store Used store
			 * @param dataName Api retrieved data
			 * @param chartDataName chart data object for the given data category inside used 'store', ex. 'chartDataMessages' 
			 */
			setChartData(chartDataName, store, dataName) {
				const data = store[dataName];

				// Trasformo il valore updated_at in una data leggibile facilmente in modo da riprenderla successivamente
				data.forEach(element => {
					const dateFormatRE = /\d{2}\/\d{4}/;
					const elementDate = element.updated_at;
					if (!dateFormatRE.test(elementDate)) element.updated_at = this.getFormattedDate(elementDate);
				});

				// Data for single chart
				const chartDataObject = {
					labels: [],
					datasets: [
						{ data: [], backgroundColor: '#65B0FF', /* qui si può inserire il label */ }
					]
				};
				// Compute Months array
				const months = Array.from({ length: 12 }, (item, i) => {
					return new Date(0, i).toLocaleString('it-IT', { month: 'long' })
				});
				// Compute data for datasets
				let computedData = [];
				if (chartDataName === 'charDataVotes') computedData = this.calcDataPerMonthArray(store[dataName], 'mean');
				else computedData = this.calcDataPerMonthArray(store[dataName]);

				store[chartDataName] = chartDataObject;
				store[chartDataName].labels = months;
				store[chartDataName].datasets[0].data = computedData;
			},
			updateWidth() {
				this.windowWidth = window.innerWidth;
			}

		},
		components: {
			MessagesChart,
			ReviewsChart,
			VotesChart,
		},
		computed: {
			chartName() {
				return this.dashboardStore.statisticsChartComponents;
			},
			index() {
				return this.dashboardStore.currentChartIndex;
			}
		},
		created() {
			this.setChartData('chartDataMessages', this.dashboardStore, 'profileMessages');
			this.setChartData('chartDataReviews', this.dashboardStore, 'profileReviewsWithVotes');
			this.setChartData('chartDataVotes', this.dashboardStore, 'profileReviewsWithVotes')
			// this.getVotes();
		}
	}
</script>

<template>
	<main>
		<div class="container">
			<h2>Statistiche</h2>
			<div class="display-button">
				<button class="button-char" @click="dashboardStore.currentChartIndex = index"
					v-for="(label, index) in dashboardStore.labelsForCharts">{{ label }}</button>
			</div>
			<div class="component-chart">
				<component :is="chartName[index]" :chartContainerStyle />
			</div>
		</div>

	</main>
</template>

<style scoped>
	h2 {
		margin-bottom: 40px;
		text-align: center;
	}

	.display-button {
		display: flex;
		justify-content: center;
		gap: 30px;
		margin-bottom: 30px;
	}

	.button-char {
		background-color: var(--color-secondary);
		border-radius: 20px;
		padding: 8px 15px;
		text-decoration: none;
		color: var(--color-primary);
		font-weight: bold;
		border: 1px solid var(--color-primary);
		width: 130px;
	}
</style>