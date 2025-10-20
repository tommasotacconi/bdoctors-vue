export function useHandler() {
	
	function handleUploadedNewFile(file, formData, errors, field) {
		errors[field] = '';
		// console.log(file);

		// function isObjectEmpty(objectName) {
		// 	return objectName && Object.entries(objectName).length === 0 && objectName.constructor === Object;
		// }

		if (file /* && !isObjectEmpty(file) */) formData[field] = file;
		else if (file === false) errors[field] = `Inserire un file di dimensioni non superiori a 2048KB e del tipo indicato nel selettore di file`;
		else formData[field] = null;
	}

	return { handleUploadedNewFile };
}
