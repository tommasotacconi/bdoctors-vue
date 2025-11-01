<script>
	export default {
		data() {
			return {

			}
		}
	}
</script>

<template>
	<div class="card pop-up-card mb-3">
		<div class="card-header d-flex flex-column align-items-center flex-md-row justify-content-center">
			<slot name="card-header"></slot>
		</div>
		<div class="card-body d-flex flex-column justify-content-between justify-content-lg-start flex-md-row">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss">
	.card.pop-up-card {
		min-height: 50vh;
		margin-top: 50px;
		border-radius: vars.$card-br-radius;
		border: 3px solid #65B0FF;
		text-align: center;
		width: 100%;
		position: relative;

		div.card-header {
			border-radius: 38px 38px 0 0;
			background-color: #D8F9FF;
		}

		div.card-body {
			border-top: 2px solid var(--color-complementary);
			padding: 16px 50px;
		}

		/* Not found doctor */
		&.not-found {
			min-height: 250px;
			width: 500px;

			text-align: left;

			.card-header {
				min-height: 50px;
				padding-top: 20px;
			}
		}
	}

</style>