<script>
import AppCreate from '../components/Create/AppCreate.vue';
import AppHeader from '../components/Homepage/AppHeader.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        AppCreate,
        AppHeader
    }
}
</script>

<template>
    <AppHeader />
    <AppCreate />
</template>

<style scoped lang="scss"></style>