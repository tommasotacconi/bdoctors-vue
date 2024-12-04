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
        <div class="card-general card-reviews">
            <div class="card-header-title">
                <h5 class="title">Recensioni ricevute</h5>
                <div class="reviews-number"><strong>Totale:</strong> <span class="total-number">5</span></div>
            </div>
        </div>
        <div class="card-general card-review">

        </div>
    </main>
</template>

<style scoped>
/* Card reviews */
.card-general {
    border: 3px solid var(--color-complementary);
    border-radius: 20px;
    padding: 15px;
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


/* Card review */
.card-review {
    margin-top: 40px;
}
</style>