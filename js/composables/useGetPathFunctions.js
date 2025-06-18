export function useGetPathFunctions() {
	// Utility functions to retrieve path
	function	getFilePath(filePath) {
		return new URL(filePath, this.store.apiUri.slice(-3)).href;
	}
	
	function getProfilePhotoPath(placeholderImg, photoPath) {
		// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo in profiles table
		return photoPath?.includes('photos') ? getFilePath(`storage/${photoPath}`) : photoPath ?? new URL(placeholderImg).href;
	}

	return { getFilePath, getProfilePhotoPath };
}

