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
            <div class="last-message">

            </div>
            <div class="messages">
                <div class="card">
                    <div class="card-header-title">
                        <h5 class="title">Messaggi arrivati</h5>
                        <div class="messages-number">Totale: 3</div>
                    </div>
                    <div class="card-body-list" v-for="(message, index) in 3">
                        <ul class="list-group list-group-flush list-email">
                            <li class="list-group-item">E-mail</li>
                        </ul>
                        <ul class="list-group list-group-flush list-name">
                            <li class="list-group-item">Nome e Cognome</li>
                        </ul>
                        <ul class="list-group list-group-flush list-preview">
                            <li class="list-group-item">Preview</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* Inbox Card */
.card {
    border-radius: 20px;
    padding: 10px;
}

.card-header-title {
    display: flex;
    gap: 10px;
}

.card-body-list {
    display: flex;
}

.list-group {
    border-right: 3px solid lightgray;
    border-bottom: 3px solid lightgray;

}

.list-email {
    flex-basis: 20%;
}

.list-name {
    flex-basis: 20%;

}

.list-preview {
    flex-basis: 60%;

}
</style>