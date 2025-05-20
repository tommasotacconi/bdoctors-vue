<script>
import AppHeader from '../components/Homepage/AppHeader.vue';
import AppLogin from '../components/Login/AppLogin.vue';

export default {
	data() {
		return {

		}
	},
	components: {
		AppHeader,
		AppLogin,
	}
}
</script>

<template>
	<AppHeader />
	<AppLogin class="bg" />
</template>

<style lang="scss" scoped>
.bg {
	background-image: url(../../public/tile_background.png);
}
</style>