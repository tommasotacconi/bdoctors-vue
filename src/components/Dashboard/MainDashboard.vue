<script>
import { store } from '../../../js/store';
import InformationPage from './MainDashboardComponents/InformationPage.vue';
import MessagePage from './MainDashboardComponents/MessagePage.vue';
import ReviewPage from './MainDashboardComponents/ReviewPage.vue';

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
</template>

<style scoped></style>