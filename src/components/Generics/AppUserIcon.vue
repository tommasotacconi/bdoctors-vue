<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';

	export default {
		data() {
			return {
				store,
				fetchedPhotoPath: ''
			}
		},
		methods: {
			getProfilePhoto() {
				axios.get(this.store.apiUri + 'profiles/show', {
					withCredentials: true,
				})
					.then(({ data: { data: { photo } } }) => {
						this.fetchedPhotoPath = photo;
						this.$emit('userIconReady');
					})
				// .catch(err => {
				// 	console.log('ERROR IN GET /api/profiles: ' + err.response.data.message);
				// 	this.loaded = true;
				// });
			}
		},
		computed: {
			profilePhotoPath() {
				// Calculate profile photo :src attribute depending on the presence of the 'photos'
				// string in the db data photo profiles table
				const photoPath = this.store.profileDataGeneral.photo ?? this.fetchedPhotoPath;
				if (!photoPath && this.store.isAuthenticated) {
					this.getProfilePhoto();
					return photoPath;
				} else if (photoPath && this.store.isAuthenticated) {
					this.$emit('userIconReady');
					return photoPath?.includes('photos') ?
						this.getFilePath(`storage/${this.store.profileDataGeneral.photo}`) :
						photoPath ?? new URL(this.store.placeholderImg).href;
				}
			},
		},
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath }
		},
		created() {
		}
	}
</script>

<template>
	<i class="button fa-solid fa-user" :class="{ ['user-img']: store.isAuthenticated }">
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