<script>
	import AppHeader from '../components/Homepage/AppHeader.vue';


	export default {
		data() {
			return {
			}
		},
		components: {
			AppHeader
		}
	}
</script>

<template>
	<AppHeader class="app-header" />
	<!-- <RouterView class="app-header" name="header" v-slot="{ Component }">
		<KeepAlive>
			<component :is="Component"></component>
		</KeepAlive>
	</RouterView> -->
	<div class="page-content bg">
		<RouterView v-slot="{ Component }">
			<KeepAlive include="HomeMain,DashboardPage,AppRegister">
				<component :is="Component"></component>
			</KeepAlive>
		</RouterView>
	</div>
</template>

<style scoped>
	.app-header {
		padding: 15px 5px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.6);
	}

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