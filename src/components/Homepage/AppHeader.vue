<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import { RouterLink } from 'vue-router';

	export default {
		data() {
			return {
				logout: false,
				apiUrl: 'http://127.0.0.1:8000/api/specializations',
				specializations: [],
				selectedSpecialization: null,
				store
			}
		},
		methods: {
			showLogout() {
				this.logout = !this.logout;

				// Se l'utente non interagisce farlo scomparire
				if (this.logout === true) {
					setTimeout(() => {
						this.logout = false
					}, 5000)
				}
			},
			getApi() {
				axios.get(this.apiUrl)
					.then(response => {
						// handle success
						console.log(response.data.specializations);
						this.specializations = response.data.specializations;
					})
					.catch(function (error) {
						// handle error
						console.log(error);
					})
			},
			chooseSpecialization() {
				console.log("Specializzazione selezionata:", this.selectedSpecialization);
				let searchedSpecialization = this.selectedSpecialization
				store.searchedSpecialization = searchedSpecialization
				this.$router.push({ name: 'search', params: { id: this.selectedSpecialization } })
			}
		},
		mounted() {
			this.getApi()
		},
		props: {

		}
	}
</script>

<template>
	<header class="general-header">
		<div class="container container-header d-flex gap-3">
			<section class="left-header d-flex">
				<routerLink style="text-decoration: none; color: inherit;" :to="{ name: 'homepage' }">
					<div class="left-header-title-logo d-flex">
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
				</routerLink>
				<div class="search-bar">
					<!-- Old search-bar -->
					<!-- <div class="input-group search-form">
                        <input type="text" class="form-control" placeholder="Ricerca il tuo medico!"
                            aria-label="Ricerca il tuo medico!" aria-describedby="button-addon2">
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2"><i
                                class="fa-solid fa-magnifying-glass"></i></button>
                    </div> -->

					<!-- Updated search bar for specializations -->
					<Transition>
						<select @change="chooseSpecialization()" class="form-select" aria-label="Specialization Search"
							v-model="selectedSpecialization" v-if="specializations.toString()">
							<option disabled value="">Ricerca il medico per specializzazione!</option>
							<option v-for="(specialization, index) in specializations" :key="index" :value=specialization>
								{{ specialization.name }}
							</option>
						</select>
					</Transition>
				</div>
			</section>
			<div class="right-header d-flex" v-if="!$route.params.id">
				<routerLink :to="{ name: 'register' }"><button class="button-logup"> Registrati</button></routerLink>
				<routerLink :to="{ name: 'login' }"><button class="button-login"><i
							class="fa-solid fa-user-doctor"></i>Login</button></routerLink>
			</div>
			<div class="right-header d-flex" v-if="$route.params.id">
				<div class="user">
					<div class="logout" v-if="logout">
						<router-link style="text-decoration: none; color: inherit;" to="/"><span
								class="logout-text">Logout</span></router-link>
					</div>
					<i class="fa-solid fa-user" @click="showLogout"></i>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped>

	/* General */
	.general-header {
		background-color: #0E395D;
		height: 80px;
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 25px;
	}

	.container-header {
		height: 100%;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		color: white;
		text-transform: uppercase;
		margin: 0;
		padding-right: 25px;
		border-right: 4px solid white;
	}


	/* Left Header */
	.left-header {
		align-items: center;
		gap: 30px;
		height: 100%;
	}

	.left-header-title-logo {
		align-items: center;
		gap: 20px;
		height: 100%;
	}

	/* 	.search-form .form-control {
		border: 0;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
	}

	.search-form .btn {
		background-color: white;
		border-top-right-radius: 25px;
		border-bottom-right-radius: 25px;
		border: 0;
		padding-right: 15px;
	}
 */

	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-from {
		opacity: 0;
	}


	/* Logo */
	.logo {
		width: 40px;
		height: 40px;
		display: flex;
		flex-wrap: wrap;
	}

	.square-general {
		height: 20px;
		width: 20px;
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


	/* Right header */
	.right-header {
		height: 100%;
		align-items: center;
		gap: 20px;
	}

	.right-header .button-logup {
		background-color: var(--color-secondary);
		border-radius: 25px;
		padding: 11px 16px;
		border: 0;
		font-style: italic;
		color: white;
		font-weight: bold;
	}

	.button-login {
		background-color: #FFB465;
		border-radius: 25px;
		padding: 8px 16px;
		border: 0;
		font-style: italic;
		color: white;
		font-weight: bold;
	}

	.fa-user-doctor {
		border-radius: 50%;
		border: 1px solid white;
		padding: 6px;
		background-color: white;
		color: #65B0FF;
		margin-right: 7px;
	}


	/* User logout */
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


	/* Responsive */
	@media screen and (max-width: 1230px) {
		.title {
			display: none;
		}

		.button-login {
			padding: 11px 16px;
		}

		.fa-user-doctor {
			display: none;
		}
	}
</style>