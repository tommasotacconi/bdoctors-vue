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
            <div class="left-header">
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
            <div class="right-header">
                <div class="log-in">

                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* General */
.general-header {
    background-color: #0E395D;
    height: 70px;
}

.container-header {
    height: 100%;
}

h1 {
    color: white;
    text-transform: uppercase;
    margin: 0;
    padding-right: 20px;
    border-right: 4px solid #28231D;
}


/* Left Header */
.left-header {
    display: flex;
    align-items: center;
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
}
</style>