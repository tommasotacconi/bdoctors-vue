<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { store } from '../../../js/store.js';
import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';
import SponsoredCard from './SponsoredCard.vue';

export default {
	data() {
		return {
			store,
			chunkedSponsoredProfiles: [],
			requestedPage: 1,
			elementsPerPage: 20,
			totalSponsoredProfiles: null,
			requestedProfiles: 0,
			loadedImgsPerChunk: [],
			notLoadedImgsPerChunk: [],
			imgsPerChunk: [],
			// profilesId: [],
			// filteredProfile: [],
		}
	},
	methods: {
		getSponsoredProfiles(perPage = this.elementsPerPage, page = this.requestedPage) {
			axios.get(this.store.apiUri + 'sponsorships/sponsored', {
				params: {
					page,
					per_page: perPage
				}
			})
				.then(({ data: { paginated_profiles, paginated_profiles: { from, to } } }) => {
					const sponsored = paginated_profiles.data;
					this.chunkedSponsoredProfiles.push(sponsored);
					this.totalSponsoredProfiles = paginated_profiles.total;
					// Compute chunk
					this.imgsPerChunk.push(to - from + 1);

					this.$emit('loadedSponsoredProfiles');
				})
				.catch(function (err) {
					// console.log('error GET /api/sponsorships/sponsored: ', err);
				})

			// Update next requested page
			this.requestedPage += 1;
			// Manage request profiles until now
			this.requestedProfiles += perPage; 
		},
		goToShowPage(doctorUser, index) {
			let completeName = doctorUser.first_name + '-' + doctorUser.last_name;
			if (doctorUser.homonymous_id !== null) completeName += '-' + doctorUser.homonymous_id;
			this.$router.push({ name: 'search', params: { name: completeName } })
			// console.log('doctor position inside homepage ', index);
			// console.log(store.searchedSpecialization)
		},
		updateLoadedImgsPerChunk(chunkInd) {
			const imgsArr = this.loadedImgsPerChunk;
			
			return imgsArr[chunkInd] ? imgsArr[chunkInd] += 1 : imgsArr[chunkInd] = 1;
		},
		updateNotLoadedImgsPerChunk(chunkInd, imgInd) {
			const imgsArr = this.notLoadedImgsPerChunk;

			return imgsArr[chunkInd] ? imgsArr[chunkInd].push(imgInd) : imgsArr[chunkInd] = [imgInd];
		},
		checkOwnChunkIsLoaded(chunkInd) {
			return this.areLoadedImgsPerChunk[chunkInd];
		}
	},
	components: {
		SponsoredCard
	},
	setup() {
		const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

		return { getFilePath, getProfilePhotoPath };
	},
	mounted() {
		this.getSponsoredProfiles();
	},
	computed: {
		areLoadedImgsPerChunk() {
			let result = [];
			for (let i = 0; i < this.imgsPerChunk.length; i++) {
				const isLoadedChunk =  (this.loadedImgsPerChunk[i] ?? 0) + (this.notLoadedImgsPerChunk[i]?.length ?? 0) === this.imgsPerChunk[i];
				result.push(isLoadedChunk);
			}

			return result;
		},
		isLoadingChunk() {
			return this.areLoadedImgsPerChunk.some(isLoadedChunk => !isLoadedChunk);
		},
		chunkedSpProfLength() {
			return this.chunkedSponsoredProfiles.reduce((acc, currValue) => (acc instanceof Array ? acc.length : acc) + currValue.length, 0)
		}
	},
}
</script>

<template>
	<div class="container component-container">
		<h3>Dottori in evidenza</h3>
		<div class="sponsored-card-container bg-transparent">
			<template v-for="(isLoadedChunk, chunkInd) in areLoadedImgsPerChunk">
				<SponsoredCard v-if="!isLoadedChunk" v-for="profiles in imgsPerChunk[chunkInd]" :simulatedSpecs="[0, 1]"/>
				<SponsoredCard v-for="({ photo, user }, index) in chunkedSponsoredProfiles[chunkInd]" :key="user.first_name + user.last_name + user.homonymous_id"
					v-show="checkOwnChunkIsLoaded(chunkInd)" :class="{ 'no-profile-img': notLoadedImgsPerChunk[chunkInd]?.includes(index) }"
					:user :cardIndexes="[chunkInd, index]" :img="{
						src: getProfilePhotoPath(this.store.placeholderImg(user.first_name, user.last_name), photo, this.store.apiUri.slice(0, -4)),
						atLoad: updateLoadedImgsPerChunk,
						atError: updateNotLoadedImgsPerChunk
					}" />
			</template>
			<p class="info-box">
				Visualizzati {{ chunkedSpProfLength }} profili di {{ totalSponsoredProfiles }}
			</p>
		</div>
		<div class="buttons-wrapper mx-auto">
			<button v-if="!(requestedProfiles >= totalSponsoredProfiles)" class="btn mt-4 mb-2"
				@click="requestedPage === 2 ? getSponsoredProfiles(elementsPerPage = 5, requestedPage = 5) : getSponsoredProfiles()"><i
					class="fa-regular fa-circle-down fa-2xl"></i></button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@use '../../styles/variables' as var;
	
	main {
		background-image: url(../../public/tile_background.png);
	}

	h3 {
		text-align: center;
		margin-bottom: 20px;

	}

	/* Sponsored Doctor */
	.component-container h2 {
		text-align: center;
		margin-bottom: 20px;
	}

	.component-container {
		/* background-color: var(--color-complementary); */
		border-radius: 25px;
		padding: 20px;
		margin-bottom: 50px;
	}

	.sponsored-card-container {
		padding: 10px 5px;
		background-color: white;
		display: flex;
		gap: 30px;
		justify-content: center;
		flex-wrap: wrap;

	}

	.buttons-wrapper {
		width: fit-content;

		.fa-circle-down {
			color: #fff;

			transition: color 0.6s ease-out;
			// ;
			
			// &:hover {
			// 	color: var(--color-primary);
			// }
		}
	}
	
	p.info-box {
		padding: 15px 25px;
		flex: 1 0 100%;
		text-align: right;
	}

	/* Loader progressive */
	.loader {
		--r1: 154%;
		--r2: 68.5%;
		width: 60px;
		aspect-ratio: 1;
		border-radius: 50%;
		background:
			radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
			radial-gradient(var(--r1) var(--r2) at bottom, var(--color-secondary) 79.5%, #0000 80%),
			radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--color-secondary) 80%),
			#ccc;
		background-size: 50.5% 220%;
		background-position: -100% 0%, 0% 0%, 100% 0%;
		background-repeat: no-repeat;
		animation: l9 2s infinite linear;
		position: absolute;
		top: 50%;
		left: 48%;
	}

	@keyframes l9 {
		33% {
			background-position: 0% 33%, 100% 33%, 200% 33%
		}

		66% {
			background-position: -100% 66%, 0% 66%, 100% 66%
		}

		100% {
			background-position: 0% 100%, 100% 100%, 200% 100%
		}
	}
</style>