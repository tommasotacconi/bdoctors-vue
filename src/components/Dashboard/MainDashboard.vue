<script>
import { store } from '../../../js/store';
import InformationPage from './MainDashboardComponents/InformationPage.vue';
import MessagePage from './MainDashboardComponents/MessagePage.vue';

export default {
    data() {
        return {
            store
        }
    },
    components: {
        InformationPage,
        MessagePage,
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
</template>

<style scoped></style>