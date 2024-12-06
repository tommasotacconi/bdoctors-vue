<script>
import axios from 'axios';
import Multiselect from '../Generics/Multiselect.vue';
import AppAlert from '../Generics/AppAlert.vue'

export default {
	data() {
		return {
			errors: [],
			firstName: '',
			lastName: '',
			homeAddress: '',
			specializations: [],
			email: '',
			password: '',
			passwordConfirmation: '',
			responseStatus: false,
		}
	},
	methods: {
		updateSpecs(specializations) {
			this.specializations = specializations;
			console.log('current specializations', this.specializations);
		},
		checkForm() {
			// Subscribe errors array with an empty one, to be ready for a next validation
			this.errors = [];
			if (!this.firstName) this.errors.push("Il nome è vuoto.");
			if (this.firstName.length < 2 || this.firstName > 50) this.errors.push("Il nome può essere composto da 2 a 50 caratteri.");
			if (!this.lastName) this.errors.push("Il cognome è vuoto.");
			if (this.lastName.length < 2 || this.lastName > 50) this.errors.push("Il cognome può essere composto da 2 a 50 caratteri.");
			if (!this.homeAddress) this.errors.push("L'indirizzo di residenza è vuoto");
			if (this.homeAddress.length < 3 || this.home_address > 100) this.errors.push("L'indirizzo di residenza può essere composto da 3 a 100 caratteri.");
			if (!this.specializations.length) this.errors.push("Selezionare almeno una specializzazione");
			if (!this.email) this.errors.push("La email è vuota");
			if (this.email.length < 2 || this.email > 50) this.errors.push("La email può essere composta da 6 a 50 caratteri.");
			if (!this.password) this.errors.push("La password è vuota");
			if (this.password.length < 8) this.errors.push("La password può essere composta da minimo 8 caratteri.");
			if (this.password !== this.passwordConfirmation) this.errors.push("Le password non coincidono");
			// Check if the errors array is still empty
			if (!this.errors.length) return true;
			return false
		},
		sendRegistrationData() {
			// Run the validation to control if it can move forward
			if (!this.checkForm()) return
			axios.post('http://127.0.0.1:8000/api/register', {
				first_name: this.firstName,
				last_name: this.lastName,
				home_address: this.homeAddress,
				specialization_id: this.specializations[0].id,
				email: this.email,
				password: this.password,
				password_confirmation: this.passwordConfirmation
			})
				.then(response => {
					console.log(response);
					this.responseStatus = true;
					this.$router.push('/user/login')

				})
				.catch(function (error) {
					console.log(error);
				});
		},
	},
	components: {
		Multiselect,
		AppAlert
	}
}
</script>

<template>
	<!-- Register form -->
	<form class="" action="post" @submit.prevent="sendRegistrationData">
		<div class="row card register-card" id="login-card">

			<!-- first_name input -->
			<div class="col-md-6">
				<label for="first-name-input" class="badge rounded-pill">Nome</label>
				<input type="text" id="first-name-input" class="form-control mb-3" v-model="firstName">
			</div>
			<!-- last_name input -->
			<div class="col-md-6">
				<label for="last-name-input" class="badge rounded-pill">Cognome</label>
				<input type="text" id="last-name-input" class="form-control mb-3" v-model="lastName">
			</div>
			<!-- home_address input -->
			<div class="col-md-12">
				<label for="home-address-input" class="badge rounded-pill">Indirizzo di residenza</label>
				<input type="text" id="home-address-input" class="form-control mb-3" v-model="homeAddress">
			</div>
			<!-- specializations with Multiselect component-->
			<div id="select-container" class="col-md-12">
				<label for="specializations-input" class="badge rounded-pill">Specializzazioni</label>
				<Multiselect id="specializations-input" @send-values="updateSpecs" />
			</div>
			<!-- email input -->
			<div class="col-md-12">
				<label for="email-input" class="badge rounded-pill">Email</label>
				<input type="text" id="email-input" class="form-control mb-3" v-model="email">
			</div>
			<!-- password input -->
			<div class="col-md-12">
				<label for="password-input" class="badge rounded-pill">Password</label>
				<input type="text" id="password-input" class="form-control mb-3" v-model="password">
			</div>
			<!-- confirm password input -->
			<div class="col-md-12">
				<label for="password-confirmation-input" class="badge rounded-pill">Conferma password</label>
				<input type="text" id="password-confirmation-input" class="form-control mb-3"
					v-model="passwordConfirmation">
			</div>

			<!-- Button wrappers -->
			<div class="buttons-wrapper">
				<!-- register button -->
				<button type="submit" class="btn btn-primary" id="register-button">Registrati</button>
				<!-- reset button -->
				<button type="reset" class="btn btn-warning ms-3" id="reset-button">Pulisci</button>
			</div>

			<!-- Alert container -->
			<div class="col-md-12 mb-2">
				<!-- Modal card for confirmed registration -->
				<AppAlert class="confirmation-alert alert-success mt-2" v-show="responseStatus">
					I dati sono stati registrati
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

input,
select {
	height: 3.5rem;
	border: 2px solid #65B0FF;
}

/* Utilities */
.card {
	padding-bottom: 20px;
	background-color: #FFB465;
	flex-direction: row;
}

.register-card {
	margin: 0 auto;
	width: 600px;
}

#errors-modal,
#confirmation-modal {
	padding-left: 10px;
	padding-right: 10px;
	display: block;
	border-width: 2px;
}

#errors-modal {
	border-color: red;
}

div#select-container {
	height: 10rem;
	overflow: clip;
	overflow-clip-margin: 190px;

	label {
		position: relative;
		z-index: 1;
	}

	#specializations-input {
		border: 2px solid #65B0FF;
		border-radius: 7px;
	}
}

#register-button {
	background-color: #65B0FF;
}
</style>