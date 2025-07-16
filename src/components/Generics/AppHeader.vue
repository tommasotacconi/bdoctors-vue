<script>
	import axios from 'axios';
	import { store } from '../../../js/store.js';
	import { dashboardStore } from '../../../js/dashboardStore.js';
	import { RouterLink } from 'vue-router';
	import AppUserIcon from '../Generics/AppUserIcon.vue';
	import { useShowButtonsAnimation } from '../../../js/composables/useShowButtonsAnimation';

	export default {
		data() {
			return {
				specializations: [],
				selectedSpecialization: '',
				store,
				dashboardStore,
				checkingLogin: true,
				// isProfileManagementShown: false,
				isUserIconReady: false,
				// logoutBtnTimeout: undefined,
			}
		},
		methods: {
			// showProfileManagementButtons() {
			// 	// Discard timeout if is already set, otherwise set a new one
			// 	if (this.logoutBtnTimeout) {
			// 		this.logoutBtnTimeout = clearTimeout(this.logoutBtnTimeout);
			// 	} else {
			// 		// Se l'utente non interagisce farlo scomparire
			// 		this.logoutBtnTimeout = setTimeout(() => {
			// 			this.isProfileManagementShown = false
			// 			this.logoutBtnTimeout = clearTimeout(this.logoutBtnTimeout);
			// 		}, 5000)
			// 	}

			// 	this.isProfileManagementShown = !this.isProfileManagementShown;
			// },
			getSpecializations() {
				axios.get(this.store.apiUri + 'specializations')
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
					name: 'specializationDoctors', params: {
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
						this.checkingLogin = false;
						this.store.isAuthenticated = false;
						this.dashboardStore.profileDataGeneral = {};
					})
					.catch(err => {
						this.checkingLogin = false;
						console.log(err);
					});

				this.checkingLogin = true;
				// Handle style for buttons' transition since the transitionend event never occur due to the 'display: none' set on the containing block after call to logout()
				this.areProfileButtonsShown = false;
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
				return this.store.isAuthenticated ? {
					'logged-user': true,
					'not-logged-user': false,
				} : {
					'logged-user': false,
					'not-logged-user': true,
				};
			},
			showLoader() {
				if (this.checkingLogin) {
					return true;
				}
				else {
					if (this.store.isAuthenticated) {
						return !this.isUserIconReady;
					}
					return false;
				}
			}
		},
		components: {
			AppUserIcon
		},
		setup() {
			const { buttonsStyle: profileButtonsStyle, areButtonsShown: areProfileButtonsShown, showButtonsTimeout: showProfileButtonsTimeout, showButtons: showProfileButtons, removeButtonsFromFlow: removeProfileButtonsFromFlow } = useShowButtonsAnimation();

			return { profileButtonsStyle, areProfileButtonsShown, showProfileButtonsTimeout, showProfileButtons, removeProfileButtonsFromFlow };
		},
		created() {
			axios.get(this.store.apiUri + 'login/check', {
				withCredentials: true,
			})
				.then(({ data: { authentication: { userId } } }) => {
					this.store.isAuthenticated = true;
					this.checkingLogin = false;
					// this.store.userId = userId;
				})
				.catch(err => {
					this.checkingLogin = false;
				});

			this.getSpecializations();
		},
		deactivated() {
			// Handle style for buttons' transition since the transitionend event never occur when broswing to another page
			this.areProfileButtonsShown = false;
			this.showProfileButtonsTimeout = clearTimeout(this.showProfileButtonsTimeout);
		}
	}
</script>

