<script>
	import { store } from '../../../js/store.js';
	import { dashboardStore } from '../../../js/dashboardStore.js';
	import axios from 'axios';
	import AppUserIcon from '../Generics/AppUserIcon.vue';
	import { useShowButtonsAnimation } from '../../../js/composables/useShowButtonsAnimation.js';
import { useAuthFunctions } from '../../../js/composables/useAuthFunctions.js';

	export default {
		data() {
			return {
				// isLogoutShown: false,
				isUserIconReady: false,
				store,
				dashboardStore
			}
		},
		methods: {
			toggleSidebar() {
				this.dashboardStore.sidebar = !this.dashboardStore.sidebar
			},
			// showLogout() {
			// 	this.isLogoutShown = !this.isLogoutShown;

			// 	// Se l'utente non interagisce farlo scomparire
			// 	if (this.isLogoutShown === true) {
			// 		setTimeout(() => {
			// 			this.isLogoutShown = false
			// 		}, 5000)
			// 	}
			// },
		},
		components: {
			AppUserIcon
		},
		computed: {
			showLoader() {
				if (this.isLoggingOut) return true;
				else if (this.store.isAuthenticated) return !this.isUserIconReady;
				else return false;
			}
		},
		setup() {
			const {
				buttonsStyle: profileButtonsStyle,
				areButtonsShown: areProfileButtonsShown,
				showButtonsTimeout: showProfileButtonsTimeout,
				showButtons: showProfileButtons,
				removeButtonsFromFlow: removeProfileButtonsFromFlow
			} = useShowButtonsAnimation();

			const { isLoggingOut, logout } = useAuthFunctions();

			return {
				profileButtonsStyle,
				areProfileButtonsShown,
				showProfileButtonsTimeout,
				showProfileButtons,
				removeProfileButtonsFromFlow,
				isLoggingOut,
				logout
			};
		},
	}
</script>

<template>
	<header class="header-element">
		<div class="left-header">
			<button class="menu-button" @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
		</div>
		<div class="right-header user" v-show="!showLoader">
			<!-- Logout button -->
			<button :style="profileButtonsStyle" v-show="areProfileButtonsShown" class="button logout-btn"
				@click="logout({
					inThenOperations: () => this.$router.push({ name: 'homepage' }),
					additionalOperations: () => {
						// Handle style for buttons' transition since the transitionend event never occur due to the 'display: none' set on
						// 	the containing block after call to logout()
						this.areProfileButtonsShown = false;
					}
				})" @transitionend="removeProfileButtonsFromFlow">
				<!-- <router-link style="text-decoration: none; color: inherit;" to="/" @click="logout()"> -->
				<span class="btn-text">Esci</span>
				<!-- </router-link> -->
			</button>
			<!-- User icon -->
			<AppUserIcon :parent="'HeaderDashboard'" @user-icon-ready="isUserIconReady = true" @click="showProfileButtons" />
		</div>
		<div class=" loader-container right-header" v-show="showLoader">
			<Loader id="loader" />
		</div>
	</header>
</template>

<style scoped>
	header {
		height: 100%;
		background-color: var(--color-primary);
		color: white;
		width: 100%;
	}

	.header-element {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30px;
	}

	button.menu-button {
		background-color: transparent;
		color: white;
		border: 0;
		font-size: 2rem;
	}

	/* .right-header {
		height: 45px;
		line-height: 45px;
	} */

	.logout-btn {
		margin-right: 15px;
		background-color: transparent;
		border: none;
		/* border-radius: 30px; */
		line-height: 25px;
	}

	.logout-btn .btn-text {
		text-decoration: none;
		color: white;
		font-weight: bold;
	}

	/* Loader sizing */
	.right-header .loader {
		width: 34px;
		position: static;
		translate: none;
	}


	/* .v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	} */
</style>