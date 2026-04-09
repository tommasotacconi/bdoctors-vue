import { reactive } from 'vue';

export const homepageStore = reactive({
  // Variables needed for the advanced search functionality
  allSpecializations: [],
  chunkedSponsoredProfiles: [],
  requestedPage: 1,
  elementsPerPage: 12,
  firstReqTime: null,
  requestedProfiles: 0,
  totalSponsoredProfiles: null,
  loadedImgsPerChunk: [],
  notLoadedImgsPerChunk: [],
});
