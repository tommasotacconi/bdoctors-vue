<script>
import axios from 'axios';
import { store } from '../../../js/store.js';

export default {
    data() {
        return {
            profileData: {},
            // loader temporary cancelled
            loaded: true,
            store,
        }
    },
    methods: {
        getProfileData() {
            axios.get(this.store.apiUri + 'profiles/' + this.store.informationPageId)
                .then(response => {
                    // console.log(response);
                    this.profileData = response.data.data;
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
            <div class="loader" v-if="!loaded"></div>
            <section class="card-general" v-if="loaded">
                <div class="card mb-3">
                    <div class="card-flex">
                        <div class="img-doctor">
                            <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                                class="img-flui" alt="doctor photo">
                        </div>
                        <div class="card-body-title-section">
                            <h2 class="card-title">
                                {{ store.doctorProfile.user.first_name }} {{ store.doctorProfile.user.last_name }}
                                <!-- {{ profileData.doctor.first_name }} {{ profileData.doctor.last_name }} -->
                            </h2>
                        </div>
                        <div class="card-body-text-section">
                            <ul class="d-flex flex-wrap row-gap-3 ul-child-elements">
                                <li>
                                    <h3>Curriculum</h3>
                                    <div class="data-element curriculum-element">
                                        Curriculum.pdf
                                    </div>
                                </li>
                                <li class="">
                                    <h3>Specializzazione</h3>
                                    <div class="data-element specializations-element">
                                        <ul>
                                            <li v-for="specialization in store.doctorProfile.user.specializations">{{
                                                specialization.name }}</li>
                                        </ul>
                                    </div>
                                    <!-- {{ profileData.doctor.specializations[0].name }} -->
                                </li>
                                <li>
                                    <h3>Indirizzo</h3>
                                    <div class="data-element address-element">
                                        {{ store.doctorProfile.office_address }}
                                    </div>
                                    <!-- {{ profileData.office_address }} -->
                                </li>
                                <li>
                                    <h3>Telefono</h3>
                                    <div class="data-element telephone-element">
                                        {{ store.doctorProfile.phone }}
                                    </div>
                                    <!-- {{ profileData.phone }} -->
                                </li>
                                <li>
                                    <h3>Prestazioni</h3>
                                    <div class="data-element services-element">
                                        {{ store.doctorProfile.services }}
                                    </div>
                                    <!-- {{ profileData.services }} -->
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<style lang="scss" scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}

h3 {
    font-size: 1.2rem;
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
    min-height: 80vh;
    margin-top: 50px;
    padding: 0 50px;
    border-radius: 40px;
    background-color: #D8F9FF;
    border: 0;
    text-align: center;
    width: 80%;

    position: relative;
}

.card-flex {
    display: flex;
    flex-wrap: wrap;
}

.img-doctor {
    flex-basis: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card img {
    width: 90%;
    margin: 15px;
    border-radius: 50%;
    border: 3px solid #65B0FF;
}

.card-body-title-section {
    flex-basis: 60%;
}

.card-title {
    position: relative;
    top: 50%;
    translate: 0 -50%
}

.card-body-text-section {
    flex-grow: 1;
    border-top: 2px solid var(--color-complementary);
    padding-top: 16px;

    ul.ul-child-elements>* {
        flex-basis: 50%;
        height: 130px;
    }
}

ul {
    text-align: start;
    padding-left: 0;
    list-style-type: none;
}

.edit-profile {
    background-color: var(--color-secondary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);

    position: absolute;
    bottom: 15px;
    left: 50%;
    translate: -50% 0;
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

    .card-title {
        margin-top: 50px;
        margin-bottom: 0;
    }
}

@media only screen and (max-width: 780px) {
    .card-body-text-section ul {
        flex-direction: column;
    }
}
</style>