<script>
	import axios from 'axios';
	import { store } from '../../../js/store'
	import { dashboardStore } from '../../../js/dashboardStore'
	import InformationPage from '../../pages/InformationPage.vue';
	import MessagesPage from '../../pages/MessagesPage.vue';
	import ReviewsPage from '../../pages/ReviewsPage.vue';
	import SponsorshipsPage from '../../pages/SponsorshipsPage.vue';
	import StatisticsPage from '../../pages/StatisticsPage.vue';

	export default {
		data() {
			return {
				store,
				dashboardStore
			}
		},
		components: {
			InformationPage,
			MessagesPage,
			ReviewsPage,
			SponsorshipsPage,
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
			pagesName() {
				const namesSuffix = 'Page';
				return this.dashboardStore.noSuffixPagesName.map(partialName => partialName + namesSuffix);
			},
			index() {
				return this.dashboardStore.currentPageIndex
			}
		},
		created() {
			this.getApiMessages();
			this.getApiReviewsWithVotes();
		}
	}
</script>

<template>
	<component :is="pagesName[index]" />
</template>

<style scoped></style>