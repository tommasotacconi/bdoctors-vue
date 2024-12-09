<script>
import axios from 'axios';
import { store } from '../../../js/store';

export default {
    data() {
        return {
            store,
            searchedDoctor: [],
            apiUrl: 'http://localhost:8000/api/profiles',
            specializationId: store.searchedSpecialization,
            doctors: []
        }
    },
    methods: {
        getApiProfile() {
            axios.get(this.apiUrl)
                .then(response => {
                    console.log(response.data);
                    let profiles = response.data.profiles
                    console.log(profiles)
                    console.log(this.specializationId)
                    console.log(profiles[0].user.specializations[0].id)
                    console.log(store.searchedSpecialization)

                    // Qua non funziona, da capire come mai
                    profiles.filter(profile => profile.id === store.searchedSpecialization)
                    console.log(profiles)

                    // Idem qui con un for normale
                    let filteredProfiles = []
                    for (let i = 0; i < profiles.length; i++) {
                        let profile = profiles[i]
                        if (profile.user.specializations[0].id == store.searchedSpecialization) {
                            filteredProfiles.push(profile)
                        }
                    }
                    console.log(filteredProfiles)
                    this.doctors = filteredProfiles

                    this.specializations = response.data.specializations;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
    },
    created() {
        this.getApiProfile()
    }
}
</script>

<template>
    <main class="container ">
        <div class="title">
            <h2>Ricerca per: <span class="specialization-title"> {{ doctors[0].user.specializations[0].name }}</span>
            </h2>
        </div>
        <div class="doctors-list">
            <div class="doctor-card" v-for="doctor in doctors">
                <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                    class="doctor-photo" alt="doctor photo">
                <section class="doctor-information">
                    <div class="doctor-name">
                        <strong>{{ doctor.user.first_name }} {{ doctor.user.last_name }}</strong>
                    </div>
                    <div class="doctor-services">
                        {{ doctor.services }}
                    </div>
                </section>
            </div>
        </div>
    </main>
</template>

<style scoped>
.title {
    text-align: center;
    margin: 30px 0 20px 0;
}

.specialization-title {
    text-transform: lowercase;
}

.doctors-list {
    display: flex;
    gap: 40px;
    justify-content: space-between;
    flex-wrap: wrap;
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

.doctor-information {}
</style>