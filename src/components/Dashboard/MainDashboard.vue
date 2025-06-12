<script>
	import axios from 'axios';
	import { store } from '../../../js/store'
	import { dashboardStore } from '../../../js/dashboardStore'
	import InformationPage from './MainDashboardComponents/InformationPage.vue';
	import MessagePage from './MainDashboardComponents/MessagePage.vue';
	import ReviewPage from './MainDashboardComponents/ReviewPage.vue';
	import SponsorshipPage from './MainDashboardComponents/SponsorshipPage.vue';
	import StatisticsPage from './MainDashboardComponents/StatisticsPage.vue';

	export default {
		data() {
			return {
				store,
				dashboardStore
			}
		},
		components: {
			InformationPage,
			MessagePage,
			ReviewPage,
			SponsorshipPage,
			StatisticsPage,
		},
		methods: {
			getApiMessages() {
				axios.get(this.store.apiUri + 'messages', {
					withCredentials: true
				})
					.then(({ data: { messages } }) => {
						this.dashboardStore.profileMessages = messages;
					})
					.catch(function (err) {
						// handle error
						console.log('ERROR in GET /api/messages: ' + err.response.data.message);

					})
			},
			getApiReviewsWithVotes() {
				axios.get(this.store.apiUri + 'reviews', {
					withCredentials: true,
				})
					.then(({ data: { reviews } }) => {
						this.dashboardStore.profileReviewsWithVotes = reviews;
						// this.getVotes();
					})
					.catch(function (err) {
						// handle error
						if (err.response?.data?.message) console.log('ERROR IN GET /api/reviews: ' + err.response.data.message);
					})
			},
		},
		computed: {
			componentsName() {
				const namesSuffix = 'Page';
				return this.dashboardStore.componentsNameChangingPart.map((changingPart) => changingPart + namesSuffix);
			},
			index() {
				return this.dashboardStore.currentComponentIndex
			}
		},
		created() {
			this.getApiMessages();
			this.getApiReviewsWithVotes();
		}
	}
</script>

<template>
	<component :is="componentsName[index]" />
</template>

<style scoped></style>