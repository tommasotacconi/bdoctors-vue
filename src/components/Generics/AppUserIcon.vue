<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import { dashboardStore } from '../../../js/dashboardStore.js';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';

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
				// console.log('Calling api for profilePhoto');
				axios.get(this.store.apiUri + 'profiles', {
					withCredentials: true,
				})
					.then(({ data: { data: { photo } } }) => {
						this.profilePhotoPath = photo;
						// this.$emit('userIconReady');
						this.setProfilePhotoPath();
					})
				// .catch(err => {
				// 	console.log('ERROR IN GET /api/profiles: ' + err.response.data.message);
				// 	this.loaded = true;
				// });
			},
			setProfilePhotoPath() {
				console.log('Evaluating whether to compute profilePhotoPath', '--- Parent:', this.parent);
				if (!this.store.isAuthenticated || this.dashboardStore.isProfileRequestPending) {
					this.profilePhotoPath = '';
					return;
				}
				// console.log('Computing <profilePhotPath>', '--- Parent: ', this.parent);
				// Calculate profile photo :src attribute depending on the presence of the 'photos'
				// string in the profiles table's column photo
				const photoPath = this.dashboardStore.profileDataGeneral.photo ?? this.profilePhotoPath;
				// console.log('Photo path: ' + photoPath, '--- Parent: ' + this.parent);
				if (!photoPath) {
					this.getProfilePhoto();
				} else {
					this.profilePhotoPath = this.getProfilePhotoPath(this.store.placeholderImg, photoPath, this.store.apiUri.slice(0, -4));
					this.$emit('userIconReady');
				}
			}
		},
		props: {
			parent: {
				type: [Object, String],
				required: false
			}
		},
		watch: {
			'store.isAuthenticated'(newValue) {
				if (newValue) this.setProfilePhotoPath();
			},
			'dashboardStore.isProfileRequestPending'(newValue) {
				if (!newValue) this.setProfilePhotoPath();
			}
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
		mounted() {
			// console.log('Mounted AppUserIcon');
			this.setProfilePhotoPath();
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