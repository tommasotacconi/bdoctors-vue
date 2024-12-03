<script>
import { store } from '../../../js/store.js'

export default {
    data() {
        return {

        }
    },
    methods: {
        toggleSidebar() {
            store.sidebar = !store.sidebar
        }
    }
}
</script>

<template>
    <header>
        <button @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
        Header
    </header>
</template>

<style scoped>
header {
    height: 100%;
    background-color: var(--color-primary);
    color: white;
}

button {
    background-color: transparent;
    color: white;
    border: 0;
}
</style>