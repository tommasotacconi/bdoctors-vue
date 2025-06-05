import { reactive } from 'vue';

export const dashboardStore = reactive({
  // Variable for toggle sidebar inside dashboard
  sidebar: true,
	
	// Variable for changing content inside dashboard
	currentComponentIndex: 0, 
	
  componentsNameChangingPart: ['Information', 'Message', 'Review', 'Sponsorship', 'Statistics'],
  labelsForComponents: ['Profilo', 'Messaggi', 'Recensioni', 'Sponsorizzazioni', 'Statistiche'],

  // chart
  chartDataMessages: {},
  chartDataReviews: {},
  chartDataVotes: {},
  profileMessages: [],
  profileReviews: [],
})