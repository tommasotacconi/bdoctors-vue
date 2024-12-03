<script>
import { store } from '../../../../js/store.js'

export default {
    data() {
        return {
            store
        }
    }
}
</script>

<template>
    <div>{{ store.messagePage }}</div>
</template>

<style scoped></style>