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
                <div class="card-inbox">
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
.card-inbox {
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    padding: 10px;
}

.card-header-title {
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.messages-number {
    border-radius: 20px;
    border: 3px solid var(--color-secondary);
    padding: 8px 15px;
}

.card-body-list {
    display: flex;
}

.list-group {
    border-right: 3px solid var(--color-secondary);
    border-bottom: 3px solid var(--color-secondary);

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