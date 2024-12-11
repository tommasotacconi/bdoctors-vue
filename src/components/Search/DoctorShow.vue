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
            messageForm: {
                patient_firstname: '',
                patient_lastname: '',
                patient_email: '',
                message: '',
            },
            reviewForm: {
                review: '',
                rating: ''
            },
            errors: {
                messageForm: {
                    patient_firstname: '',
                    patient_lastname: '',
                    patient_email: "",
                    message: ''
                },
                reviewForm: {
                    rating: null,
                }

            },
            messageFormValidated: false,
            reviewFormValidated: false,
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

        // Method to send patients messages

        sendMessageForm() {
            axios.post('', this.messageForm)
                .then(response => {
                    console.log('Message sent.', response.data)
                })
                .catch(function (error) {
                    // handle error
                    console.error(error)
                    console.log(error.response.data.errors);
                })
                .finally(function () {
                    // always executed
                });
        },

        // Method to send patients reviews

        sendReviewForm() {
            axios.post('', this.reviewForm)
                .then(response => {
                    console.log('Review sent.', response.data)
                })
                .catch(function (error) {
                    // handle error
                    console.error(error)
                    console.log(error.response.data.errors);
                })
                .finally(function () {
                    // always executed
                });
        },

        //Validation methods

        validEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        validateMessageForm() {
            if (!this.messageForm.patient_firstname) {
                this.errors.messageForm.patient_firstname = 'Il nome è obbligatorio.';
            } else if (this.messageForm.patient_firstname.length <= 2) {
                this.errors.messageForm.patient_firstname = 'Il nome deve contenere almeno 3 caratteri.';
            };
            if (!this.messageForm.patient_lastname) {
                this.errors.messageForm.patient_lastname = "Il cognome è obbligatorio."
            } else if (this.messageForm.patient_lastname.length <= 2) {
                this.errors.messageForm.patient_lastname = "Il cognome deve contenere almeno 3 caratteri."
            };
            if (!this.messageForm.patient_email) {
                this.errors.messageForm.patient_email = "L'email è obbligatoria.";
            } else if (!this.validEmail(this.messageForm.patient_email)) {
                this.errors.messageForm.patient_email = "L'email inserita non è valida.";
            }
            if (!this.messageForm.message) {
                this.errors.messageForm.message = "Inserisci il corpo del messaggio"
            }

            if (!this.errors.messageForm.length) {
                this.messageFormValidated = true;
                this.sendMessageForm();

            }
            console.log(this.messageForm);
            console.log(this.errors.messageForm);
        },

        validateReviewForm() {
            if (!this.reviewForm.rating) {
                this.errors.reviewForm.rating = "Devi inserire da 1 a 5 stetoscopi per poter inviare la tua recensione"
            }

            if (!this.errors.reviewForm.length) {
                this.reviewFormValidated = true;
                this.sendReviewForm();
            }
        }
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
                                class="img-fluid" alt="doctor photo">
                        </div>
                        <div class="card-body-title-section">
                            <h1 class="card-title py-3">
                                Dott.{{ store.doctorProfile.user.first_name }} {{ store.doctorProfile.user.last_name
                                }}
                                <!-- {{ profileData.doctor.first_name }} {{ profileData.doctor.last_name }} -->
                            </h1>
                            <h4 class="text-start">
                                Specialista in:
                                <ul class="specializations-list">
                                    <li class="specializations-list-item"
                                        v-for="specialization in store.doctorProfile.user.specializations">{{
                                            specialization.name }}</li>
                                </ul>
                            </h4>
                            <p class="address">{{ store.doctorProfile.office_address }}</p>
                        </div>
                    </div>
                    <div class="card-body-text-section d-flex justify-content-between">
                        <ul class="d-flex flex-wrap row-gap-3 ul-child-elements col-5 py-3">
                            <li id="curriculum-border" class="card-list-item">
                                <h3>Curriculum</h3>
                                <div class="data-element curriculum-element">
                                    Curriculum.pdf
                                </div>
                            </li>
                            <li id="specialization-border" class="card-list-item">
                                <h3>Specializzazione</h3>
                                <div class="data-element specializations-element">
                                    <ul>
                                        <li v-for="specialization in store.doctorProfile.user.specializations">
                                            {{
                                                specialization.name }}</li>
                                    </ul>
                                </div>
                                <!-- {{ profileData.doctor.specializations[0].name }} -->
                            </li>
                            <li id="address-border" class="card-list-item">
                                <h3>Indirizzo</h3>
                                <div class="data-element address-element">
                                    {{ store.doctorProfile.office_address }}
                                </div>
                                <!-- {{ profileData.office_address }} -->
                            </li>
                            <li id="phone-border" class="card-list-item">
                                <h3>Telefono</h3>
                                <div class="data-element telephone-element">
                                    {{ store.doctorProfile.phone }}
                                </div>
                                <!-- {{ profileData.phone }} -->
                            </li>
                            <li id="services-border" class="card-list-item">
                                <h3>Prestazioni</h3>
                                <div class="data-element services-element">
                                    {{ store.doctorProfile.services }}
                                </div>
                                <!-- {{ profileData.services }} -->
                            </li>
                        </ul>

                        <div class="forms col-6">
                            <!-- Message Form -->
                            <h5 class="my-3">Contatta lo specialista</h5>
                            <form method="POST" class="form-control py-3" @submit.prevent="validateMessageForm"
                                novalidate>
                                <div class="mb-3 col-12">
                                    <label for="patient_firstname" class="form-label">Nome</label>
                                    <input type="text" class="form-control"
                                        :class="{ 'invalid-input': errors.messageForm.patient_firstname }"
                                        id="patient_firstname" v-model.trim="messageForm.patient_firstname" required>
                                    <div class="invalid" v-if="errors.messageForm.patient_firstname">
                                        <p> {{ errors.messageForm.patient_firstname }} </p>
                                    </div>
                                </div>
                                <div class="mb-3 col-12">
                                    <label for="patient_lastname" class="form-label">Cognome</label>
                                    <input type="text" class="form-control"
                                        :class="{ 'invalid-input': errors.messageForm.patient_lastname }"
                                        id="patient_lastname" v-model.trim="messageForm.patient_lastname" required>
                                    <div class="invalid" v-if="errors.messageForm.patient_lastname">
                                        <p> {{ errors.messageForm.patient_lastname }} </p>
                                    </div>
                                </div>
                                <div class="mb-3 col-12">
                                    <label for="patient_email" class="form-label">Email</label>
                                    <input type="email" class="form-control"
                                        :class="{ 'invalid-input': errors.messageForm.patient_email }"
                                        id="patient_email" placeholder="Inserisci il tuo indirizzo email"
                                        v-model.trim="messageForm.patient_email" required>
                                    <div class="invalid" v-if="errors.messageForm.patient_email">
                                        <p> {{ errors.messageForm.patient_email }} </p>
                                    </div>
                                </div>
                                <div class="mb-3 col-12">
                                    <label for="message" class="form-label align-start">Messaggio</label>
                                    <textarea class="form-control"
                                        :class="{ 'invalid-input': errors.messageForm.message }" id="message" rows="3"
                                        v-model="messageForm.message"></textarea>
                                    <div class="invalid" v-if="errors.messageForm.message">
                                        <p> {{ errors.messageForm.message }} </p>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-submit">Invia messaggio</button>
                            </form>

                            <div class="my-3 py-3">
                                <h5 class="my-3">Lascia una recensione</h5>
                                <form action="" method="POST" class="form-control py-3" @submit.prevent="sendReviewForm"
                                    novalidate>
                                    <div class="mb-3 col-12">
                                        <label for="review" class="form-label">Messaggio</label>
                                        <textarea class="form-control" id="review" rows="3"
                                            placeholder="Inserisci qui la tua recensione..."
                                            v-model="reviewForm.review"></textarea>
                                    </div>
                                    <div class="rating">
                                        <input type="radio" id="vote5" name="rating" value="5"
                                            v-model="reviewForm.rating">
                                        <label for="vote5"><i class="fa-solid fa-stethoscope"></i>
                                        </label>
                                        <input type="radio" id="vote4" name="rating" value="4"
                                            v-model="reviewForm.rating">
                                        <label for="vote4"><i class="fa-solid fa-stethoscope"></i>
                                        </label>
                                        <input type="radio" id="vote3" name="rating" value="3"
                                            v-model="reviewForm.rating">
                                        <label for="vote3"><i class="fa-solid fa-stethoscope"></i>
                                        </label>
                                        <input type="radio" id="vote2" name="rating" value="2"
                                            v-model="reviewForm.rating">
                                        <label for="vote2"><i class="fa-solid fa-stethoscope"></i>
                                        </label>
                                        <input type="radio" id="vote1" name="rating" value="1"
                                            v-model="reviewForm.rating">
                                        <label for="vote1"><i class="fa-solid fa-stethoscope"></i>
                                        </label>
                                    </div>
                                    <div>

                                    </div>
                                    <button type="submit" class="btn btn-primary btn-submit">Invia
                                        recensione</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<style lang="scss" scoped>
