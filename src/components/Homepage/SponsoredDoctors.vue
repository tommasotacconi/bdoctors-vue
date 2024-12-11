<script>
import axios from 'axios';

export default {
    data() {
        return {
            sponsorshipsApiUrl: 'http://localhost:8000/api/sponsorships',
            profilesApiUrl: 'http://localhost:8000/api/profiles',
            usersSponsoredId: [],
            profilesId: [],
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

                    const filteredProfile = profiles.filter(element => usersSponsoredId.includes(element.user_id)
                    )

                    console.log(filteredProfile)
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
    },
    mounted() {
        this.getApiSponsorships()
        this.getApiProfiles()
    }
}
</script>

<template>
    <main class="mt-4">
        <div class="container sponsored-doctor-container">
            <h2>Dottori in evidenza</h2>
            <div class="sponsored-card-container">
                <div class="card card-sponsored d-flex" style="width: 18rem;" v-for="doctor in 15">
                    <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                        class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Nome medico</h5>
                        <p class="card-text">Specializzazioni medico</p>
                        <a href="#" class="btn btn-primary">Profilo medico</a>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<style scoped>
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
    gap: 20px;
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
    flex-basis: 240px;
    border: 2px solid #FFCC00;

}

.card img {
    border-radius: 50%;
    width: 70%;
    border: 1px solid var(--color-primary);
    margin-top: 10px;
}
</style>