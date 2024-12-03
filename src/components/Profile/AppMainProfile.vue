<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <div class="container">
        <div>
            <div class="row my-4">
                <div class="col-12 d-flex py-3">
                    <img src="https://media.istockphoto.com/id/1340883379/photo/young-doctor-hospital-medical-medicine-health-care-clinic-office-portrait-glasses-man.jpg?s=612x612&w=0&k=20&c=_H4VUPBkS0gEj5ZdZzQo-Hw3lMuyofJpB-P9yS92Wyw="
                        alt="profile.pic" class="pro-pic">
                    <div class="p-3 d-flex justify-content-between w-100">
                        <div class="pro-info">
                            <h1>Dott. Nome e Cognome</h1>
                            <h3>Specializzazione</h3>
                            <h4>Città</h4>
                            <h5>Numero di telefono</h5>
                        </div>
                        <div>
                            <!-- Send Message UI button -->
                            <!-- <a href="" class="btn btn-lg msg"><i class="fa-solid fa-envelope"></i> Invia un messaggio
                            </a> -->
                            <a href="" class="btn btn-lg btn-bg"><i class="fa-solid fa-pencil"></i> Modifica
                                Informazioni
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.row {
    border: 2px solid;
    border-color: var(--color-primary);
    border-radius: 10px;
}

.pro-pic {
    border-radius: 50%;
    width: 30%;
    border: 1px solid #65B0FF;
    margin-top: 10px;
}

.btn-bg {
    background-color: var(--color-secondary);
}
</style>