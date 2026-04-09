<script>
	import { useAppAlert } from '../../js/composables/useAppAlert';
	import { homepageStore } from '../../js/homepageStore';
	import AppAlert from '../components/Generics/AppAlert.vue';
	import AppHeader from '../components/Generics/AppHeader.vue';


	export default {
		data() {
			return {
				homepageStore
			}
		},
		components: {
			AppHeader,
			AppAlert
		},
		mounted() {
			const headerHeight = parseInt(getComputedStyle(this.$refs.header.$el).height.slice(0, -2))
			this.homepageStore.headerHeight = headerHeight;

		}
	}
</script>

<template>
	<AppHeader ref="header" class="header" />
	<div class="page-content bg">
		<RouterView v-slot="{ Component }">
			<KeepAlive include="AppRegister,AdvancedSearch">
				<component :is="Component" />
			</KeepAlive>
		</RouterView>
	</div>
</template>

<style scoped>
	.header {
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
		position: relative;

		&> :not(.loader, .alert):nth-of-type(1) {
			padding-top: var(--header-border-r);
		}
	}

	.header~.page-content {
		margin-top: calc(var(--header-h) - var(--header-border-r));
	}
</style>