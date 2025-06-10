import { reactive } from 'vue';

export const dashboardStore = reactive({
  // Variable for toggle sidebar inside dashboard
  sidebar: true,
	
	// Variable for changing content inside dashboard
	currentComponentIndex: 0, 
  componentsNameChangingPart: ['Information', 'Message', 'Review', 'Sponsorship', 'Statistics'],
  labelsForComponents: ['Profilo', 'Messaggi', 'Recensioni', 'Sponsorizzazioni', 'Statistiche'],

	// Variabel for changing statistics sight
	currentChartIndex: 0,
	statisticsChartComponents: ['MessagesChart', 'ReviewsChart', 'VotesChart'],
	labelsForCharts: ['Messaggi', 'Recensioni', 'Voti'],
  // Chart data 
  chartDataMessages: {},
  chartDataReviews: {},
  chartDataVotes: {},
  profileMessages: [],
  profileReviews: [],
})