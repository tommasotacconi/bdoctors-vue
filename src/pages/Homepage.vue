<script>
import AppHeader from '../components/Homepage/AppHeader.vue';
import AppMainHome from '../components/Homepage/AppMainHome.vue';

export default {
    data() {
        return {
        }
    },
    components: {
        AppHeader,
        AppMainHome,
    }
}
</script>

<template>
    <AppHeader class="app-header" />
    <AppMainHome />
</template>

<style scoped>
.app-header {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>