<template>
	<header class="general-header">
		<div class="container container-header d-flex gap-3">
			<div class="left-header d-flex">
				<!-- Logo section -->
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
				<!-- Searchbar section -->
				<div class="search-bar">
					<Transition>
						<select @change="chooseSpecialization()" v-model="selectedSpecialization" v-if="specializations.toString()"
							class="form-select" aria-label="Specialization Search">
							<option value="" disabled>Ricerca il medico per specializzazione!</option>
							<option v-for="(specialization, index) in specializations" :key="index" :value=specialization>
								{{ specialization.name }}
							</option>
						</select>
					</Transition>
				</div>
			</div>
			<div class="right-header" :class="rightHeaderClass" v-show="!showLoader">
				<!-- Buttons when isAuthenticated = false -->
				<routerLink :to="{ name: 'register' }">
					<button class="btn button-logup">Registrati</button>
				</routerLink>
				<routerLink :to="{ name: 'login' }">
					<button class="btn button-with-icon"><i class="fa-solid fa-user-doctor"></i></button>
				</routerLink>
				<!-- Buttons when isAuthenticated = true -->
				<div class="user">
					<div class="user-buttons-wrapper" :style="profileButtonsStyle" v-show="areProfileButtonsShown"
						@transitionend="removeProfileButtonsFromFlow">
						<router-link :to="{ name: 'dashboard' }" class="btn button-with-icon personal-area">
							<!-- <span class="personal-area-link">Area Personale</span> -->
							<i class="fa-solid fa-user-doctor"></i>
						</router-link>
						<button class="logout" @click="logout()">
							<span class="logout-text">Esci</span>
						</button>
					</div>
					<AppUserIcon :parent="'AppHeader'" @click="showProfileButtons" @user-icon-ready="isUserIconReady = true" />
				</div>
			</div>
			<div class=" loader-container right-header" v-show="showLoader">
				<Loader id="loader" />
			</div>
		</div>
	</header>
</template>

<style scoped>

	/* General */
	.general-header {
		background-color: #0E395D;
		height: var(--header-h);
		border-bottom-left-radius: var(--header-border-r);
		border-bottom-right-radius: var(--header-border-r);
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

		display: flex;
		align-items: center;
		gap: 20px;
	}

	.user-buttons-wrapper {
		width: max-content;
		margin-right: 10px;
	}

	.right-header .btn {
		border-radius: 25px;
		padding: 10px 16px;
		border: 0;
		font-style: italic;
		color: white;
		font-weight: bold;

		span {
			margin-right: 5px;
			display: none;
		}
	}

	.right-header .btn.button-logup {
		background-color: var(--color-secondary);
	}

	.right-header .btn.button-with-icon {
		background-color: var(--color-complementary);
		/* Padding calc is given by
		(((factor * font-size) + 2 * y-pd) - content-height) / 2 */
		padding: calc((((1.5 * 16px) + 2 * 10px) - 33.33px) / 2) 16px;

		&::after {
			content: 'Area Personale';
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
		.v-enter-active {
			transition: all 0.3s ease-out;
		}

		.v-leave-active {
			transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
		}

		.v-enter-from,
		.v-leave-to {
			transform: translateX(20px);
			opacity: 0;
		}
	}

	/* Loader sizing */
	.right-header .loader {
		width: 34px;
		position: static;
	}

	.fa-user-doctor {
		height: 100%;
		padding: 8px;
		border-radius: 50%;
		border: 1px solid white;
		background-color: white;
		color: var(--color-complementary);
		/* color: #65B0FF; */
		margin-right: 7px;
	}


	/* User logout */
	.user {
		display: flex;
		align-items: center;
	}

	.logout {
		margin-left: 10px;
		margin-right: 15px;
	}

	.logout-text {
		/* font-style: italic; */
		text-decoration: none;
		color: white;
		font-weight: bold;
	}

	#loader {
		margin-right: calc(34px / 2);
		translate: 50% 0;
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
		.right-header .btn.button-with-icon {
			&::after {
				content: '';
			}
		}

		.fa-user-doctor {
			margin-right: 0px;
		}
	}

	@media screen and (min-width: 768px) {
		.right-header .btn span {
			display: unset;
		}
	}
</style>