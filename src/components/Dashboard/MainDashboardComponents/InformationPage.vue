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
        <h2>Profilo</h2>
        <section class="card-general">
            <div class="card mb-3" style="width: 1000px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                            class="img-flui" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Nome medico</h5>
                            <p class="card-text">
                            <ul>
                                <li>
                                    <strong>Specializzazione:</strong> Cardiologia / Neurologia
                                </li>
                                <li>
                                    <strong>Indirizzo:</strong> Via Boolean 15, Caltanisetta
                                </li>
                                <li>
                                    <strong>Telefono:</strong> 338451523
                                </li>
                            </ul>
                            </p>
                            <a href="#" class="btn btn-primary">Modifica il tuo profilo</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
h2 {
    margin-bottom: 20px;
}

/* Card */
.card {
    border-radius: 40px;
    background-color: #D8F9FF;
    border: 0;
    text-align: center;
    width: 70%;
}

.card img {
    border-radius: 50%;
    width: 60%;
    border: 1px solid #65B0FF;
    margin: 15px 0;
}

.card-body {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

ul {
    text-align: start;
}
</style>