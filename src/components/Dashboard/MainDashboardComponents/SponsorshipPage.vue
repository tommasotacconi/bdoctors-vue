<script>
export default {
    data() {
        return {
            price: null,
        }
    },
    methods: {
        getPriceBronze() {

        },
    }
}
</script>

<template>
    <main class="container">
        <h2>Sponsorizzazione</h2>
        <div class="sponsored-description">
            <p>
                Investi nelle tue competenze, sponsorizza il tuo profilo!
                <br>
                Un profilo sponsorizzato compare nella homepage e viene sempre posizionato in cima nella pagina di
                ricerca.
            </p>
            <p>

            </p>
        </div>
        <h3>Scegli la tua sponsorizzazione:</h3>
        <section class="sponsor-cards">
            <div class="sponsor-card card-bronze">
                <div class="card-description">
                    <p class="hour-sponsorship">Garantito per 24 ore</p>
                    <p class="price">2,99€</p>
                </div>
                <div class="premium-star"><i class="fa-solid fa-star"></i></div>
            </div>
            <div class="sponsor-card card-silver">
                <div class="card-description">
                    <p class="hour-sponsorship">Garantito per 72 ore</p>
                    <p class="price">5,99€</p>
                </div>
                <div class="premium-star"><i class="fa-solid fa-star"></i></div>
            </div>
            <div class="sponsor-card card-gold">
                <div class="card-description">
                    <p class="hour-sponsorship">Garantito per 144 ore</p>
                    <p class="price">9,99€</p>
                </div>
                <div class="premium-star"><i class="fa-solid fa-star"></i></div>
            </div>
        </section>
        <div class="button-pay-now-general">
            <button class="button-pay-now">Sponsorizzati ora</button>
        </div>
    </main>
</template>

<style scoped>
p {
    margin: 0
}

h2 {
    margin-bottom: 40px;
    text-align: center;
}

h3 {
    margin: 20px;
    text-align: center;
}

.sponsored-description {
    padding-bottom: 20px;
    text-align: center;
    font-size: 1.2rem;
}


/* Cards */
.sponsor-cards {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.sponsor-card {
    margin-top: 10px;
    padding: 25px 35px;
    border-radius: 25px;
    color: white;
    font-weight: bold;
    /* box-shadow: 5px 5px 15px 1px black; */
    position: relative;
    flex-basis: 30%
}

.card-bronze {
    background-color: #A56C41;
}

.card-silver {
    background-color: #C4C4C4;
}

.card-gold {
    background-color: #FFCC00;
}

.fa-star {
    display: inline;
    font-size: 0.9rem;
    background-color: white;
    border-bottom-left-radius: 35%;
    border: 1px solid white;
    padding: 10px;
    color: #FFCC00;
    position: absolute;
    top: 0px;
    right: 0px;
}

.card-description {
    text-align: center;
}

.hour-sponsorship {
    font-size: 1.2rem;
}

.price {
    font-style: italic;
    font-size: 0.9rem;
}

.button-pay-now-general {
    display: flex;
    justify-content: center;
    margin-top: 25px;
}

.button-pay-now {
    background-color: var(--color-complementary);
    border-radius: 20px;
    padding: 8px 15px;
    text-decoration: none;
    color: var(--color-primary);
    font-weight: bold;
    border: 1px solid var(--color-primary);
}
</style>