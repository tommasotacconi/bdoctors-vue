import { reactive } from 'vue';

export const dashboardStore = reactive({
  // Variable for toggle sidebar inside dashboard
  sidebar: true,
	
	// Variable for changing content inside dashboard
	currentPageIndex: 0, 
  noSuffixPagesName: ['Information', 'Messages', 'Reviews', 'Sponsorships', 'Statistics'],
  labelsForComponents: ['Profilo', 'Messaggi', 'Recensioni', 'Sponsorizzazioni', 'Statistiche'],

	// Variable for changing profile section page content
	currentProfileSectionComponentIndex: 0,
	noPrefixComponentsName: ['Info', 'Creation', 'Edit'],

	// Variable for changing statistics sight
	currentChartIndex: 0,
	statisticsChartComponents: ['MessagesChart', 'ReviewsChart', 'VotesChart'],
	labelsForCharts: ['Messaggi', 'Recensioni', 'Voti'],

	profileDataGeneral: {},

  // Chart data 
  chartDataMessages: {},
  chartDataReviews: {},
  chartDataVotes: {},
  profileMessages: [],
  profileReviewsWithVotes: [],
})