<script>
	export default {
		data() {
			return {
			}
		},
	}
</script>

<template>
	<div class="page-content bg">
		<RouterView />
	</div>
</template>

<style scoped>
	.page-content {
		height: 100vh;

		&> :not(.loader):nth-of-type(1) {
			padding-top: var(--header-border-r);
		}
	}


	.app-header~.page-content {
		padding-top: calc(var(--header-h) - var(--header-border-r));
	}

	.bg {
		background-image: url(../../public/tile_background.png);
	}
</style>