<script>
	import { store } from '../../../../../js/store.js';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale
	} from 'chart.js'
	import { Bar } from 'vue-chartjs'

	ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

	export default {
		name: 'App',
		data() {
			return {
				store,
				data: {
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							ticks: {
								stepSize: 1,
							},
							min: 0,
							max: 5,
						}
					}
				}
			}
		},
		methods: {
		},
		components: {
			Bar
		},
		props: {
			chartContainerStyle: {
				type: Object,
				required: true
			}
		}
	}
</script>

<template>
	<h4>Media voti ricevuti <span class="total-year">(Totale voti annuali: {{ store.profileReviews.length }})</span>
	</h4>
	<div class="char" :style="chartContainerStyle">
		<Bar :data="store.chartDataVotes" :options="options" />
	</div>
</template>

<style scoped>
	h4 {
		text-align: center;
		margin-bottom: 20px;
	}

	.total-year {
		opacity: 0.8;
		font-style: italic;
	}
</style>