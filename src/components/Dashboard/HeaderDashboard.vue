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
    <header class="header-element">
        <div class="menu-button">
            <button @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
        </div>
        <div class="user">
            <i class="fa-solid fa-user"></i>
        </div>
    </header>
</template>

<style scoped>
header {
    height: 100%;
    background-color: var(--color-primary);
    color: white;
    width: 100%;
}

.header-element {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

button {
    background-color: transparent;
    color: white;
    border: 0;
    font-size: 2rem;
}

.fa-user {
    border-radius: 50%;
    border: 1px solid white;
    padding: 8px;
    background-color: white;
    color: var(--color-complementary);
    margin-right: 7px;
}
</style>