<script>
	import { dashboardStore } from '../../../js/dashboardStore.js'

	export default {
		data() {
			return {
				dashboardStore,
			}
		},
		methods: {},
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
			<h2 :class="dashboardStore.currentComponentIndex === index ? 'selected-text' : null"
				@click="dashboardStore.currentComponentIndex = index"
				v-for="(label, index) in dashboardStore.labelsForComponents">{{ label }}
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
		font-size: 1.25rem;
		margin: 10px 0 0 0;
		padding: 12px 10px 12px 20px;
	}

	.selected-text {
		background-color: var(--color-secondary);
	}

	h2:hover {
		cursor: pointer;
		border: solid lightgray;
		padding: 10px 10px 10px 20px;
		border-width: 2px 0;
		background-color: #0E125D;
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
		width: 30px;
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


	/* Responsive */
	@media only screen and (max-width: 1024px) {
		.title {
			display: none;
		}
	}
</style>