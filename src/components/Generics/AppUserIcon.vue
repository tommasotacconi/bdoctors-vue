<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import { dashboardStore } from '../../../js/dashboardStore.js';
	import { getProfilePhotoPath } from '../../../js/utils/routing.js';


	export default {
		data() {
			return {
				store,
				dashboardStore,
				profilePhotoPath: '',
			}
		},
		methods: {
			getProfilePhoto() {
				axios.get(this.store.apiUri + 'profiles/authenticated', {
					withCredentials: true,
				})
					.then(({ data: { profile } }) => {
						this.dashboardStore.profileDataGeneral = profile;
						this.profilePhotoPath = profile.photo;
						this.dashboardStore.isProfileRequestPending = false;
					})
					.catch(err => {
						this.$emit('userIconReady');
					})
				this.dashboardStore.isProfileRequestPending = true;
			},
			setProfilePhotoPath() {
				if (!this.store.isAuthenticated || this.dashboardStore.isProfileRequestPending) {
					this.profilePhotoPath = '';
					return;
				}
				// Calculate profile photo :src attribute depending on the presence of the 'photos'
				// string in the profiles table's column photo
				const photoPath = this.dashboardStore.profileDataGeneral?.photo ?? this.profilePhotoPath;
				// console.log('Photo path: ' + photoPath, '--- Parent: ' + this.parent);
				if (photoPath === '') this.getProfilePhoto();
				else if ((this.parent === 'AppHeader' || this.parent === 'HeaderDashboard') && photoPath === null) this.$emit('userIconReady');
				else {
					this.profilePhotoPath = getProfilePhotoPath('', photoPath, this.store.apiUri.slice(0, -4));
					this.$emit('userIconReady');
				}
			},
		},
		props: {
			parent: {
				type: [Object, String],
				required: false
			}
		},
		watch: {
			'dashboardStore.profileDataGeneral'(newValue) {
				if (newValue) {
					if (newValue.photo) this.setProfilePhotoPath();
					else this.$emit('userIconReady');
				}
			}
		},
		mounted() {
			// console.log('Mounted AppUserIcon');
			if (!this.profilePhotoPath) this.setProfilePhotoPath();
		}
	}
</script>

<template>
	<i class="button fa-solid fa-user" :class="{ ['user-profile-photo']: profilePhotoPath }">
		<img :src="profilePhotoPath" alt="foto profilo">
	</i>

</template>

<style scoped>
	.fa-user {
		border-radius: 50%;
		background-color: white;
		padding: 9px;
		color: var(--color-complementary);

		&::before {
			margin: 0 calc((16px - 14px) / 2);
		}

		img {
			display: none;
		}
	}

	.fa-user.user-profile-photo {
		padding: 2px;

		img {
			height: 30px;
			display: inline;
			vertical-align: middle;
			aspect-ratio: 1;
			border-radius: 50%;
			object-fit: cover;
		}
	}

	.user-profile-photo::before {
		content: none;
	}

</style>