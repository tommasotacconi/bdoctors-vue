<script>
import axios from 'axios';
import { store } from '../../../js/store';
import DoctorShow from './DoctorShow.vue';
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            store,
            searchedDoctor: [],
            apiUrl: 'http://localhost:8000/api/profiles',
            specializationApiUrl: 'http://127.0.0.1:8000/api/specializations',
            reviewsApiURl: 'http://localhost:8000/api/reviews',
            specializationId: store.searchedSpecialization,
            specializationName: '',
            doctors: [],
            rating: null,
            reviewsNumber: null,
            loaded: false,
            showDoctor: false,
            filteredDoctors: [],
        }
    },
    components: {
        DoctorShow,
    },
    methods: {
        getApiProfile() {
            axios.get(this.apiUrl)
                .then(response => {
                    let profiles = response.data.profiles

                    // Not the best solution but it works
                    // It filter every profiles we have and push it in an empty array that includes only the profiles with the correct specialization
                    let filteredProfiles = []
                    for (let i = 0; i < profiles.length; i++) {
                        let profile = profiles[i]
                        if (profile.user.specializations[0].id == store.searchedSpecialization) {
                            filteredProfiles.push(profile)

                        }
                        let specializationsProfile = profile.user.specializations
                        if (specializationsProfile.length === 2) {
                            if (profile.user.specializations[1].id == store.searchedSpecialization) {
                                filteredProfiles.push(profile)
                            }
                        }
                    }
                    this.doctors = filteredProfiles
                    console.log('Dottori nei data', this.doctors)

                    this.specializations = response.data.specializations;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getSpecializationName() {
            axios.get(this.specializationApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data.specializations);
                    let specializationArray = response.data.specializations
                    for (let i = 0; specializationArray.length; i++) {
                        let specialization = specializationArray[i]
                        if (store.searchedSpecialization === specialization.id) {
                            this.specializationName = specialization.name
                            return
                        }
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },

        // Non più utile
        // removeShowDoctor() {
        //     if (this.showDoctor) {
        //         this.showDoctor = false
        //     } else if (!this.showDoctor) {
        //         this.showDoctor = true
        //     }

        // },

        goToShowPage(doctor, index) {
            let completeName = "";
            if (this.filteredDoctors.length) {
                completeName = doctor.first_name + '-' + doctor.last_name
            } else {
                store.doctorProfile = doctor
                completeName = doctor.user.first_name + '-' + doctor.user.last_name
            }
            this.$router.push({ name: 'search.show', params: { searchId: store.selectedSpecializationName.trim().replace(/ /g, "-").toLowerCase(), id: completeName.toLowerCase() } })
            console.log(index)
            console.log(store.searchedSpecialization)
        },

        getFilteredReviews() {
            let url = `http://localhost:8000/api/reviews/filter/${this.specializationId}/${this.rating}/${this.reviewsNumber}`;

            axios.get(url, {
            })
                .then(response => {
                    // handle success
                    console.log('RECENSIONI FILTRATEEEE', response.data);
                    this.filteredDoctors = response.data
                    console.log(this.filteredDoctors)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error)
                    console.log(error.response.data.message);
                })
        },

        resetInputs() {
            return (this.filteredDoctors = [],
                this.rating = null,
                this.reviewsNumber = null);
        },
    },
    computed: {
        showLoader() {
            setTimeout(() => {
                this.loaded = true
            }, 2000)
        }
    },
    created() {
        this.getApiProfile();
        this.getSpecializationName();
    },
    mounted() {
        this.showLoader
    }
}
</script>

<template>
    <main class="container">
        <!-- Loader -->
        <div class="loader" v-if="!loaded"></div>

        <!-- Components -->
        <div v-if="loaded">
            <div>
                <div class="title">
                    <h2>Ricerca per: <span class="specialization-title">{{ specializationName }} </span><span
                            v-if="!filteredDoctors.length" class="total-specialization-doctor"> (Totale esperti:
                            {{
                                doctors.length
                            }})</span>
                        <span v-else class="total-specialization-doctor"> (Totale esperti: {{
                            filteredDoctors.length }})</span>
                    </h2>
                </div>

                <div class="advanced-filter d-flex">
                    <!-- Average Votes Filter Input -->
                    <div class="average-votes col-4">
                        <div class="votes d-flex">
                            <p>Filtra per media voti: </p>
                            <div class="rating mx-3">
                                <form method="get" class="form-control rating mx-3"
                                    @submit.prevent="getFilteredReviews">
                                    <button type="submit" class="btn btn-sm btn-secondary"
                                        :class="{ 'disabled': rating === null }">Filtra</button>
                                    <input type="radio" id="vote5" name="rating" value="5" v-model="rating">
                                    <label for="vote5"><i class="fa-solid fa-stethoscope"></i>
                                    </label>
                                    <input type="radio" id="vote4" name="rating" value="4" v-model="rating">
                                    <label for="vote4"><i class="fa-solid fa-stethoscope"></i>
                                    </label>
                                    <input type="radio" id="vote3" name="rating" value="3" v-model="rating">
                                    <label for="vote3"><i class="fa-solid fa-stethoscope"></i>
                                    </label>
                                    <input type="radio" id="vote2" name="rating" value="2" v-model="rating">
                                    <label for="vote2"><i class="fa-solid fa-stethoscope"></i>
                                    </label>
                                    <input type="radio" id="vote1" name="rating" value="1" v-model="rating">
                                    <label for="vote1"><i class="fa-solid fa-stethoscope"></i>
                                    </label>
                                </form>
                            </div>
                        </div>

                    </div>

                    <!-- Reviews Number Filter Input-->
                    <div class="reviews-number d-flex gap-3 col-4">
                        <p>Filtra per numero di recensioni:</p>
                        <form action="" method="GET" class="form-control mx-3 d-flex"
                            @submit.prevent="getFilteredReviews">
                            <input type="number" class="form-control" id="reviews" name="reviews" min="0"
                                v-model="reviewsNumber">
                            <button type="submit" :class="{ 'disabled': reviewsNumber === null }"
                                class="btn btn-sm btn-secondary">Filtra</button>
                        </form>
                    </div>

                    <!-- Reset Input Fields Button -->
                    <button type="reset" class="btn btn-sm btn-primary"
                        :class="{ 'disabled': rating === null && reviewsNumber === null }" @click="resetInputs">Cancella
                        Filtri</button>
                </div>


                <div class="doctors-list" v-if="!filteredDoctors.length">
                    <div class="doctor-card" v-for="(doctor, index) in doctors" @click="goToShowPage(doctor, index)">
                        <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                            class="doctor-photo" alt="doctor photo">
                        <section class="doctor-information">
                            <h5 class="doctor-name">
                                {{ doctor.user.first_name }} {{ doctor.user.last_name }}
                            </h5>
                            <div class="doctor-address">
                                <strong>Ufficio:</strong> {{ doctor.office_address }}
                            </div>
                            <div class="doctor-specialization">
                                <strong>Specializzazioni:</strong>
                                <ul>
                                    <li v-for="doctorSpecialization in doctor.user.specializations">
                                        {{ doctorSpecialization.name }}
                                    </li>
                                </ul>

                            </div>
                        </section>
                    </div>
                </div>
                <div class="doctors-list" v-else>
                    <div class="doctor-card" v-for="(doctor, index) in filteredDoctors"
                        @click="goToShowPage(doctor, index)">
                        <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                            class="doctor-photo" alt="doctor photo">
                        <section class="doctor-information">
                            <h5 class="doctor-name">
                                {{ doctor.first_name }} {{ doctor.last_name }}
                            </h5>
                            <div class="doctor-address">
                                <strong>Ufficio:</strong> {{ doctor.home_address }}
                            </div>
                            <div class="doctor-specialization">
                                <strong>Specializzazioni:</strong>
                                <ul>
                                    <li v-for="doctorSpecialization in doctor.specializations">
                                        {{ doctorSpecialization.name }}
                                    </li>
                                </ul>
                            </div>
                            <div class="doctor-address">
                                <strong>Media voti:</strong> {{ doctor.media_voti }}
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
        <div v-else-if="filteredDoctors.length"></div>
    </main>
</template>

<style scoped>
h5 {
    margin-bottom: 15px;
}

.title {
    text-align: center;
    margin: 30px 0 20px 0;
}

.specialization-title {
    text-transform: lowercase;
    font-weight: 400;
}


/* Doctor list */
.doctors-list {
    display: flex;
    gap: 50px 110px;
    justify-content: start;
    flex-wrap: wrap;
    align-content: stretch;
}

.total-specialization-doctor {
    font-style: oblique;
    font-weight: normal;
    font-size: 1.8rem;
}

.doctor-card {
    background-color: #D8F9FF;
    padding: 25px 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;
    align-items: center;
    width: calc((100% / 3) - 80px);
    border-radius: 30px;
    /* height: 400px; */
}

img {
    border-radius: 50%;
    border: 3px solid #65B0FF;
    height: 200px;
}

.button-profile-show {
    background-color: var(--color-secondary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}

/* Non più utile */
/* Show Doctor */
/* .general-show-doctor {
    position: fixed;
    top: 80px;
    left: 25%;
    z-index: 1;
    width: 50%;
}

.show-doctor-active {
    opacity: 0.3;
} */


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
    left: 50%;
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

/*Rating */
.rating {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;

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