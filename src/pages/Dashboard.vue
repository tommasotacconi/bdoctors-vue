<script>
	import HeaderDashboard from '../components/Dashboard/HeaderDashboard.vue';
	import MainDashboard from '../components/Dashboard/MainDashboard.vue';
	import SidebarDashboard from '../components/Dashboard/SidebarDashboard.vue';
	import axios from 'axios';
	import { store } from '../../js/store.js';
	import { dashboardStore } from '../../js/dashboardStore.js';

	export default {
		data() {
			return {
				store,
				dashboardStore,
				windowWidth: window.innerWidth,
			};
		},
		methods: {
		},
		components: {
			SidebarDashboard,
			HeaderDashboard,
			MainDashboard,
		},
		mounted() {
			window.addEventListener('resize', this.updateWidth)
		},
		created: function () {
		},
		computed: {
			// meanVotePerMonthNumbers() {
			// 	return this.calcDataPerMonthArray(this.store.profileReviews, 'mean');
			// },
			chartDataStructure() {
				return {
					labels: [],
					datasets: [
						{ data: [], backgroundColor: '#65B0FF', /* qui si può inserire il label */ }
					]
				}
			},
		}
	}
</script>

<template>
	<div id="dashboard" class="general-structure">
		<Transition>
			<section class="sidebar" v-show="dashboardStore.sidebar">
				<SidebarDashboard />
			</section>
		</Transition>
		<section class="header-main">
			<div class="header">
				<HeaderDashboard />
			</div>
			<div class="main">
				<MainDashboard />
			</div>
		</section>
	</div>
</template>

<style scoped>
	#dashboard.general-structure {
		padding-top: 0;
		display: flex;
		height: 100%;
		overflow: hidden;
	}

	.sidebar {
		flex-shrink: 0;
		flex-basis: 280px;
		overflow: hidden;

		&.compressed {
			flex-basis: 200px;
		}
	}

	/* Sidebar's transition */
	.sidebar.v-enter-active,
	.sidebar.v-leave-active {
		transition: flex-basis 0.4s ease;
	}

	.sidebar.v-enter-from,
	.sidebar.v-leave-to {
		flex-basis: 0%;
	}

	.header-main {
		overflow: auto;
		flex: 1;

		display: flex;
		flex-direction: column;
	}

	.header-main-full {
		display: flex;
		flex-basis: 100%;
		flex-direction: column;
	}

	.header {
		flex: 0 0 var(--header-h);
	}

	.main {
		padding: 30px 20px 0;
		flex: 1;

		position: relative;
		overflow-y: auto;
	}

	/* Media queries */
	@media only screen and (max-width: 1024px) {
		.sidebar {
			flex-basis: 200px;
		}

	}

</style>