<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import { RouterLink } from 'vue-router';

	export default {
		data() {
			return {
				apiUrl: 'http://127.0.0.1:8000/api/specializations',
				specializations: [],
				selectedSpecialization: '',
				store,
				checkedLogin: false,
				isLogged: false,
				isLogoutShown: false,
				logoutBtnTimeout: undefined,
			}
		},
		methods: {
			showLogout() {
				// Discard timeout if is already set, otherwise set a new one
				if (this.logoutBtnTimeout) {
					this.logoutBtnTimeout = clearTimeout(this.logoutBtnTimeout);
				} else {
					// Se l'utente non interagisce farlo scomparire
					this.logoutBtnTimeout = setTimeout(() => {
						this.isLogoutShown = false
						this.logoutBtnTimeout = clearTimeout(this.logoutBtnTimeout);
					}, 5000)
				}

				this.isLogoutShown = !this.isLogoutShown;
			},
			getApi() {
				axios.get(this.apiUrl)
					.then(response => {
						// handle success
						this.specializations = response.data.specializations;
						if (!store.searchedSpecialization && this.$route.params.specialization) this.updateSelectByParam();
					})
					.catch(function (error) {
						// handle error
						console.log(error);
					})
			},
			chooseSpecialization() {
				store.searchedSpecialization = this.selectedSpecialization.id
				store.selectedSpecializationName = this.selectedSpecialization.name

				// Nuova pagina nella quale usiamo i nomi. Piccola concatenazione di metodi per togliere gli spazi e rendere tutto minuscolo
				this.$router.push({
					name: 'search', params: {
						specialization: store.selectedSpecializationName.trim().replace(/-/g, '_').replace(/ /g, "-").toLowerCase(),
					},
				})
			},
			updateSelectByParam() {
				console.log('-- Updating select by means of param')
				this.selectedSpecialization = this.specializationParam || '';
			},
			logout() {
				axios.post(store.apiUri + 'logout', '',
					{
						withCredentials: true
					})
					.then(response => {
						this.isLogged = false;
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		computed: {
			specializationParam() {
				const targets = [/_/g, /-/g];
				const replacements = ['-', ' '];
				let specializationInParamValue = this.$route.params.specialization;
				for (let i = 0; i < targets.length; i++) {
					specializationInParamValue = specializationInParamValue.replace(targets[i], replacements[i]);
				}
				specializationInParamValue = specializationInParamValue[0].toUpperCase() + specializationInParamValue.slice(1);
				for (let i = 0; i < this.specializations.length; i++) {
					const specialization = this.specializations[i];
					if (specializationInParamValue == specialization.name) {
						console.log(specialization);
						return specialization;
					}
				}
			},
			rightHeaderClass() {
				return this.isLogged ? {
					'logged-user': true,
					'not-logged-user': false,
				} : {
					'logged-user': false,
					'not-logged-user': true,
				};
			}
		},
		created() {
			axios.get(this.store.apiUri + 'login/check', {
				withCredentials: true,
			})
				.then(({ data: { authentication: { userId } } }) => {
					this.isLogged = true;
					this.checkedLogin = true;
					this.store.userId = userId;
				})
				.catch(err => {
					this.checkedLogin = true;
				});
		},
		mounted() {
			this.getApi()
		}
	}
</script>

<template>
	<header class="general-header">
		<div class="container container-header d-flex gap-3">
			<div class="left-header d-flex">
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
						<select @change="chooseSpecialization()" v-model="selectedSpecialization" v-if="specializations.toString()"
							class="form-select" aria-label="Specialization Search">
							<option value="" disabled>Ricerca il medico per specializzazione!</option>
							<option v-for="(specialization, index) in specializations" :key="index" :value=specialization>{{
								specialization.name
							}}
							</option>
						</select>
					</Transition>
				</div>
			</div>
			<div class="right-header d-flex" :class="rightHeaderClass" v-if="checkedLogin">
				<routerLink :to="{ name: 'register' }">
					<button class="btn button-logup">Registrati</button>
				</routerLink>
				<routerLink :to="{ name: 'login' }">
					<button class="btn button-login"><i class="fa-solid fa-user-doctor"></i></button>
				</routerLink>
				<div class="user">
					<Transition>
						<div class="user-buttons-wrapper d-flex justify-content-between" v-if="isLogoutShown">
							<router-link :to="{ name: 'dashboard', params: { id: store.userId } }" class="btn personal-area">Area
								personale</router-link>
							<button class="logout" @click="logout()">
								<span class="logout-text">Esci</span>
							</button>
						</div>
					</Transition>
					<i class="fa-solid fa-user fa-user-doctor" @click="showLogout"></i>
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

	button {
		padding: 0;
		border: none;
		background-color: transparent;
		color: var(--color-secondary);
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
	.v-leave-to {
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

	/* Left header */
	.form-select {
		max-width: 320px;

		option {
			width: 250px;
		}
	}

	/* Right header */
	.right-header {
		height: 100%;
		align-items: center;
		gap: 20px;
	}

	.user-buttons-wrapper {
		margin-right: 10px;
	}

	.right-header .btn {
		border-radius: 25px;
		padding: 10px 16px;
		border: 0;
		font-style: italic;
		color: white;
		font-weight: bold;
	}

	.right-header .btn.button-logup {
		background-color: var(--color-secondary);
	}

	.right-header .btn.button-login {
		background-color: var(--color-complementary);
		padding-top: 8px;
		padding-bottom: 8px;

		&::after {
			content: 'Login';
		}
	}

	.right-header .btn.personal-area {
		background-color: var(--color-complementary);
		flex-shrink: 0;
	}

	.right-header.not-logged-user {
		.user {
			display: none;
		}
	}

	.right-header.logged-user {
		&>:not(.user) {
			display: none;
		}
	}

	.right-header {

		/*	Transition credits: Vue official site (https://vuejs.org/guide/built-ins/transition)	*/
		.slide-fade-enter-active {
			transition: all 0.3s ease-out;
		}

		.slide-fade-leave-active {
			transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
		}

		.slide-fade-enter-from,
		.slide-fade-leave-to {
			transform: translateX(20px);
			opacity: 0;
		}
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
		margin-left: 10px;
	}

	.logout-text {
		font-style: italic;
		text-decoration: none;
		color: white;
		font-weight: bold;
	}


	/* Responsive */
	@media screen and (max-width: 1230px) {
		.title {
			display: none;
		}

		/* .fa-user-doctor {
			display: none;
		} */
	}

	@media screen and (max-width: 992px) {
		.right-header .btn.button-login {
			&::after {
				content: '';
			}
		}

		.fa-user-doctor {
			margin-right: 0px;
		}
	}
</style>