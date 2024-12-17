<script>
import axios from 'axios';
import { store } from '../../../../js/store.js';

export default {
    data() {
        return {
            profileData: {},
            loaded: false,
            store,
        }
    },
    methods: {
        getProfileData() {
            axios.get(this.store.apiUri + 'profiles/' + this.store.informationPageId)
                .then(response => {
                    console.log(response);
                    this.profileData = response.data.data;

                    // Data da condividere all'interno degli altri componenti
                    store.profileDataGeneral = response.data.data
                    console.log('data general nello store:', store.profileDataGeneral)
                    localStorage.setItem('user_id', response.data.data.doctor.id)
										localStorage.setItem('profile_id', response.data.data.id)
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    computed: {
        showLoader() {
            setTimeout(() => {
                this.loaded = true
            }, 2000)

        }
    },
    created: function () {
        this.getProfileData();
    },
    mounted() {
        this.showLoader
    }
}
</script>

<template>
    <main class="container d-flex justify-content-center">
        <div class="general-main">
            <h2>Profilo</h2>
            <div class="loader" v-if="!loaded"></div>
            <section class="card-general" v-if="loaded">
                <div class="card mb-3" v-if="Object.keys(profileData).length">
                    <div class="card-flex">
                        <div class="img-doctor">
                            <!-- <img :src="profileData.photo" class="img-flui" alt="doctor photo"> -->
                            <img src="https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
                                class="img-flui" alt="doctor photo">
                        </div>
                        <div class="card-body-general">
                            <div class="card-body">
                                <div class="card-title-section">
                                    <h4 class="card-title">{{ profileData.doctor.first_name }} {{
                                        profileData.doctor.last_name }}
                                    </h4>
                                    <div class="main-information-section">
                                        <section class="email-section d-flex gap-1 align-items-center">
                                            <h5>Email:</h5>
                                            <p>{{ profileData.doctor.email }}</p>
                                        </section>
                                        <section class="password-section d-flex gap-1 align-items-center">
                                            <h5>Password:</h5>
                                            <p>*********</p>
                                        </section>
                                    </div>
                                </div>
                                <div class="card-text">
                                    <ul>
                                        <li>
                                            <strong>Curriculum:</strong> Nome del file
                                        </li>
                                        <li>
                                            <strong>Specializzazione:</strong> {{
                                                profileData.doctor.specializations[0].name }}
                                        </li>
                                        <li>
                                            <strong>Indirizzo:</strong> {{ profileData.office_address }}
                                        </li>
                                        <li>
                                            <strong>Telefono:</strong> {{ profileData.phone }}
                                        </li>
                                        <li>
                                            <strong>Prestazioni:</strong> {{ profileData.services }}
                                        </li>
                                    </ul>
                                </div>
                                <routerLink :to="{ name: 'edit' }"><button href="#" class="edit-profile">Modifica il tuo
                                        profilo</button></routerLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mb-3" v-else>
                    <div class="card-create">
                        <routerLink :to="{ name: 'create' }">
                            <div class="plus"><i class="fa-solid fa-plus"></i></div>
                        </routerLink>
                        <div class="create-profile-text">
                            Il tuo profilo sembra essere un po' vuoto... che ne dici di aggiungerci qualcosa?
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}

h4 {
    margin: 0;
}

h5 {
    margin: 0;
}

p {
    margin: 0;
}

/* Card edit*/

.card-general {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.card {
    border-radius: 40px;
    background-color: #D8F9FF;
    border: 0;
    text-align: center;
    width: 80%;
}

.card-flex {
    display: flex;
}

.img-doctor {
    flex-basis: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-body-general {
    flex-basis: 60%;
}

.card img {
    border-radius: 50%;
    width: 90%;
    border: 3px solid #65B0FF;
    margin: 15px;
}

.card-body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-text {
    border-top: 2px solid var(--color-complementary);
    padding-top: 16px;
}

.main-information-section {
    padding: 15px 0;
}

.email-section,
.password-section {
    padding: 5px 0;
}

ul {
    text-align: start;
}

.edit-profile {
    background-color: var(--color-secondary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}


/* Card create */
.card-create {
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.plus {
    border: 1px solid white;
    border-radius: 30px;
    display: inline;
    padding: 16px 26px;
    color: lightgray;
    background-color: white;
    width: 80px;
    font-size: 1.5rem;
    font-weight: bold;
}

.create-profile-text {
    opacity: 0.5;
}

/* Old loader, classic */
/* Loader */
/* .loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid;
    border-color: #000 #0000;
    animation: l1 1s infinite;
    position: absolute;
    top: 50%;
    left: 59%;
}

@keyframes l1 {
    to {
        transform: rotate(.5turn)
    }
}
*/

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

/* Responsive */
@media only screen and (max-width: 1300px) {
    .card-flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .img-doctor {
        width: 70%;
    }
}
</style>