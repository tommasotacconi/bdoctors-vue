<script>
import axios from 'axios';
import { store } from '../../../js/store';

export default {
    data() {
        return {
            store,
            searchedDoctor: [],
            apiUrl: 'http://localhost:8000/api/profiles',
            specializationApiUrl: 'http://127.0.0.1:8000/api/specializations',
            specializationId: store.searchedSpecialization,
            doctors: [],
            specializationName: '',
        }
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


        }
    },
    created() {
        this.getApiProfile()
        this.getSpecializationName()
    }
}
</script>

<template>
    <main class="container">
        <div class="title">
            <h2>Ricerca per: {{ specializationName }}
            </h2>
            <!-- It's not working -->
            <!-- {{ doctors[0].user.specializations[0].name }} -->
        </div>
        <div class="doctors-list">
            <div class="doctor-card" v-for="doctor in doctors">
                <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                    class="doctor-photo" alt="doctor photo">
                <section class="doctor-information">
                    <h5 class="doctor-name">
                        {{ doctor.user.first_name }} {{ doctor.user.last_name }}
                    </h5>
                    <div class="doctor-address">
                        <strong>Ufficio:</strong> {{ doctor.office_address }}
                    </div>
                    <div class="doctor-services">
                        <strong>Prestazioni:</strong> {{ doctor.services }}
                    </div>
                </section>

                <!-- We can put the router link all over the card -->
                <!-- <section class="profile-show">
                    <button class="button-profile-show">Profilo</button>
                </section> -->
            </div>
        </div>
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
}

.doctors-list {
    display: flex;
    gap: 50px 110px;
    justify-content: start;
    flex-wrap: wrap;
    align-content: stretch;
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
</style>