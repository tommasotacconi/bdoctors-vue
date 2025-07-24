import { reactive } from 'vue';

export const homepageStore = reactive({
	// Variables needed for the advanced search functionality
	selectedSpecialization: null,
	allSpecializations: [],
})