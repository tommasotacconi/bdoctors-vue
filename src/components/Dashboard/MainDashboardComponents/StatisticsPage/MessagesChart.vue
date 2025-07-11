<script>
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
	import { dashboardStore } from '../../../../../js/dashboardStore.js';

	ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

	export default {
		data() {
			return {
				dashboardStore,
				data: {
				},
				options: {
					responsive: true,
					aspectRatio: 5 / 3,
					plugins: {
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							ticks: {
								stepSize: 1
							}
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
		},
		created() {
			console.log('Chart data: ', this.dashboardStore.chartDataMessages);
		}
	}
</script>

<template>
	<h4>Messaggi ricevuti <span class="total-year">(Totale anno: {{ dashboardStore.profileMessages.length }})</span>
	</h4>
	<div class="char" :style="chartContainerStyle">
		<Bar :data="dashboardStore.chartDataMessages" :options="options" />
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