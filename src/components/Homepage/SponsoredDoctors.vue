<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <main class="mt-4">
        <div class="container">
            <h2>Medici in evidenza</h2>
            <div class="card d-flex" style="width: 18rem;">
                <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                    class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">Nome medico</h5>
                    <p class="card-text">Prestazioni medico</p>
                    <a href="#" class="btn btn-primary">Profilo medico</a>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.card {
    border-radius: 40px;
    background-color: #D8F9FF;
    flex-direction: column;
    align-items: center;
    border: 0
}

.card img {
    border-radius: 50%;
    width: 70%;
    border: 1px solid #65B0FF;
    margin-top: 10px;
}
</style>