<script>
import AppHeader from '../components/Homepage/AppHeader.vue';
import SearchedDoctor from '../components/Search/SearchedDoctor.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        AppHeader,
        SearchedDoctor,
    }
}
</script>

<template>
    <AppHeader />
    <SearchedDoctor />
</template>

<style scoped></style>