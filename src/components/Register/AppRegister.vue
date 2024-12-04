<script>
import axios from 'axios';

export default {
	data() {
		return {
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
			sendRegisterData() {
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
	<form class="" action="post" @submit.prevent="sendLoginData">
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
					 <select id="specializations-input" class="form-control mb-3" v-model="specializations"></select>
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
					<div class="mt-3" v-if="responseStatus">Verificare i campi indicati:</div>
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

input {
	height: 3rem;
	border: 2px solid #65B0FF;
}

/* Utilities */
.card {
	background-color: #FFB465;
	flex-direction: row;
	padding-bottom: 20px;
}

.register-card {
	margin: 0 auto;
	width: 80vw;
}

#register-button {
	background-color: #65B0FF;
}
</style>