<script>
import axios from '../../axios';

export default {
	data() {
		return {
			inputEmail: '',
			inputPassword: '',
			responseStatus: false,
		}
	},
	methods: {
		async sendLoginData() {
			try {
				const response = await axios.post('/api/login', {
					email: this.inputEmail,
					password: this.inputPassword
				});

				if (response.data.token) {
					localStorage.setItem('authToken', response.data.token);
				}

				if (response.data.success && response.data.data) {
					this.responseStatus = true;
					await this.$router.push(`/user/${response.data.data.id}`);
				}
			} catch (error) {
				this.responseStatus = false;
				console.error('Login error:', error);
			}
		},
		logout() {
			localStorage.removeItem('authToken');
			this.$router.push('/');
		}
	}
}
</script>

<template>
	<form class="" action="post" @submit.prevent="sendLoginData">
		<div class="card login-card row" id="login-card">
			<div class="col-12">
				<!-- Email input -->
				<label for="email-input" class="badge rounded-pill">Email</label>
				<input type="text" id="email-input" class="form-control mb-3" v-model="inputEmail">
			</div>
			<div class="col-12">
				<!-- Password input -->
				<label for="password-input" class="badge rounded-pill">Password</label>
				<input type="text" id="password-input" class="form-control mb-3" v-model="inputPassword">
			</div>
			<!-- Button wrappers -->
			<div class="buttons-wrapper col-12">
				<button type="submit" class="btn btn-primary mt-4 mb-3" id="login-button">Login</button>
				<div class="mt-3" v-if="responseStatus">Accesso effettuato</div>
			</div>
		</div>
	</form>
</template>

<style lang="scss" scoped>
form {
	height: calc(100vh - 80px);
	display: flex;
	align-items: center;
}

.card {
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
	width: 100%;
	background-color: #65B0FF;

	&:hover {
		background-color: #0E395D;
	}
}
</style>