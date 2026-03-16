<script>
	import { useAppAlert } from '../../../js/composables/useAppAlert';
	import AppAlert from '../Generics/AppAlert.vue';

	export default {
		name: 'AppAlertSystem',
		data() {
			return {

			}
		},
		methods: {
			handleClick(alert) {
				if (alert.btn?.action) alert.btn.action(alert);
				alert.show = false;
			},
		},
		components: {
			AppAlert
		},
		setup() {
			const { alerts, triggerAlert, removeFirstAlert } = useAppAlert();

			return { alerts, triggerAlert, removeFirstAlert };
		},
		provide() {
			return {
				triggerAlert: this.triggerAlert,
				removeFirstAlert: this.removeFirstAlert,
			}
		}
	}
</script>

<template>
	<RouterView />
	<AppAlert :ref="'alert-' + ind" :key="ind" :show="alert.show" :type="alert.type" :class="alert.cls"
		v-for="(alert, ind) in alerts">
		<span class="flex-grow">
			{{ alert.msg }}
		</span>
		<button v-if="alert.btn" type="button" @click="handleClick(alert)" class="btn btn-sm d-block align-self-center"
			:class="{ 'btn-close': !alert.btn.txt }">
			<span v-if="alert.btn.txt">{{ alert.btn.txt }}</span>
		</button>

	</AppAlert>
</template>

<style lang="scss" scoped></style>