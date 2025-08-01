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
		<div class="card-header">
			<slot name="card-header"></slot>
		</div>
		<div class="card-body d-flex justify-content-between">
			<slot></slot>
		</div>
	</div>
</template>

<style>
	.card.pop-up-card {
		min-height: 80vh;
		margin-top: 50px;
		border-radius: 40px;
		border: 3px solid #65B0FF;
		text-align: center;
		width: 100%;
		position: relative;

		div.card-header {
			border-radius: 40px 40px 0 0;
			background-color: #D8F9FF;
			display: flex;
			flex-wrap: wrap;

			button.btn-close {
				position: absolute;
				--distance: 20px;
				top: var(--distance);
				right: var(--distance);
			}
		}

		div.card-body {
			border-top: 2px solid var(--color-complementary);
			padding: 16px 50px;
		}

		/* Not found doctor */
		&.not-found {
			min-height: 50vh;
			width: 700px;

			text-align: left;

			.card-header {
				height: 10vh;
				padding-top: 20px;
			}
		}
	}

</style>