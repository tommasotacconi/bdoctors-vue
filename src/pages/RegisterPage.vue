<script>
import AppHeader from '../components/Homepage/AppHeader.vue';
import AppRegister from '../components/Register/AppRegister.vue';

export default {
	data() {
		return {

		}
	},
	components: {
		AppHeader,
		AppRegister,
	}
}
</script>

<template>
	<AppHeader />
	<AppRegister class="bg" />
</template>

<style lang="scss" scoped>
.bg {
	background-image: url(../../public/tile_background.png);
}
</style>