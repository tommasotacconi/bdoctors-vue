<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchedDoctor: [],
            apiUrl: 'http://127.0.0.1:8000/api/profile/',
        }
    },
    methods: {
        searchDoctor() {
            // for ()
            //     if ($route.params.id)
            //         this.searchedDoctor.filter()
        },
        getApiProfile() {
            axios.get(`${this.apiUrl}`)
                .then(response => {
                    // handle success
                    console.log(response.data.specializations);
                    this.specializations = response.data.specializations;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
    }
}
</script>

<template>
    <main class="container doctors-list">
        <div class="doctor-card" v-for="doctor in 6">
            <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                class="doctor-photo" alt="doctor photo">
            <section class="doctor-information">
                <div class="doctor-name">
                    Nome Cognome
                </div>
                <div class="doctor-services">
                    Prestazioni
                </div>
            </section>
        </div>
    </main>
</template>

<style scoped>
.doctors-list {
    display: flex;
    gap: 40px;
    justify-content: space-between;
    flex-wrap: wrap;
}

.doctor-card {
    background-color: #D8F9FF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc((100% / 3) - 80px);
}

img {
    border-radius: 50%;
    border: 3px solid #65B0FF;
    height: 40%;
}

.doctor-information {
    flex-basis: 50%;
}
</style>