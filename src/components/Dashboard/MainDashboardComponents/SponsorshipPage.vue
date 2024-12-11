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
        <h2>Sponsorizzazione</h2>
        <div class="sponsored-description">
            <p>
                Investi nelle tue competenze sponsorizzando il profilo!
                <br>
                Un profilo sponsorizzato compare nella homepage e viene sempre posizionato in cima nella pagina di
                ricerca.
            </p>
            <p>

            </p>
        </div>
        <h4>Scegli la tua sponsorizzazione:</h4>
        <section class="sponsor-cards">
            <div class="sponsor-card card-bronze">
                <div class="card-description">
                    <p>Garantito per 24 ore</p>
                    <p>2,99€</p>
                </div>
                <div class="premium-star"><i class="fa-solid fa-star"></i></div>
            </div>
            <div class="sponsor-card card-silver">
                <p class="card-description">Garantito per 72 ore</p>
                <p>5,99€</p>
            </div>
            <div class="sponsor-card card-gold">
                <p class="card-description">Garantito per 144 ore</p>
                <p>9,99€</p>
            </div>
        </section>
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

h4 {
    margin: 20px;
    text-align: center;
}

.sponsored-description {
    padding-bottom: 10px;
}


/* Cards */
.sponsor-cards {
    display: flex;
    justify-content: center;
    gap: 10px;
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
    border-bottom-left-radius: 30%;
    border: 1px solid white;
    padding: 10px;
    color: #FFCC00;
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>