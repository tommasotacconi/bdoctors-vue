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
        <p>
            Investi nelle tue competenze sponsorizzando il profilo!
            <br>
            Un profilo sponsorizzato compare nella homepage e viene sempre posizionato in cima nella pagina di ricerca.
        </p>
        <p>

        </p>
        <h5>Scegli la tua sponsorizzazione:</h5>
        <section class="sponsor-cards">
            <div class="sponsor-card card-bronze">
                <p class="description">Sponsorizzazione garantita per 24 ore</p>
                <p>2,99€</p>
            </div>
            <div class="sponsor-card card-silver">
                <p class="description">Sponsorizzazione garantita per 72 ore</p>
            </div>
            <div class="sponsor-card card-gold">
                <p class="description">Sponsorizzazione garantita per 144 ore</p>
            </div>
        </section>
    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 40px;
    text-align: center;
}


/* Cards */
.sponsor-cards {
    display: flex;
    justify-content: space-between;
}

.sponsor-card {
    padding: 25px 35px;
    border-radius: 25px;
    color: white;
}

.card-bronze {
    background-color: #A56C41;
}

.card-silver {
    background-color: #C4C4C4;
}

.card-gold {
    background-color: #A56C41;
}
</style>