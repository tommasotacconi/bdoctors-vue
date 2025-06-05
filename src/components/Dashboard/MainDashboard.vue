<script>
	import { dashboardStore } from '../../../js/dashboardStore'
	import InformationPage from './MainDashboardComponents/InformationPage.vue';
	import MessagePage from './MainDashboardComponents/MessagePage.vue';
	import ReviewPage from './MainDashboardComponents/ReviewPage.vue';
	import SponsorshipPage from './MainDashboardComponents/SponsorshipPage.vue';
	import StatisticsPage from './MainDashboardComponents/StatisticsPage.vue';

	export default {
		data() {
			return {
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
		},
		computed: {
			componentsName() {
				const namesSuffix = 'Page';
				return this.dashboardStore.componentsNameChangingPart.map((changingPart) => changingPart + namesSuffix);
			},
			index() {
				return this.dashboardStore.currentComponentIndex
			}
		}
	}
</script>

<template>
	<component :is="componentsName[index]" />
</template>

<style scoped></style>