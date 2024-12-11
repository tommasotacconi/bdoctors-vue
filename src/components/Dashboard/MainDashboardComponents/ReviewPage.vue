<script>
import { store } from '../../../../js/store.js'
import axios from 'axios';

export default {
    data() {
        return {
            store,
            reviewsApiUrl: 'http://localhost:8000/api/reviews',
            loaded: false,
            reviewsProfiles: [],
            reviewsProfile: [],
            reviewSelected: [],
            averageVote: 0,
        }
    },
    methods: {
        getApiReviews() {
            axios.get(this.reviewsApiUrl)
                .then(response => {
                    // handle success
                    console.log(response.data);
                    let reviewsProfiles = response.data.reviews
                    console.log(reviewsProfiles)
                    let idProfile = store.profileDataGeneral.id
                    console.log(idProfile)
                    console.log(reviewsProfiles[0].profile_id)

                    const reviewsProfile = reviewsProfiles.filter(review => review.profile_id === idProfile)
                    console.log(reviewsProfile)
                    let totalNumberVote = 0

                    this.reviewsProfile = reviewsProfile


                    // Calcola la media voti
                    for (let i = 0; i < reviewsProfile.length; i++) {
                        let review = reviewsProfile[i]
                        totalNumberVote += review.votes
                    }
                    console.log(reviewsProfile.length)
                    this.averageVote = Math.round(totalNumberVote / reviewsProfile.length)
                    console.log(this.averageVote)


                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        },
        selectReview(index) {
            this.reviewSelected = this.reviewsProfile[index]
            console.log(this.reviewsProfile[index])
        },
        // showAverageVote() {
        //     let totalNumberVote = 0
        //     let reviewsProfile = this.reviewsProfile
        //     for (let i = 0; i < reviewsProfile.length; i++) {
        //         let review = reviewsProfile[i]
        //         totalNumberVote += review.votes
        //     }
        //     this.averageVote = Math.round(totalNumberVote / reviewsProfile.length)
        //     console.log(this.averageVote)
        // }

    },
    mounted() {
        this.showLoader
    },
    created() {
        this.getApiReviews();
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
    <main class="container">
        <h2>Recensioni</h2>

        <div class="loader" v-if="!loaded"></div>
        <div v-else>
            <div v-if="reviewsProfile.length > 0">
                <div class="card-reviews-container">
                    <div class="card-general card-reviews">
                        <div class="card-header-title">
                            <h5 class="title">Recensioni ricevute</h5>
                            <div class="reviews-number"><strong>Totale:</strong> <span class="total-number">{{
                                reviewsProfile.length }}</span></div>
                        </div>
                        <div class="card-body-list">
                            <ul class="list-general" v-for="(review, index) in reviewsProfile"
                                @click="selectReview(index)">
                                <li class="list-vote"><i class="fa-solid fa-stethoscope"
                                        v-for="star in review.votes"></i>
                                </li>
                                <li class="list-email">{{ review.email }}</li>
                                <li class="list-name">{{ review.first_name }} {{ review.last_name }}</li>
                                <li class="list-content">{{ review.content }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-general card-review">
                    <div class="card-selected-review">
                        <div class="title-star">
                            <h5 class="title">Recensione selezionata</h5>
                            <div class="star">
                                <strong>Voto: </strong>
                                <span>
                                    <i class="fa-solid fa-stethoscope" v-for="star in reviewSelected.votes"></i>
                                </span>
                            </div>
                        </div>

                        <div class="review-name">
                            <strong>Da:</strong> {{ reviewSelected.first_name }} {{ reviewSelected.last_name }}
                        </div>
                        <div class="review-email">
                            <strong>E-mail:</strong> {{ reviewSelected.email }}
                        </div>
                        <div class="review-content">
                            <div><strong>Contenuto:</strong></div> <span>{{ reviewSelected.content }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="empty-card-general mt-5">
                <div class="card mb-3">
                    <div class="card-create">
                        <div class="create-profile-text">
                            Al momento non è ancora presente nessuna recensione, <span class="eng-sentence">keep up the
                                good work!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
/* General */
h2 {
    margin-bottom: 40px;
    text-align: center;
}

li {
    text-decoration: none;
    list-style-type: none;
    display: flex;
    align-items: center;
    max-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

ul {
    border-bottom: 3px dashed var(--color-secondary);
    padding-left: 10px;
    padding: 5px;

}

ul:hover {
    background-color: var(--color-secondary);
    color: white;
    cursor: pointer;
}


/* Card reviews */
.card-reviews-container {
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    height: 300px;
    overflow: auto;
}

.card-header-title {
    padding: 10px 15px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
}

.reviews-number {
    border-radius: 20px;
    border: 3px dashed var(--color-secondary);
    padding: 8px 15px;
    background-color: var(--color-secondary);
    color: white;
}

.total-number {
    font-weight: bold;
}

.card-body-list {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
}

.list-general {
    display: flex;
    gap: 10px;
}

.list-vote {
    flex-basis: 10%;
    border-right: 3px dashed var(--color-secondary);
}

.list-email {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);
}

.list-name {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);

}

.list-content {
    flex-basis: 50%;

}

.list-preview {
    flex-basis: 60%;
    border-bottom: 3px solid var(--color-secondary);
}


/* Card review */
.card-review {
    margin-top: 40px;
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    padding: 15px;
}

.title-star {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px;
}

.fa-stethoscope {
    color: red;
    font-size: 1.2rem;
    padding-top: 5px;
}

.review-email,
.review-name,
.review-content {
    margin-top: 20px;
    padding-bottom: 5px;
}

.review-email,
.review-name {
    border-bottom: 2px dashed var(--color-secondary);
}


/* Se non è presente nessuna recensione */
.empty-card-general {
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

.card-create {
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

.create-profile-text {
    opacity: 0.5;
}

.eng-sentence {
    font-style: italic;
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
</style>