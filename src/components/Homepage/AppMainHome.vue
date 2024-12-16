<script>
import SponsoredDoctors from './SponsoredDoctors.vue';

export default {
    data() {
        return {
            loaded: false,

        }
    },
    components: {
        SponsoredDoctors,
    },
    computed: {
        showLoader() {
            setTimeout(() => {
                this.loaded = true
            }, 2000)

        }
    },
    mounted() {
        this.showLoader
    },
}
</script>

<template>
    <div class="loader" v-if="!loaded"></div>

    <main v-else>
        <div class="">
            <div class="container-introduction">
                <div class="introduction">
                    <div class="container container-text-introduction">
                        <div>
                            <h2>BDOCTORS: Trova lo specialista che fa al caso tuo!</h2>

                            <p>Nessuna registrazione - nessun problema! <br>Manda direttamente una richiesta al medico
                                che
                                preferisci e verrai comodamente contattato alla mail indicata.
                            </p>
                        </div>
                        <div>
                            <button class="sponsored-doctor-button"><a href="#sponsored-doctors">Scopri i nostri dottori
                                    in
                                    evidenza!</a></button>
                        </div>
                    </div>
                    <img class="img-doctors"
                        src="https://img.freepik.com/premium-vector/medical-staff-team-concept-team-doctors-uniform-standing-together-vector-illustration_77116-2252.jpg"
                        alt="">

                </div>
            </div>
        </div>
        <SponsoredDoctors id="sponsored-doctors" />
    </main>
</template>

<style scoped>
/* Common style and normal doctor */
h2 {
    text-align: center;
    margin-bottom: 20px;

}

a {
    color: var(--color-primary);
    text-decoration: none;
}

.introduction {
    height: 450px;
    display: flex;
    align-items: center;
    background: rgb(101, 176, 255);
    background: linear-gradient(90deg, rgba(101, 176, 255, 1) 0%, rgba(255, 255, 255, 1) 38%);
    text-align: center;
    justify-content: center;
    gap: 30px;
    position: relative;
    top: -20px;
    left: 0;
}

.introduction p {
    font-weight: 500;
    font-style: italic;
}

.sponsored-doctor-button {
    background-color: var(--color-secondary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}

.container-text-introduction {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.card-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.card-container .card {
    border-radius: 40px;
    background-color: #D8F9FF;
    flex-direction: column;
    align-items: center;
    border: 0;
    text-align: center;
    flex-basis: 240px;
}

.card img {
    border-radius: 50%;
    width: 70%;
    border: 1px solid var(--color-primary);
    margin-top: 10px;
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



@media screen and (max-width: 1230px) {
    .img-doctors {
        display: none;
    }

    .introduction {
        justify-content: center;
    }
}
</style>