<script>
import InformationPage from './MainDashboardComponents/InformationPage.vue';
import MessagePage from './MainDashboardComponents/MessagePage.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        InformationPage,
        MessagePage,
    }
}
</script>

<template>
    <InformationPage />
    <MessagePage />
</template>

<style scoped></style>