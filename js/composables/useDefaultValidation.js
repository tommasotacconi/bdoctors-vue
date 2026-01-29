export function useDefaultValidation() {
    function validateAddress(address) {
        if (address.length < 3 || address.length > 100) return "L'indirizzo di residenza può essere composto da 3 a 100 caratteri";
    }
    
    function validatePhone(phone, label) {
        let reResult;
        if (phone) reResult = /^\+?\d[\d\s]*$/.test(phone);
        if (!reResult) return `Il ${label.toLowerCase()} può essere composto da numeri separati da spazi ed eventualmente iniziare con un prefisso '+##'`;
    }
    
    function validateSpecializations(specializations, label) {
        if (!specializations.length) return "Selezionare almeno una specializzazione";
    }

    function validateServices(services, label) {
        if (!services) return `Le ${label.toLowerCase()} sono obbligatorie`;
    }

    function validateFile(file, label) {
        if (file === null) return '';
    }

    return {
        validatePhone,
        validateHomeAddress: validateAddress,
        validateOfficeAddress: validateAddress,
        validateSpecializations,
        validateServices,
        validateCurriculum: validateFile,
        validatePhoto: validateFile
    }

}