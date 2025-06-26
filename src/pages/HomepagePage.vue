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
    <div class="bg">
        <AppMainHome />
    </div>
</template>

<style scoped>
.app-header {
    position: sticky;
    top: 0;
    z-index: 1;
}

.bg {
    background-image: url(../../public/tile_background.png);
}
</style>