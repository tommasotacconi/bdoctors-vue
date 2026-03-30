<script>
	import axios from 'axios';
	import { RouterLink } from 'vue-router';
	import { store } from '../../../js/store.js';
	import { useGetPathFunctions } from '../../../js/composables/useGetPathFunctions.js';
	import SponsoredCard from './SponsoredCard.vue';
	import { homepageStore } from '../../../js/homepageStore.js';

	export default {
		data() {
			return {
				store,
				homepageStore,
			}
		},
		methods: {
			getSponsoredProfiles(perPage = this.elementsPerPage, page = this.requestedPage) {
				if (!this.homepageStore.firstReqTime) this.homepageStore.firstReqTime = new Date();
				axios.get(this.store.apiUri + 'profiles/sponsored', {
					params: {
						page,
						per_page: perPage,
						firstReqTime: this.homepageStore.firstReqTime
					}
				})
					.then(({ data: { paginated_profiles } }) => {
						this.homepageStore.chunkedSponsoredProfiles.push(paginated_profiles.data);
						this.homepageStore.totalSponsoredProfiles = paginated_profiles.total;

						this.$emit('loadedSponsoredProfiles');
					})
					.catch(function (err) {
						console.error('Error in GET /api/sponsorships/sponsored: ', err);
					})

				// Update next requested page
				this.homepageStore.requestedPage += 1;
				// Manage request profiles until now
				const [rP, tSP] = [this.homepageStore.requestedProfiles += perPage, this.homepageStore.totalSponsoredProfiles];
				if (tSP && rP > tSP) this.homepageStore.requestedProfiles = tSP;
			},
			goToShowPage(fName, lName, homId) {
				let completeName = fName + '-' + lName;
				if (homId !== null) completeName += '-' + homId;
				this.$router.push({ name: 'search', params: { name: completeName } })
				// console.log('doctor position inside homepage ', index);
				// console.log(store.searchedSpecialization)
			},
			updateLoadedImgsPerChunk(chunkInd) {
				const imgsArr = this.homepageStore.loadedImgsPerChunk;

				return imgsArr[chunkInd] ? imgsArr[chunkInd] += 1 : imgsArr[chunkInd] = 1;
			},
			updateNotLoadedImgsPerChunk(chunkInd, imgInd) {
				const imgsArr = this.homepageStore.notLoadedImgsPerChunk;

				return imgsArr[chunkInd] ? imgsArr[chunkInd].push(imgInd) : imgsArr[chunkInd] = [imgInd];
			},
			checkOwnChunkIsLoaded(chunkInd) {
				return this.areLoadedImgsPerChunk[chunkInd];
			},
			getNextPageWith(newElsPerPage) {
				const currEPP = this.elementsPerPage;
				const currRP = this.requestedPage;
				const result = [newElsPerPage, (currRP - 1) * currEPP / newElsPerPage + 1];
				[this.homepageStore.elementsPerPage, this.homepageStore.requestedPage] = result;

				return result;
			}
		},
		components: {
			SponsoredCard
		},
		computed: {
			chunkedSponsoredProfiles() { return this.homepageStore.chunkedSponsoredProfiles; },
			requestedPage() { return this.homepageStore.requestedPage; },
			elementsPerPage() { return this.homepageStore.elementsPerPage; },
			requestedProfiles() { return this.homepageStore.requestedProfiles; },
			totalSponsoredProfiles() { return this.homepageStore.totalSponsoredProfiles; },
			loadedImgsPerChunk() { return this.homepageStore.loadedImgsPerChunk; },
			notLoadedImgsPerChunk() { return this.homepageStore.notLoadedImgsPerChunk; },
			imgsPerChunk() { return this.homepageStore.chunkedSponsoredProfiles.map(chunk => chunk.length); },
			areLoadedImgsPerChunk() {
				let result = [];
				for (let i = 0; i < this.imgsPerChunk.length; i++) {
					const isLoadedChunk = (this.loadedImgsPerChunk[i] ?? 0) + (this.notLoadedImgsPerChunk[i]?.length ?? 0) === this.imgsPerChunk[i];
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
		setup() {
			const { getFilePath, getProfilePhotoPath } = useGetPathFunctions();

			return { getFilePath, getProfilePhotoPath };
		},
		mounted() {
			if (!this.totalSponsoredProfiles) this.getSponsoredProfiles();
			else (this.$emit('loadedSponsoredProfiles'));
		},
		unmounted() {
			const lPC = this.homepageStore.loadedImgsPerChunk;
			const nLPC = this.homepageStore.notLoadedImgsPerChunk;
			lPC.length = nLPC.length = 0;
		}
	}
</script>

<template>
	<div class="container component-container">
		<h3>Dottori in evidenza</h3>
		<div class="sponsored-card-container bg-transparent">
			<template v-for="(isLoadedChunk, chunkInd) in areLoadedImgsPerChunk">
				<SponsoredCard v-if="!isLoadedChunk" v-for="profiles in imgsPerChunk[chunkInd]" :simulatedSpecs="[0, 1]" />
				<SponsoredCard
					v-for="({ photo, user, user: { first_name: fName, last_name: lName, homonymous_id: homId } }, index) in chunkedSponsoredProfiles[chunkInd]"
					:key="fName + lName + homId" v-show="checkOwnChunkIsLoaded(chunkInd)"
					:class="{ 'no-profile-img': notLoadedImgsPerChunk[chunkInd]?.includes(index) }"
					@click="goToShowPage(fName, lName, homId)" :user :cardIndexes="[chunkInd, index]" :img="{
						src: getProfilePhotoPath(this.store.placeholderImg(fName, lName), photo, this.store.apiUri.slice(0, -4)),
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
				@click="requestedPage === 2 ? getSponsoredProfiles(...getNextPageWith(4)) : getSponsoredProfiles()"><i
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