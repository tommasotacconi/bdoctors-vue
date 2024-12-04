<script>
import axios from 'axios';

export default {
	data() {
		return {
		  inputEmail: '',
			inputPassword: '',
			responseStatus: false,
		}
	},
	methods: {
			sendLoginData() {
				axios.post('http://127.0.0.1:8000/api/login', {
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
	<form class="" action="post" @submit.prevent="sendLoginData">
			<div class="card login-card" id="login-card">
				<!-- Email input -->
				<label for="email-input" class="badge rounded-pill">Email</label>
				<input type="text" id="email-input" class="form-control mb-3" v-model="inputEmail">
				<!-- Password input -->
				<label for="password-input" class="badge rounded-pill">Password</label>
				<input type="text" id="password-input" class="form-control mb-3" v-model="inputPassword">
				<!-- Button wrappers -->
				<div class="buttons-wrapper">
					<button type="submit" class="btn btn-primary mt-5" id="login-button">Login</button>
					<div class="mt-3" v-if="responseStatus">Accesso effettuato</div>
				</div>
			 </div>
	</form>
</template>

<style scoped>
form {
	height: calc(100vh - 80px);
	display: flex;
	align-items: center;
}

.card {
	padding: 20px 25px;

	background-color: #FFB465;
}

.login-card {
	margin: 0 auto;
	width: 350px;
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

#login-button {
	background-color: #65B0FF;
}
</style>