<script>
	export default {
		data() {
			return {}
		},
		props: {
			type: {
				type: String,
				default: 'info'
			},
			show: {
				type: Boolean,
			}
		},
		inject: ['removeFirstAlert']
	}
</script>

<template>
	<Transition @after-leave="removeFirstAlert" appear>
		<div v-show="show" class="alert position-fixed" :class="`alert-${type}`">
			<div class="alerty-body d-flex justify-content-between">
				<slot></slot>
			</div>
		</div>
	</Transition>
</template>

<style lang="scss" scoped>
	@use '../../styles/utilities' as *;

	.alert {
		width: calc(100% - 35px * 2 - 60px - 20px);
		max-width: 600px;
		right: 35px;

		transition: top .3s;
	}

	// Sliding + fade animations
	/*
		Enter and leave animations can use different
		durations and timing functions.
	*/
	.v-enter-active {
		transition: all 0.8s ease-out;
	}

	.v-leave-active {
		transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.v-enter-from,
	.v-leave-to {
		transform: translateX(30px);
		opacity: 0;
	}
</style>