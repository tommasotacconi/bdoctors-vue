<script>
import HeaderDashboard from '../components/Dashboard/HeaderDashboard.vue';
import MainDashboard from '../components/Dashboard/MainDashboard.vue';
import SidebarDashboard from '../components/Dashboard/SidebarDashboard.vue';

import { store } from '../../js/store.js'

export default {
    data() {
        return {
            store
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
    <div class="general-structure d-flex">
        <section class="sidebar" v-if="store.sidebar">
            <SidebarDashboard />
        </section>
        <section class="header-main d-flex">
            <div class="header">
                <HeaderDashboard />
            </div>
            <div class="main">
                <MainDashboard />
            </div>
        </section>
    </div>
</template>

<style scoped>
.sidebar {
    flex-basis: 20%;
}

.header-main {
    flex-basis: 80%;
    flex-direction: column;
}

.header {
    flex-basis: 10%;
}

.main {
    flex-basis: 90%;
    margin: 20px 0 0 20px;
}
</style>