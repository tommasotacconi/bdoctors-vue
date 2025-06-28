<script>
	import { useRippleEffect } from '../../../js/composables/useRippleEffect.js';
	import { dashboardStore } from '../../../js/dashboardStore.js'

	export default {
		data() {
			return {
				rippleStyles: [], // Array to store ripple styles for each button
				isAnimating: [], // Array to track animation state for each button
				dashboardStore,
			}
		},
		methods: {
			handleButtonClick(index, event) {
				const buttonRef = this.$refs.buttonRefs[index]; // Get the button reference

				if (!buttonRef) return;

				// Trigger the ripple effect for the specific button
				const { rippleStyle, isAnimating, triggerRipple } = useRippleEffect();
				triggerRipple(event, buttonRef);

				// Update the ripple styles and animation state for the button
				this.rippleStyles[index] = { ...rippleStyle.value };
				this.isAnimating[index] = isAnimating.value;

				// Reset animation state after it completes
				setTimeout(() => {
					this.isAnimating[index] = false;
				}, 1000);
			},
		},
		computed: {}
	}
</script>

<template>
	<nav>
		<RouterLink :to="{ name: 'homepage' }">
			<div class="title-logo d-flex">
				<div class="logo">
					<div class="square-general square1"></div>
					<div class="square-general square2"></div>
					<div class="square-general square3"></div>
					<div class="square-general square4"></div>
				</div>
				<div class="title">
					<h1>bdoctors</h1>
				</div>
			</div>
		</RouterLink>
		<section class="link-pages">
			<h2 ref="buttonRefs" :key="index" class="ripple-button"
				:class="dashboardStore.currentPageIndex === index ? { 'selected-text': !isAnimating[index] } : null"
				@click="(e) => { dashboardStore.currentPageIndex = index; handleButtonClick(index, e) }"
				v-for="(label, index) in dashboardStore.labelsForComponents">
				<span class="ripple" v-if="isAnimating[index]" :style="rippleStyles[index]"></span>
				{{ label }}
			</h2>
		</section>
	</nav>
</template>

<style scoped>

	/* General */
	nav {
		height: 100%;
		background-color: var(--color-primary);
		border-right: 2px solid lightgray;
		color: white;
	}

	a {
		text-decoration: none;
	}

	.link-pages {
		margin-top: 20px;
	}

	h2 {
		padding: 10px 10px 10px 20px;
		margin: 10px 0 0 0;
		border: solid var(--color-primary);
		border-width: 2px 0;
		position: relative;
		z-index: 1;

		font-size: 1.3rem;
	}

	h2:hover {
		cursor: pointer;
		/* border: solid lightgray;
		background-color: var(--color-secondary); */
	}

	h2.selected-text {
		background-color: var(--color-secondary);
	}

	/* Logo */
	h1 {
		color: white;
		text-transform: uppercase;
		margin: 0;
		font-size: 2rem;
	}

	.title-logo {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
		height: 10%;
	}

	.logo {
		flex: 0 0 30px;
		height: 30px;
		display: flex;
		flex-wrap: wrap;
	}

	.square-general {
		height: 15px;
		width: 15px;
	}

	.square1 {
		background-color: #65B0FF;
	}

	.square2 {
		background-color: white;
	}

	.square3 {
		background-color: white;
	}

	.square4 {
		background-color: #155489;
	}

	.ripple-button {
		position: relative;
		overflow: hidden;
	}

	.ripple-button .ripple {
		position: absolute;
		/* span.ripple is brought under h2 text, so that it acts as background for it */
		z-index: -1;
		border-radius: 50%;
		color: white;
		/* Slightly darker color */
		background-image: radial-gradient(circle closest-side, var(--color-secondary), var(--color-secondary));
		transform: scale(0.1);
		animation: ripple-animation 1s ease forwards;
	}

	@keyframes ripple-animation {
		to {
			/* Expand circle */
			transform: scale(2);
		}
	}


	/* Responsive */
	@media only screen and (max-width: 1024px) {
		.title {
			display: none;
		}
	}
</style>