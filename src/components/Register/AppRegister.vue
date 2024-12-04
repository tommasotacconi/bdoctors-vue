<script>
import axios from 'axios';

export default {
	data() {
		return {
			errors: [];
			firstName: '',
			lastName: '',
			homeAddress: '',
			specializations: [],
		  email: '',
			password: '',
			responseStatus: false,
		}
	},
	methods: {
		checkForm() {
			if(this.firstName && this.lastName && this.homeAddress && this.specializations && this.email && this.password) return true;
      this.errors = [];
      if(!this.firstName) this.errors.push("Il nome è vuoto.");
      if(this.firstName < 2 || this.firstName > 50) this.errors.push("Il nome può essere composto da 2 a 50 caratteri.");
      if(!this.lastName) this.errors.push("Il cognome è vuoto.");
      if(this.lastName < 2 || this.lastName > 50) this.errors.push("Il cognome può essere composto da 2 a 50 caratteri.");
      if(!this.homeAddress) this.errors.push("L'indirizzo di residenza è vuoto");
      if(this.homeAddress < 3 || this.home_address > 100) this.errors.push("L'indirizzo di residenza può essere composto da 3 a 100 caratteri.");
      if(!this.specializations) this.errors.push("Selezionare almeno una specializzazione");
      if(!this.email) this.errors.push("La email è vuota");
      if(this.email < 2 || this.email > 50) this.errors.push("La email può essere composta da 6 a 50 caratteri.");
      if(!this.password) this.errors.push("La password è vuota");
      if(this.password < 2) this.errors.push("La password può essere composta da minimo 8 caratteri.");
			return false
		},
		sendRegistrationData() {
			// Run the validation to control if it can move forward
			if (!this.checkForm()) return
			axios.post('http://127.0.0.1:8000/api/register', {
				firstName: this.firstName,
				lastName: this.lastName,
				homeAddress: this.homeAddress,
				specializations: this.specializations,
				email: this.inputEmail,
				password: this.inputPassword
			})
			.then(response => {
				console.log(response);
				this.responseStatus = true;
			})
			.catch(function (error) {
				console.log(error);
			});
		},
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
				<!-- specializations input-->
				 <div class="col-md-12">
					 <label for="specializations-input" class="badge rounded-pill">Specializzazioni</label>
					 <select id="specializations-input" class="form-select mb-3" v-model="specializations">
						<option v-for="(specialization, index) in specializations" :key="index">specialization</option>
					 </select>
				 </div>
				<!-- email input -->
				<div class="col-md-6">
					<label for="email-input" class="badge rounded-pill">Email</label>
					<input type="text" id="email-input" class="form-control mb-3" v-model="email">
				</div>
				<!-- password input -->
				<div class="col-md-6">
					<label for="password-input" class="badge rounded-pill">Password</label>
					<input type="text" id="password-input" class="form-control mb-3" v-model="password">
				</div>
				<!-- Button wrappers -->
				<div class="buttons-wrapper">
					<!-- register button -->
					<button type="submit" class="btn btn-primary mt-5" id="register-button">Register</button>
					<!-- reset button -->
					<button type="reset" class="btn btn-warning mt-5 ms-3" id="reset-button">Pulisci</button>
					<div class="mt-3" v-if="responseStatus">Dati registrati</div>
				</div>
			 </div>
	</form>
</template>

<style scoped>
/* Generics */
form {
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

#register-button {
	background-color: #65B0FF;
}
</style>