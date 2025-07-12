<script>
	import ProfileInfo from '../components/Dashboard/MainDashboardComponents/ProfileInfo.vue';
	import ProfileCreation from '../components/Dashboard/MainDashboardComponents/InformationPage/ProfileCreation.vue';
	import ProfileEdit from '../components/Dashboard/MainDashboardComponents/InformationPage/ProfileEdit.vue';
	import { dashboardStore } from '../../js/dashboardStore';

	export default {
		data() {
			return {
				dashboardStore
			}
		},
		components: {
			ProfileInfo,
			ProfileCreation,
			ProfileEdit
		},
		computed: {
			componentsName() {
				const namesPrefix = 'Profile';
				return this.dashboardStore.noPrefixComponentsName.map(partialName => namesPrefix + partialName);
			},
			index() {
				return this.dashboardStore.currentProfileSectionComponentIndex
			}
		},
	}
</script>

<template>
	<component :is="componentsName[index]" />
</template>

<style scoped></style>