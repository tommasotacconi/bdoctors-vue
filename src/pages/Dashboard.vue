<script>
import HeaderDashboard from '../components/Dashboard/HeaderDashboard.vue';
import MainDashboard from '../components/Dashboard/MainDashboard.vue';
import SidebarDashboard from '../components/Dashboard/SidebarDashboard.vue';

export default {
    data() {
        return {

        }
    },
    components: {
        SidebarDashboard,
        HeaderDashboard,
        MainDashboard,
    }
}
</script>

<template>
    <div class="d-flex">
        <section class="sidebar">
            <SidebarDashboard />
        </section>
        <section class="header-main">
            <div class="header">
                <HeaderDashboard />
            </div>
            <div class="main">
                <MainDashboard />
            </div>
        </section>
    </div>
</template>

<style scoped></style>