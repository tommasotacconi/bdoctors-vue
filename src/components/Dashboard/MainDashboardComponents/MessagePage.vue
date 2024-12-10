<script>
import { store } from '../../../../js/store.js'
import axios from 'axios';

export default {
    data() {
        return {
            store,
            messagesApiUrl: 'http://localhost:8000/api/messages',
            messagesProfile: [],
            messageSelected: [],
            loaded: false,
        }
    },
    methods: {
        getApiMessages() {
            axios.get(this.messagesApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data);
                    let messagesProfiles = response.data.messages
                    console.log(messagesProfiles)
                    let idProfile = store.profileDataGeneral.id
                    console.log(idProfile)

                    const messagesProfile = messagesProfiles.filter(message => message.profile_id === idProfile)
                    console.log(messagesProfile)
                    this.messagesProfile = messagesProfile
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
        selectMessage(index) {
            this.messageSelected = this.messagesProfile[index]
            console.log(this.messagesProfile[index])
        },
    },
    mounted() {
        this.showLoader

    },
    created() {
        this.getApiMessages()
    },
    computed: {
        showLoader() {
            setTimeout(() => {
                this.loaded = true
            }, 2000)

        }
    },
}
</script>

<template>
    <main class="container">
        <div class="loader" v-if="!loaded"></div>
        <div v-else class="general-cards-container">
            <div class="all-messages">
                <div class="card-inbox">
                    <div class="card-header-title">
                        <h5 class="title">Messaggi arrivati</h5>
                        <div class="messages-number"><strong>Totale:</strong> <span class="total-number">{{
                            messagesProfile.length }}</span></div>
                    </div>

                    <!-- Nuovo sistema di lista -->
                    <div class="card-body-list">
                        <ul class="list-general" v-for="(message, index) in messagesProfile"
                            @click="selectMessage(index)">
                            <li class="list-email">{{ message.email }}</li>
                            <li class="list-name">{{ message.first_name }} {{ message.last_name }}</li>
                            <li class="list-content">{{ message.content }}</li>
                        </ul>

                        <!-- Vecchio sistema di lista, il nuovo è più facile da mantenere -->
                        <!-- <ul class="list-group list-group-flush list-name" @click="selectMessage(message, index)">
                            <li class="list-group-item">{{ message.first_name }} {{ message.last_name }}</li>
                        </ul>
                        <ul class="list-group list-group-flush list-preview" @click="selectMessage(message, index)">
                            <li class="list-group-item">{{ message.content }}</li>
                        </ul> -->
                    </div>
                </div>
            </div>
            <div class="selected-message">
                <div class="card-selected-message">
                    <h5 class="title">Messaggio selezionato</h5>

                    <div class="message-name">
                        <strong>Da:</strong> {{ messageSelected.first_name }} {{ messageSelected.last_name }}
                    </div>
                    <div class="message-email">
                        <strong>E-mail:</strong> {{ messageSelected.email }}
                    </div>
                    <div class="message-content">
                        <div><strong>Contenuto:</strong></div> <span>{{ messageSelected.content }}</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* General */
li {
    text-decoration: none;
    list-style-type: none;
    display: flex;
    align-items: center;
    max-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

ul {
    border-bottom: 3px dashed var(--color-secondary);
    padding-left: 10px;
}

/* Inbox Card */
.card-inbox::-webkit-scrollbar {
    width: 10px;
    position: relative;
    top: 0;
    right: 10px;
}

.card-inbox {
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    height: 300px;
    overflow: auto;
}

.card-header-title {
    padding: 10px 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
}

.messages-number {
    border-radius: 20px;
    border: 3px solid var(--color-secondary);
    padding: 8px 15px;
    background-color: var(--color-secondary);
    color: white;
}

.total-number {
    font-weight: bold;
}

.card-body-list {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
}

.list-general {
    display: flex;
    gap: 10px;
}

.list-email {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);
}

.list-name {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);

}

.list-content {
    flex-basis: 60%;

}

.list-preview {
    flex-basis: 60%;
    border-bottom: 3px solid var(--color-secondary);
}


/* Selected Message */
.card-selected-message {
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    padding: 15px;
}

.selected-message {
    margin-top: 40px;
}

.message-email,
.message-name,
.message-content {
    margin-top: 20px;
    padding-bottom: 5px;
}

.message-email,
.message-name {
    border-bottom: 2px dashed var(--color-secondary);
}

.message-content {
    margin-bottom: 12px;
}

/* Loader progressive */
.loader {
    --r1: 154%;
    --r2: 68.5%;
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
        radial-gradient(var(--r1) var(--r2) at bottom, var(--color-secondary) 79.5%, #0000 80%),
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
        #ccc;
    background-size: 50.5% 220%;
    background-position: -100% 0%, 0% 0%, 100% 0%;
    background-repeat: no-repeat;
    animation: l9 2s infinite linear;
    position: absolute;
    top: 50%;
    left: 59%;
}

@keyframes l9 {
    33% {
        background-position: 0% 33%, 100% 33%, 200% 33%
    }

    66% {
        background-position: -100% 66%, 0% 66%, 100% 66%
    }

    100% {
        background-position: 0% 100%, 100% 100%, 200% 100%
    }
}
</style>