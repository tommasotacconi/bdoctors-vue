<script>
import { store } from '../../../../js/store.js'

export default {
    data() {
        return {
            store
        }
    }
}
</script>

<template>
    <main class="container">
        <div class="general-cards-container">
            <div class="messages">
                <div class="card" style="width: 18rem;">
                    <div class="card-header">
                        Featured
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">An item</li>
                        <li class="list-group-item">A second item</li>
                        <li class="list-group-item">A third item</li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>