/* Utility functions to retrieve path */
export function getFilePath(filePath, base) {
  return new URL(filePath, base).href;
}

export function getProfilePhotoPath(placeholderImg, photoPath, base) {
  // Calculate profile photo :src attribute depending on the presence of the 'photos' string in the db data photo in profiles table
  return photoPath?.includes('photos')
    ? getFilePath(`storage/${photoPath}`, base)
    : (photoPath ?? new URL(placeholderImg).href);
}
/*  */

export function getShowRoute(route, idComps) {
  return {
    name: route,
    params: { name: idComps.join(' ').trim() },
  };
}