h1 {
    color: var(--color-complementary);
}

h4 {
    color: var(--color-secondary);
}

h3 {
    font-size: 1.2rem;
}

h5 {
    margin: 0;
    color: var(--color-complementary);
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
    border-radius: 40px;
    border: 3px solid #65B0FF;
    text-align: center;
    width: 100%;
    position: relative;
}

.card-flex {
    border-radius: 40px 40px 0 0;
    background-color: #D8F9FF;
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
}


.card-body-title-section {
    display: flex;
    flex-direction: column;
    flex-basis: 60%;
    align-items: start;
    padding-top: 50px;

    & .address {
        font-size: 1.1rem;
        color: var(--color-secondary);
    }
}

// .card-title {
//     position: relative;
//     top: 50%;
//     translate: 0 -50%
// }

.card-body-text-section {
    flex-grow: 1;
    border-top: 2px solid var(--color-complementary);
    padding: 16px 50px;

    ul.ul-child-elements>* {
        flex-basis: 100%;
        height: 100px;
    }
}

.card-list-item {
    border: 1px grey;
    border-radius: 10px;
    box-shadow: -2px 2px 3px 1px rgb(119, 118, 118);
    padding: 10px;

}

ul {
    text-align: start;
    padding-left: 0;
    list-style-type: none;
}

form {
    border-radius: 40px;
    border: 3px solid #65B0FF;
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

/* Message form */
.invalid {
    color: red;
}

.invalid-input {
    border-color: red;
}

/*Rating */
.rating {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;

    & input {
        display: none;
    }

    & label {
        font-size: 24px;
        cursor: pointer;
    }

    & label:hover,
    & label:hover~label {
        color: var(--color-complementary)
    }

    & input:checked~label {
        color: var(--color-complementary)
    }
}
</style>