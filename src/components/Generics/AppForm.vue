<script>
	import axios from 'axios';
	import { store } from '../../../js/store';

	export default {
		data() {
			return {
				formData: {},
				errors: {},
				validated: undefined,
				sent: undefined,
				/* elements: {
						name: {
							id: '',
							type: ''
							placeholder: '',
						}
					 } */
				store,

			}
		},
		methods: {
			createFormData() {
				for (const key in this.elements) {
					if (key !== 'vote') this.$data.formData[key] = '';
					else this.$data.formData[key] = null;
					this.$data.errors[key] = '';
				}
			},
			validateEmail(email) {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return re.test(email)
			},
			validateForm() {
				this.resetErrors();
				// Set errors if any
				for (const data in this.formData) {
					const value = this.formData[data];
					const label = this.elements[data].label;

					if (!value) {
						if (data === 'messageContent' || data === 'reviewContent') {
							const msgAdaptedPart = data === 'messageContent' ? '' : 'la';
							this.errors[data] = `Inserisci il corpo del${msgAdaptedPart} ${label.toLowerCase()}`;
						}
						else if (data === 'vote') this.errors[data] = 'Inserisci un voto in stetoscopi da 1 a 5';
						else if (data !== 'email') this.errors[data] = `Il ${label.toLowerCase()} è obbligatorio`;
						else this.errors[data] = `La ${label.toLowerCase()} è obbligatoria`;
					}
					else if ((data === 'first_name' || data === 'last_name') && value.length <= 2)
						this.errors[data] = `Il ${label.toLowerCase()} deve contenere almeno 3 caratteri`;
					else if (data === 'email' && !this.validateEmail(value)) this.errors[data] = 'L\'email inserita non è valida';
				}
				// Check form validity by errors' presence
				let isValid = true;
				for (const data of Object.keys(this.formData)) {
					if (this.errors[data]) isValid = false;
				}
				if (isValid) {
					this.validated = true;
					this.sendForm();
				}

				console.table({ 'Form\'s data': this.formData });
				console.table({ 'form\'s errors': this.errors });
			},
			resetForm() {
				for (const key in this.formData) {
					if (key !== 'vote') this.formData[key] = '';
					else this.formData[key] = null;
					this.validated = false;
				}
			},
			resetErrors() {
				for (const key in this.formData) {
					this.errors[key] = '';
				}
			},
			sendForm() {
				this.sent = null;
				axios.post(this.store.apiUri + this.apiRoute, {
					doctor_details: this.doctorInfo,
					...this.formData,
				})
					.then(response => {
						// console.log('Message sent.', response.data);
						this.sent = true;
						this.resetForm();
					})
					.catch(err => {
						// handle error
						console.log(err.response.data);
						this.sent = false;
					})
			}
			// [Symbol.iterator]() {
			// 	let i = 0;
			// 	return {
			// 		next() {
			// 			if (i < Object.keys(this).length) {
			// 				return { value: this[Object.keys(this)[i++]], done: false }
			// 			}
			// 			return { value: undefined, done: true };
			// 		},
			// 	};
			// }
		},
		computed: {
			formNameSuffix() {
				return this.elements.content.id === 'message' ? 'o' : 'a';
			},
			yourFormNameSentence() {
				return this.elements.content.id === 'message' ? 'Il tuo messaggio' : 'La tua recensione';
			}
		},
		props: {
			apiRoute: {
				type: String,
				required: true
			},
			elements: {
				type: Object,
				required: true
			},
			doctorInfo: {
				type: Object,
				required: true
			},

		},
		created() {
			this.createFormData();
		}
	}
</script>

<template>
	<div class="form-frame">
		<form id="message-form" class="form-control py-3" @submit.prevent="validateForm" novalidate
			v-if="sent === undefined">
			<!-- Generic form element -->
			<div class="mb-3 col-12" :class="{ 'votes': key === 'vote' }" v-for="(el, key) in elements">
				<template v-if="key !== 'vote'">
					<label :for="el.id" class="form-label">{{ el.label }}</label>
					<input v-if="key !== 'content'" :id="el.id" v-model.trim="formData[key]" :type="el.type"
						:placeholder="el.placeholder" class="form-control" :class="{ 'invalid-input': errors[key] }"
						:rows="key === 'content' ? 3 : null" required>
					<textarea v-if="key === 'content'" :id="el.id" v-model.trim="formData[key]" :type="el.type"
						:placeholder="el.placeholder" class="form-control" :class="{ 'invalid-input': errors[key] }"
						:rows="key === 'content' ? 3 : null" required></textarea>
				</template>
				<template v-if="key === 'vote'" v-for="vote in [5, 4, 3, 2, 1]">
					<input :id="el.id + vote" class="form-control" :class="{ 'invalid-input': errors[key] }" :value="vote"
						v-model.trim="formData[key]" :type="el.type" required>
					<label :for="el.id + vote" class="form-label"><i class="fa-solid fa-stethoscope"></i></label>
				</template>
				<!-- Box for single input's error message -->
				<div class="invalid" v-if="errors[key]">
					<p> {{ errors[key] }} </p>
				</div>
			</div>
			<!-- Submit button -->
			<button type="submit" class="btn btn-primary btn-submit" :class="{ 'disabled': validated }">Invia
				messaggio</button>
		</form>

		<Loader v-else-if="sent === null" />

		<div v-else-if="sent" class="my-3">
			<p class="my-2 px-2">
				{{ yourFormNameSentence }} è stat{{ formNameSuffix }} inviat{{ formNameSuffix }} correttamente.
			</p>
			<button type="button" @click="sent = undefined" class="btn btn-sm btn-primary">Invia nuovo</button>
		</div>

		<div v-else class="my-3">
			<p class="my-2 px-2">
				{{ yourFormNameSentence }} non può essere inviat{{ formNameSuffix }} al momento. Controlla la connessione a
				internet
				o riprova più tardi.
			</p>
			<button type="button" @click="sent = undefined; validated = undefined"
				class="btn btn-sm btn-primary">Riprova</button>
		</div>
	</div>
</template>

<style scoped>
	.form-frame {
		min-height: 400px;
		display: flex;

		justify-content: center;
		align-items: center;
		border-radius: 40px;
		border: 3px solid #65B0FF;

		/* Loader sizing */
		.loader {
			width: 34px;
			position: static;
			translate: none;
		}

	}

	form {
		border-radius: 40px;
	}

	/* Message form */
	.invalid {
		color: red;
	}

	.invalid-input {
		border-color: red;
	}

	/*votes */
	.votes {
		margin-bottom: 20px;
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;

		& input {
			display: none;
		}

		& label {
			font-size: 24px;
			cursor: pointer;
		}

		& label:hover,
		& label:hover~label {
			color: var(--color-complementary)
		}

		& input:checked~label {
			color: var(--color-complementary)
		}
	}
</style>