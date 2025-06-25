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
				axios.get(this.store.apiUri + 'profiles/show', {
					withCredentials: true,
				})
					.then(({ data: { data: { photo } } }) => {
						this.profilePhotoPath = photo;
						this.$emit('userIconReady');
					})
				// .catch(err => {
				// 	console.log('ERROR IN GET /api/profiles: ' + err.response.data.message);
				// 	this.loaded = true;
				// });
			},
			setProfilePhotoPath() {
				// console.log('Evaluating whether to compute profilePhotoPath');
				if (!this.store.isAuthenticated) {
					this.profilePhotoPath = '';
					return;
				}
				// console.log('Computing <profilePhotPath>');
				// Calculate profile photo :src attribute depending on the presence of the 'photos'
				// string in the db data photo profiles table
				const photoPath = this.dashboardStore.profileDataGeneral.photo ?? this.profilePhotoPath;
				if (!photoPath) {
					this.getProfilePhoto();
				} else {
					this.$emit('userIconReady');
					this.profilePhotoPath = this.getProfilePhotoPath(this.store.placeholderImg, photoPath);
				}
			}
		},
		watch: {
			'store.isAuthenticated'() {
				this.setProfilePhotoPath();
			}
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
		mounted() {
			this.setProfilePhotoPath();
		}
	}
</script>

<template>
	<i class="button fa-solid fa-user" :class="{ ['user-img']: profilePhotoPath }">
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

	.fa-user.user-img {
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

	.user-img::before {
		content: none;
	}

</style>