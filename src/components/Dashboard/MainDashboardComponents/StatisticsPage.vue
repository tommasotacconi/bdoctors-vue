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
				messagesApiUrl: 'http://localhost:8000/api/messages',
				messagesProfile: [],
				chartContainerStyle: {
					width: '100%',
					aspectRatio: 5 / 3,
					position: 'relative',
					backgroundColor: '#fff',
					overflow: 'hidden',
				}
			}
		},
		methods: {
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
		},
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