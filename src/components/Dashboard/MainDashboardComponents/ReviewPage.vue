<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <main class="container">
        <div class="card-reviews-container">
            <div class="card-general card-reviews">
                <div class="card-header-title">
                    <h5 class="title">Recensioni ricevute</h5>
                    <div class="reviews-number"><strong>Totale:</strong> <span class="total-number">10</span></div>
                </div>
                <div class="card-body-list" v-for="(message, index) in 10">
                    <ul class="list-group list-group-flush list-email" @click="selectMessage(index)">
                        <li class="list-group-item">E-mail</li>
                    </ul>
                    <ul class="list-group list-group-flush list-name" @click="selectMessage(index)">
                        <li class="list-group-item">Nome e Cognome</li>
                    </ul>
                    <ul class="list-group list-group-flush list-preview" @click="selectMessage(index)">
                        <li class="list-group-item">Preview</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="card-general card-review">
            <div class="card-selected-review">
                <div class="title-star">
                    <h5 class="title">Recensione selezionata</h5>
                    <div class="star">
                        <strong>Voto: </strong> <i class="fa-solid fa-stethoscope" v-for="star in 4"></i>
                    </div>
                </div>

                <div class="review-name">
                    <strong>Da:</strong> Mario Rossi
                </div>
                <div class="review-email">
                    <strong>E-mail:</strong> mariorossi@gmail.com
                </div>
                <div class="review-content">
                    <div><strong>Contenuto:</strong></div> <span>Lorem ipsum dolor sit amet consectetur adipisicing
                        elit. Veniam
                        velit officia quaerat
                        similique
                        ducimus excepturi dolore aliquam sed blanditiis maxime voluptas error perspiciatis sequi
                        officiis ullam delectus rerum, vero dolorem?</span>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
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
    border: 3px solid var(--color-secondary);
    padding: 8px 15px;
    background-color: var(--color-secondary);
    color: white;
}

.total-number {
    font-weight: bold;
}

.card-body-list {
    display: flex;
    padding: 0 15px;
}

.list-email {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);
    border-bottom: 3px solid var(--color-secondary);
}

.list-name {
    flex-basis: 20%;
    border-right: 3px dashed var(--color-secondary);
    border-bottom: 3px solid var(--color-secondary);
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