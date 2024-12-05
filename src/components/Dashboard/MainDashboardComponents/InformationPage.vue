<script>
import axios from 'axios';
import { store } from '../../../../js/store.js';

export default {
    data() {
        return {
            profileData: {},
            store,
        }
    },
    methods: {
        getProfileData() {
            axios.get(this.store.apiUri + 'profiles/' + this.store.informationPageId)
                .then(response => {
                    console.log(response);
                    this.profileData = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    created: function () {
        this.getProfileData();
    }
}
</script>

<template>
    <main class="container d-flex justify-content-center">
        <div class="general-main">
            <h2>Profilo</h2>
            <section class="card-general">
                <div class="card mb-3" v-if="Object.keys(profileData).length">
                    <div class="card-flex">
                        <div class="img-doctor">
                            <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
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
                                <a href="#" class="edit-profile">Modifica il tuo profilo</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mb-3" v-else>
                    <div class="card-create">
                        <div class="plus"><i class="fa-solid fa-plus"></i></div>
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
    padding: 20px;
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