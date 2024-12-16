<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { store } from '../../../js/store.js';


export default {
    data() {
        return {
            store,
            sponsorshipsApiUrl: 'http://localhost:8000/api/sponsorships',
            profilesApiUrl: 'http://localhost:8000/api/profiles',
            usersSponsoredId: [],
            profilesId: [],
            filteredProfile: [],
            loaded: false,
        }
    },
    methods: {
        getApiSponsorships() {
            axios.get(this.sponsorshipsApiUrl)
                .then(response => {
                    // handle success
                    // console.log(response.data.sponsorships);
                    let sponsorships = response.data.sponsorships
                    for (let i = 0; i < sponsorships.length; i++) {
                        let sponsorshipProfiles = sponsorships[i].profiles

                        for (let j = 0; j < sponsorshipProfiles.length; j++) {
                            let sponsored = sponsorshipProfiles[j]
                            this.usersSponsoredId.push(sponsored.user_id)
                        }
                    }
                    // console.log(this.userId)

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
        getApiProfiles() {
            axios.get(this.profilesApiUrl)
                .then(response => {
                    // handle success

                    let profiles = response.data.profiles
                    let usersSponsoredId = this.usersSponsoredId

                    this.filteredProfile = profiles.filter(element => usersSponsoredId.includes(element.user_id)
                    )

                    console.log(this.filteredProfile)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
        goToShowPage(doctor, index) {
            store.doctorProfile = doctor
            let completeName = doctor.user.first_name + '-' + doctor.user.last_name
            console.log("doctor", doctor)
            this.$router.push({ name: 'search.show', params: { searchId: 'doctor', id: completeName.toLowerCase() } })
            console.log(index)
            console.log(store.searchedSpecialization)
        },
    },
    mounted() {
        this.showLoader
        this.getApiSponsorships()
        this.getApiProfiles()
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
    <main class="mt-4">
        <div class="container sponsored-doctor-container">
            <h2>Dottori in evidenza</h2>
            <div class="loader" v-if="!loaded"></div>
            <div class="sponsored-card-container">
                <div class="card card-sponsored d-flex" style="width: 18rem;" v-for="(doctor, index) in filteredProfile"
                    @click="goToShowPage(doctor, index)">
                    <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                        class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">{{ doctor.user.first_name }} {{ doctor.user.last_name }}</h5>
                        <div class="card-text">
                            <ul>
                                <li v-for="doctorSpecialization in doctor.user.specializations">
                                    {{ doctorSpecialization.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<style scoped>
ul {
    text-align: start;
    padding-left: 20px;
}

/* Sponsored Doctor */
.sponsored-doctor-container h2 {
    text-align: center;
    margin-bottom: 20px;
}

.sponsored-doctor-container {
    /* background-color: var(--color-complementary); */
    border-radius: 25px;
    padding: 20px;
    margin-bottom: 50px;
}

.sponsored-card-container {
    display: flex;
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;

}

.card-sponsored {
    background-color: #D8F9FF;
    border-radius: 40px;
    flex-direction: column;
    align-items: center;
    border: 0;
    text-align: center;
    flex-basis: 230px;
    border: 2px solid #FFCC00;
    transition: 0.8s;
}

.card-sponsored:hover {
    scale: 1.1;
    cursor: pointer;
    /* border: 4px solid #FFCC00; */
    background-color: #FFCC00;
    color: #0033FF;
}

.card-sponsored:hover img {
    border: 2px solid #0033FF;
}

.card img {
    border-radius: 50%;
    width: 70%;
    border: 2px solid var(--color-primary);
    margin-top: 10px;
}

.card-text {
    text-align: start;
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
    left: 48%;
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