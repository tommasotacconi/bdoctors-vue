export function useGetPathFunctions() {
	// Utility functions to retrieve path
	function	getFilePath(filePath, base) {
		return new URL(filePath, base).href;
	}
	
	function getProfilePhotoPath(placeholderImg, photoPath, base) {
		// Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo in profiles table
		return photoPath?.includes('photos') ? getFilePath(`storage/${photoPath}`, base) : photoPath ?? new URL(placeholderImg).href;
	}

	return { getFilePath, getProfilePhotoPath };
}

