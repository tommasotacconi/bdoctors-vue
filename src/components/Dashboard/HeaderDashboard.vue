<script>
	import { store } from '../../../js/store.js';
	import axios from 'axios';

	export default {
		data() {
			return {
				isLogoutShown: false
			}
		},
		methods: {
			toggleSidebar() {
				store.sidebar = !store.sidebar
			},
			showLogout() {
				this.isLogoutShown = !this.isLogoutShown;

				// Se l'utente non interagisce farlo scomparire
				if (this.isLogoutShown === true) {
					setTimeout(() => {
						this.isLogoutShown = false
					}, 5000)
				}
			},
			logout() {
				axios.post('https://127.0.0.1:5174/api/logout', '',
					{
						withCredentials: true
					})
					.then(response => {
						this.$router.push({ path: '/' });
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	}
</script>

<template>
	<header class="header-element">
		<div class="menu-button">
			<button @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
		</div>
		<div class="user">
			<!-- Logout button -->
			<div class="logout" v-if="isLogoutShown" @click="logout()">
				<!-- <router-link style="text-decoration: none; color: inherit;" to="/" @click="logout()"> -->
				<span class="logout-text">Logout</span>
				<!-- </router-link> -->
			</div>
			<!-- User icon -->
			<i class="fa-solid fa-user" @click="showLogout"></i>
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

	button {
		background-color: transparent;
		color: white;
		border: 0;
		font-size: 2rem;
	}

	.user {
		display: flex;
		gap: 15px;
		align-items: center;
	}

	.fa-user {
		border-radius: 50%;
		border: 1px solid white;
		padding: 8px;
		background-color: white;
		color: var(--color-complementary);
		margin-right: 7px;
		height: 100%
	}

	.logout {
		padding: 10px 15px;
		background-color: var(--color-complementary);
		border-radius: 30px;
	}

	.logout-text {
		text-decoration: none;
		color: white;
		font-weight: bold;
	}
</style>