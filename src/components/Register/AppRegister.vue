<script>
import axios from 'axios';
import Multiselect from '../Generics/Multiselect.vue';
import AppAlert from '../Generics/AppAlert.vue'

export default {
	data() {
		return {
			errors: {
				firstName: [],
				lastName: [],
				homeAddress: [],
				specializations: [],
				email: [],
				password: [],
				passwordConfirmation: [],
			},
			isValidated: false,
			firstName: '',
			lastName: '',
			homeAddress: '',
			specializations: [],
			email: '',
			password: '',
			passwordConfirmation: '',
			isAlertShown: false,
			responseStatus: false,
		}
	},
	methods: {
		updateSpecs(specializations) {
			// Prepare a constant array result to insert ids value
			const result = [];
			// Insert ids taken from specializations parameter in reactive variable specializations, property of errors 
			for (let i = 0; i < specializations.length; i++) {
				result.push(specializations[i].id);
			}
			this.specializations = result;
			console.log('---current specializations---', this.specializations);
		},
		checkEmailValidity(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		checkFormValidity() {
			// Subscribe errors object with an empty one, to be ready for a next validation
			const allKeys = Object.keys(this.errors);  
			for (let i = 0; i < allKeys.length; i++) {
				this.errors[allKeys[i]] = [];
			}
			// Start validation
      if (this.firstName.length < 2 || this.firstName > 50) this.errors.firstName.push("Il nome può essere composto da 2 a 50 caratteri.");
      if (this.firstName.includes(' ')) this.errors.firstName.push("Rimuovere gli spazi.");
      if (this.lastName.length < 2 || this.lastName > 50) this.errors.lastName.push("Il cognome può essere composto da 2 a 50 caratteri.");
      if (this.lastName.includes(' ')) this.errors.lastName.push("Rimuovere gli spazi.");
      if (this.homeAddress.length < 3 || this.homeAddress > 100) this.errors.homeAddress.push("L'indirizzo di residenza può essere composto da 3 a 100 caratteri.");
      if (!this.specializations.length) this.errors.specializations.push("Selezionare almeno una specializzazione.");
      if (this.email.length < 6 || this.email.length > 50) this.errors.email.push("La email può essere composta da 6 a 50 caratteri.");
			if (!this.checkEmailValidity(this.email)) this.errors.email.push("La email non ha un formato valido.");
      if (this.password.includes(' ')) this.errors.password.push("Rimuovere gli spazi.");
      if (this.password.length < 8) this.errors.password.push("La password può essere composta da minimo 8 caratteri.");
			if (this.password !== this.passwordConfirmation) this.errors.passwordConfirmation.push("Le password non coincidono.");
			// Declare form validated by means of reactive variable 'isValidated'
			this.isValidated = true;
			// Check if the errors object is still empty
			for (let i = 0; i < allKeys.length; i++) {
				if (this.errors[allKeys[i]].length) return false;
			}
			return true
		},
		resetForm() {
			this.firstName = [];
			this.lastName = []; 
			this.homeAddress = [];
			this.specializations = [];
			this.email = [];
			this.password = [];
			this.passwordConfirmation = [];
		},
		sendRegistrationData() {
			// Runs the validation to control if it can move forward
			if (!this.checkFormValidity()) return
			// Makes the call
			axios.post('http://127.0.0.1:8000/api/register', {
				first_name: this.firstName,
				last_name: this.lastName,
				home_address: this.homeAddress,
				specialization_id: this.specializations,
				email: this.email,
				password: this.password,
				password_confirmation: this.passwordConfirmation
			})
				.then(response => {
					console.log(response);
					this.responseStatus = true;
					this.isAlertShown = true;
					this.$router.push('/user/login')

				})
				.catch(error => {
					console.log(error);
					// Trigger the alert by variable isAlertShown
					this.isAlertShown = true;
				});
		},
	},
	components: {
		Multiselect,
		AppAlert
	},
	computed: {
	}
}
</script>

<template>
	<!-- Register form -->
	<form class="" action="post" @submit.prevent="sendRegistrationData" novalidate>
		<div class="row card register-card" id="login-card">

			<!-- first_name input -->
			<div class="col-md-6 mb-2">
				<label for="first-name-input" class="badge rounded-pill">Nome</label>
				<input type="text" id="first-name-input" class="form-control" :class="{ 'invalid-element': errors.firstName.length }" v-model.trim="firstName">
				<div class="invalid-element" v-if="errors.firstName.length">
					<div v-for="(error, index) in errors.firstName" :key="index">{{ error }}</div>
				</div>
			</div>
			<!-- last_name input -->
			<div class="col-md-6 mb-2">
				<label for="last-name-input" class="badge rounded-pill">Cognome</label>
				<input type="text" id="last-name-input" class="form-control" :class="{ 'invalid-element': errors.lastName.length }" v-model.trim="lastName">
				<div class="invalid-element" v-if="errors.lastName.length">
					<div v-for="(error, index) in errors.lastName" :key="index">{{ error }}</div>
				</div>
			</div>
			<!-- home_address input -->
			<div class="col-md-12 mb-2">
				<label for="home-address-input" class="badge rounded-pill">Indirizzo di residenza</label>
				<input type="text" id="home-address-input" class="form-control" :class="{ 'invalid-element': errors.homeAddress.length }" v-model.trim="homeAddress">
				<div class="invalid-element" v-if="errors.homeAddress.length">
					<div v-for="(error, index) in errors.homeAddress" :key="index">{{ error }} </div>
				</div>
			</div>
			<!-- specializations with Multiselect component-->
				<div id="multiselect-container" class="col-md-12 mb-2">
				<label for="specializations-input" class="badge rounded-pill">Specializzazioni</label>
				<Multiselect id="" class="specializations-input" :class="{ 'invalid-element': errors.specializations.length }" @send-values="updateSpecs" />
				<div class="invalid-element" v-if="errors.specializations.length">
					<div v-for="(error, index) in errors.specializations" :key="index">{{ error }}</div>
				</div>
			</div>
			<!-- email input -->
			<div class="col-md-12 mb-3">
				<label for="email-input" class="badge rounded-pill">Email</label>
				<input type="text" id="email-input" class="form-control" :class="{ 'invalid-element': errors.email.length }" v-model.trim="email">
				<div class="invalid-element" v-if="errors.email.length">
					<div v-for="(error, index) in errors.email" :key="index">{{ error }} </div>
				</div>
			</div>
			<!-- password input -->
			<div class="col-md-12 mb-2">
				<label for="password-input" class="badge rounded-pill">Password</label>
				<input type="password" id="password-input" class="form-control" :class="{ 'invalid-element': errors.password.length }" v-model.trim="password">
				<div class="invalid-element" v-if="errors.password.length">
					<div v-for="(error, index) in errors.password" :key="index">{{ error }}</div>
				</div>
			</div>
			<!-- confirm password input -->
			<div class="col-md-12 mb-2">
				<label for="password-confirmation-input" class="badge rounded-pill">Conferma password</label>
				<input type="password" id="password-confirmation-input" class="form-control" :class="{ 'invalid-element': errors.passwordConfirmation.length }" v-model.trim="passwordConfirmation">
				<div class="invalid-element" v-if="errors.passwordConfirmation.length">
					<div v-for="(error, index) in errors.passwordConfirmation" :key="index">{{ error }}</div>
				</div>
			</div>

			<!-- Button wrappers -->
			<div class="buttons-wrapper mt-3">
				<!-- register button -->
				<button type="submit" class="btn btn-primary" id="register-button">Registrati</button>
				<!-- reset button -->
				<button type="reset" class="btn btn-warning ms-3" id="reset-button" @click.prevent="resetForm()">Pulisci</button>
			</div>

			<!-- Alert container -->
			<div class="col-md-12" v-show="isAlertShown">
				<!-- Alert card for confirmed registration -->
				<AppAlert id="result-alert" class="alert alert-success mt-2" v-show="responseStatus">
					I dati sono stati registrati
				</AppAlert>
				<!-- Alert card for confirmed registration -->
				<AppAlert id="result-alert" class="alert-danger mt-2" v-show="!responseStatus">
					I dati inseriti non sono validi. Provare a cambiare la email.
				</AppAlert>
			</div>

		</div>
	</form>
</template>

<style scoped>
/* Generics */
form {
	min-height: 900px;
	height: calc(100vh - 80px);
	display: flex;
	align-items: center;
}

label {
	width: fit-content;
	font-size: 0.9rem;
	/* padding: 0 10px; */
	background-color: #65B0FF;
	color: white;

	position: relative;
	left: 15px;
	top: 12px;
}

input {
	height: 3.2rem;
	border: 2px solid #65B0FF;
}

/* Utilities */
.card {
	padding-bottom: 20px;
	background-color: var(--color-complementary); /* #FFB465; */
	flex-direction: row;
}

.register-card {
	margin: 0 auto;
	width: 600px;
}

#result-alert{
	padding-left: 10px;
	padding-right: 10px;
	display: block;
	border-width: 2px;
}

.invalid-element,
div#multiselect-container .specializations-input.invalid-element {
	color: #e4005b;
	border-color: currentColor;
}

div#multiselect-container {
	height: 10rem;
	overflow: clip;
	overflow-clip-margin: 190px;

	label {
		position: relative;
		z-index: 1;
	}

	.specializations-input {
		border: 2px solid #65B0FF;
		border-radius: 7px;
	}
}

.btn-warning {
	color: #fff;
	background-color: #ca9400;
}

#register-button {
	background-color: #65B0FF;

	&:hover {
		background-color: #0E395D;
	}
}
</style>