<script>

	export default {
		data() {
			return {
			}
		}
	}
</script>

<template>
	<RouterView class="app-header" name="header" />
	<div class="bg">
		<RouterView />
	</div>
</template>

<style scoped>
	.app-header {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.bg {
		background-image: url(../../public/tile_background.png);
	}
</style>