export function useDefaultValidation() {
  function validateName(name, label) {
    if (name.length < 2 || name.length > 50)
      return `Il ${label.toLowerCase()} può essere composto da 2 a 50 caratteri`;
  }

  function validateEmail(email) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!re.test(email)) return "L'indirizzo email non è valido";
  }

  function validateAddress(address) {
    if (address.length < 4 || address.length > 100)
      return "L'indirizzo di residenza può essere composto da 4 a 100 caratteri";
  }

  function validatePhone(phone, label) {
    if (phone) {
      const reResult = /^(?:\+\d{2,3})?[\d\s]{5,11}$/.test(phone);
      if (!reResult)
        return `Il ${label.toLowerCase()} può essere composto da numeri separati da spazi ed eventualmente iniziare con un prefisso '+##'`;
    }
  }

  function validateSpecializations(specializations, label) {
    if (!specializations.length)
      return 'Selezionare almeno una specializzazione';
  }

  function validateServices(services, label) {
    if (services.length > 400)
      return `Le ${label.toLowerCase()} possono essere indicate in massimo 400 caratteri`;
  }

  function validateFile(file, label) {
    if (file === null) return '';
  }

  return {
    validateFirstName: validateName,
    validateLastName: validateName,
    validateEmail,
    validatePhone,
    validateHomeAddress: validateAddress,
    validateOfficeAddress: validateAddress,
    validateSpecializations,
    validateServices,
    validateCurriculum: validateFile,
    validatePhoto: validateFile,
  };
}
