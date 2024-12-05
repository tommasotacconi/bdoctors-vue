<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <header class="general-header">
        <div class="container container-header d-flex">
            <section class="left-header d-flex">
                <div class="left-header-title-logo d-flex">
                    <div class="logo">
                        <div class="square-general square1"></div>
                        <div class="square-general square2"></div>
                        <div class="square-general square3"></div>
                        <div class="square-general square4"></div>
                    </div>
                    <div class="title">
                        <h1>bdoctors</h1>
                    </div>
                </div>
                <div class="search-bar">
                    <div class="input-group search-form">
                        <input type="text" class="form-control" placeholder="Ricerca il tuo medico!"
                            aria-label="Ricerca il tuo medico!" aria-describedby="button-addon2">
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i
                                class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </section>
            <navbar class="right-header d-flex">
                <routerLink :to="{ name: 'register' }"><button class="button-logup"> Registrati</button></routerLink>
                <routerLink :to="{ name: 'login' }"><button class="button-login"><i
                            class="fa-solid fa-user-doctor"></i>Login</button></routerLink>
            </navbar>
        </div>
    </header>
</template>

<style scoped>
/* General */
.general-header {
    background-color: #0E395D;
    height: 80px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
}

.container-header {
    height: 100%;
    justify-content: space-between;
    align-items: center;
}

h1 {
    color: white;
    text-transform: uppercase;
    margin: 0;
    padding-right: 25px;
    border-right: 4px solid white;
}


/* Left Header */
.left-header {
    align-items: center;
    gap: 30px;
    height: 100%;
}

.left-header-title-logo {
    align-items: center;
    gap: 20px;
    height: 100%;
}

.search-form .form-control {
    border: 0;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
}

.search-form .btn {
    background-color: white;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    border: 0;
    padding-right: 15px;
}

/* Logo */
.logo {
    width: 40px;
    height: 40px;
    display: flex;
    flex-wrap: wrap;
}

.square-general {
    height: 20px;
    width: 20px;
}

.square1 {
    background-color: #65B0FF;
}

.square2 {
    background-color: white;
}

.square3 {
    background-color: white;
}

.square4 {
    background-color: #155489;
}


/* Right header */
.right-header {
    height: 100%;
    align-items: center;
    gap: 20px;
}

.right-header .button-logup {
    background-color: var(--color-secondary);
    border-radius: 25px;
    padding: 11px 16px;
    border: 0;
    font-style: italic;
    color: white;
    font-weight: bold;
}

.button-login {
    background-color: #FFB465;
    border-radius: 25px;
    padding: 8px 16px;
    border: 0;
    font-style: italic;
    color: white;
    font-weight: bold;
}

.fa-user-doctor {
    border-radius: 50%;
    border: 1px solid white;
    padding: 6px;
    background-color: white;
    color: #65B0FF;
    margin-right: 7px;
}
</style>