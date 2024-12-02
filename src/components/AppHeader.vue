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
        <div class="container container-header">
            <section class="left-header">
                <div class="logo">
                    <div class="square-general square1"></div>
                    <div class="square-general square2"></div>
                    <div class="square-general square3"></div>
                    <div class="square-general square4"></div>
                </div>
                <div class="title">
                    <h1>bdoctors</h1>
                </div>
            </section>
            <navbar class="right-header">
                <div class="login-logup">
                    <button class="button-login-logup"><i class="fa-regular fa-user"></i>Get Started or log-in</button>
                </div>
            </navbar>
        </div>
    </header>
</template>

<style scoped>
/* General */
.general-header {
    background-color: #0E395D;
    height: 70px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
}

.container-header {
    height: 100%;
    display: flex;
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
    display: flex;
    align-items: center;
    gap: 20px;
    height: 100%;
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
    display: flex;
    align-items: center;
}

.button-login-logup {
    background-color: #FFB465;
    border-radius: 25px;
    padding: 8px 16px;
    border: 0;
    font-style: italic;
    color: white;
    font-weight: bold;
}
</style>