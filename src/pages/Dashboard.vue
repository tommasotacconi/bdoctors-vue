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
    <div :class="!store.sidebar ? 'general-structure-full' : 'general-structure'">
        <section class="sidebar" v-if="store.sidebar">
            <SidebarDashboard />
        </section>
        <section :class="!store.sidebar ? 'header-main-full' : 'header-main'">
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
.general-structure {
    display: flex;
    min-height: 100vh;
    overflow: auto;
}

.sidebar {
    flex-basis: 20%;
}

.header-main {
    display: flex;
    flex-basis: 80%;
    flex-direction: column;
}

.header-main-full {
    display: flex;
    flex-basis: 100%;
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