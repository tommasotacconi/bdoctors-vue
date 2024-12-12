<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="background">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
@use "./styles/general.scss" as *
</style>
