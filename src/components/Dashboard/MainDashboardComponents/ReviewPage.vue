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
                    // for (let i = 0; i < reviewsProfile.length; i++) {
                    //     let review = reviewsProfile[i]
                    //     totalNumberVote += review.votes
                    // }
                    // this.averageVote = totalNumberVote / reviewsProfile.length
                    // console.log(Math.round(this.averageVote))


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
        showAverageVote() {
            let totalNumberVote = 0
            let reviewsProfile = this.reviewsProfile
            for (let i = 0; i < reviewsProfile.length; i++) {
                let review = reviewsProfile[i]
                totalNumberVote += review.votes
            }
            this.averageVote = Math.round(totalNumberVote / reviewsProfile.length)
            console.log(this.averageVote)
        }

    },
    beforeCreate() {
        this.showLoader


    },
    created() {
        this.getApiReviews();
        // this.showAverageVote();

    },
    mounted() {
        // this.showAverageVote();
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
        <div class="card-reviews-container">
            <div class="card-general card-reviews">
                <div class="card-header-title">
                    <h5 class="title">Recensioni ricevute</h5>
                    <div class="reviews-number"><strong>Totale:</strong> <span class="total-number">{{
                        reviewsProfile.length }}</span></div>
                </div>
                <div class="card-body-list">
                    <ul class="list-general" v-for="(review, index) in reviewsProfile" @click="selectReview(index)">
                        <li class="list-vote"><i class="fa-solid fa-stethoscope" v-for="star in 5"></i></li>
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
                        <strong>Voto: </strong> <i class="fa-solid fa-stethoscope" v-for="star in averageVote"></i>
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
    </main>
</template>

<style scoped>
/* General */
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
</style>