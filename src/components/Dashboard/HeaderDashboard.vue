<script>
	import { store } from '../../../js/store.js';
	import axios from 'axios';

	export default {
		data() {
			return {
				isLogoutShown: false,
				store
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
		},
		computed: {
			profilePhotoPath() {
				// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo profiles table
				const photoPath = this.store.profileDataGeneral.photo;
				return photoPath?.includes('photos') ? this.getFilePath(`storage/${this.store.profileDataGeneral.photo}`) : photoPath ?? new URL(this.store.placeholderImg).href;
			},
		}
	}
</script>

<template>
	<header class="header-element">
		<div class="left-header-section">
			<button class="menu-button" @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
		</div>
		<div class="right-header-section user">
			<!-- Logout button -->
			<button class="button logout-btn" v-show="isLogoutShown" @click="logout">
				<!-- <router-link style="text-decoration: none; color: inherit;" to="/" @click="logout()"> -->
				<span class="btn-text">Logout</span>
				<!-- </router-link> -->
			</button>
			<!-- User icon -->
			<i class="button fa-solid fa-user" :class="{ ['user-img']: store.isAuthenticated }" @click="showLogout">
				<img :src="profilePhotoPath" alt="">
			</i>
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

	.right-header-section {
		height: 45px;
		line-height: 45px;
	}

	.fa-user {
		border-radius: 50%;
		background-color: white;
		padding: 9px;
		color: var(--color-complementary);
		margin-right: 7px;

		&::before {
			margin: 0 calc((16px - 14px) / 2);
		}

		img {
			display: none;
		}
	}

	.fa-user.user-img {
		padding: 7px;

		img {
			height: 20px;
			display: inline;
			vertical-align: middle;
			aspect-ratio: 1;
			border-radius: 50%;
			object-fit: cover;
		}
	}

	.user-img::before {
		content: none;
	}

	.logout-btn {
		padding: 10px 14px;
		margin-right: 15px;
		background-color: var(--color-complementary);
		border: none;
		border-radius: 30px;
		line-height: 25px;
	}

	.logout-btn .btn-text {
		text-decoration: none;
		color: white;
		font-weight: bold;
	}
</style>