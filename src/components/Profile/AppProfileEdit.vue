<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <div class="container py-3">
        <h1 class="text-center">Modifica le tue informazioni</h1>

        <form action="GET" @submit.prevent>

            <div class="mb-3 col-3">
                <label for="firstname" class="form-label">Nome</label>
                <input type="text" class="form-control" id="firstname">
            </div>
            <div class="mb-3 col-3">
                <label for="lastname" class="form-label">Cognome</label>
                <input type="text" class="form-control" id="lastname">
            </div>
            <div class="mb-3 col-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password">
            </div>
            <div class="mb-3">
                <label for="phone-num" class="form-label">Telefono</label>
                <input type="tel" class="form-control" id="phone-num">
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" id="address">
            </div>
            <div class="mb-3">
                <label for="specialization" class="form-label">Specializzazioni</label>
                <select class="form-select" aria-label="Default select example" id="specialization">
                    <option selected>Seleziona la/e tua/e specializzazione/i</option>
                    <option value="1">Chirurgia</option>
                    <option value="2">Cardiologia</option>
                    <option value="3">Oculistica</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="services" class="form-label">Prestazioni</label>
                <textarea class="form-control" id="services"></textarea>
            </div>
            <div class="mb-3">
                <label for="photo" class="form-label">Foto profilo</label>
                <input type="url" class="form-control" id="photo" placeholder="Inserisci un URL valido">
            </div>
            <div class="mb-3">
                <label for="curriculum" class="form-label">Curriculum Vitae</label>
                <input type="url" class="form-control" id="curriculum" placeholder="Inserisci un URL valido">
            </div>


            <button type="submit" class="btn btn-primary me-2">Modifica</button>
            <button type="reset" class="btn btn-dark">Reset</button>
        </form>
    </div>
</template>

<style scoped></style>
