<script>
import { store } from '../../../js/store';
import InformationPage from './MainDashboardComponents/InformationPage.vue';
import MessagePage from './MainDashboardComponents/MessagePage.vue';
import ReviewPage from './MainDashboardComponents/ReviewPage.vue';
import SponsorshipPage from './MainDashboardComponents/SponsorshipPage.vue';
import StatisticPage from './MainDashboardComponents/StatisticPage/StatisticPage.vue';

export default {
    data() {
        return {
            store
        }
    },
    components: {
        InformationPage,
        MessagePage,
        ReviewPage,
        SponsorshipPage,
        StatisticPage,
    }
}
</script>

<template>
    <div v-if="store.informationPage">
        <InformationPage />
    </div>

    <div v-if="store.messagePage">
        <MessagePage />
    </div>

    <div v-if="store.reviewPage">
        <ReviewPage />
    </div>

    <div v-if="store.sponsorshipPage">
        <SponsorshipPage />
    </div>

    <div v-if="store.statisticPage">
        <StatisticPage />
    </div>
</template>

<style scoped></style>