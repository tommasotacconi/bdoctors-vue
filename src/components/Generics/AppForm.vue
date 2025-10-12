<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import Multiselect from './Multiselect.vue';
	import FileUpload from './FileUpload.vue';
	import { dashboardStore } from '../../../js/dashboardStore';

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
				dashboardStore
			}
		},
		methods: {
			updateSpecs(specializations, reactiveObj, key) {
				// Prepare a constant array result to insert ids value
				const result = [];
				// Insert ids taken from specializations parameter in reactive variable specializations, property of errors 
				for (let i = 0; i < specializations.length; i++) {
					result.push(specializations[i].id);
				}

				reactiveObj[key] = result;
			},
			createFormData() {
				for (const key in this.elements) {
					const eventualValue = this.elements[key].value ?? '';
					if (key === 'specializationsId') this.$data.formData[key] = eventualValue ? eventualValue : [];
					else if ((key === 'vote')) this.$data.formData[key] = null;
					else this.$data.formData[key] = eventualValue;
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

					if (!value || value instanceof Array && !value.length) {
						if (data === 'content') {
							const msgAdaptedPart = label === 'Messaggio' ? '' : 'la';
							this.errors[data] = `Inserisci il corpo del${msgAdaptedPart} ${label.toLowerCase()}`;
						}
						else if (data === 'vote') this.errors[data] = 'Inserisci un voto in stetoscopi da 1 a 5';
						else if (data !== 'email' && data !== 'password' && data !== 'pwConf' && data !== 'photo') this.errors[data] = `Il ${label.toLowerCase()} è obbligatorio`;
						else this.errors[data] = `La ${label.toLowerCase()} è obbligatoria`;
					}
					else if ((data === 'first_name' || data === 'last_name') && value.length <= 2)
						this.errors[data] = `Il ${label.toLowerCase()} deve contenere almeno 3 caratteri`;
					else if (data === 'email' && !this.validateEmail(value)) this.errors[data] = 'L\'email inserita non è valida';
				}
				// Run custom validation function if any
				if (this.perfectValidation) this.perfectValidation(this);
				// Check form validity by errors' presence
				let isValid = true;
				for (const data of Object.keys(this.formData)) {
					if (this.errors[data]) isValid = false;
				}
				if (isValid) {
					this.validated = true;
					this.sendForm();
				}

				// console.table({ 'Form\'s data': this.formData });
				// console.table({ 'Form\'s errors': this.errors });
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
				// Convert to snake_case data
				const { pwConf, ...data } = this.camelToSnake(this.formData);
				// console.log(data);
				axios.post(this.store.apiUri + this.apiRoute, {
					doctor_details: this.doctorInfo,
					...data,
				}, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true
				})
					.then(response => {
						// console.log('message sent.', response.data);
						this.sent = true;
						this.resetForm();
					})
					.catch(err => {
						// console.log(err.response.data);
						this.sent = false;
					})
			},
			camelToSnake(obj) {
				const result = {};
				for (const [key, value] of Object.entries(obj)) {
					const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
					result[snakeKey] = value;
				}

				return result;
			},
			handleSuccessfulSend() {
				if (this.name === 'messaggio' || this.name === 'recensione') sent = undefined;
				else if (this.name === 'nuovo profilo' || this.name === 'modifica di profilo') {
					this.sent = undefined;
					this.dashboardStore.currentProfileSectionComponentIndex = 0;
				}
			}
		},
		props: {
			doctorInfo: {
				type: [Object, null],
				required: true
			},
			apiRoute: {
				type: String,
				required: true,
			},
			elements: {
				type: Object,
				required: true
			},
			// Name, article, concordance
			nameArtConc: {
				type: Array,
				required: true
			},
			perfectValidation: {
				type: Function,
			},
			isRendered: {
				type: Boolean,
				required: false
			},
			formFrameClass: {
				type: Object
			},
			formClass: {
				type: Object
			},
			optionalPropsObject: {
				type: Object
			},
			wrapperInnerDiv: {
				type: Object
			},
		},
		computed: {
			name() {
				return this.nameArtConc[0];
			},
			art() {
				return this.nameArtConc[1];
			},
			conc() {
				return this.nameArtConc[2];
			},
			stdPhraseWithName() {
				return `${this.art[0].toUpperCase()}${this.art.slice(1)} tu${this.conc} ${this.name}`
			},
		},
		components: {
			Multiselect,
			FileUpload
		},
		created() {
			this.createFormData();
		},
	}
</script>

<template>
	<!-- /* Form section */ -->
	<div class="form-frame container" :class="formFrameClass">
		<!-- Generic form element -->
		<form v-if="sent === undefined" @submit.prevent="validateForm" novalidate :class="formClass">
			<div class="row" :class="wrapperInnerDiv">
				<!-- Form field's template -->
				<div class="mb-2" :class="el.wrapperStyle" v-for="(el, key) in elements">
					<!-- If vote field -->
					<template v-if="key === 'vote'">
						<label class="badge rounded-pill">{{ el.label }}</label>
						<div class="form-control text-center vote">
							<template v-for="vote in [5, 4, 3, 2, 1]">
								<input :id="el.id + vote" class="form-control" :class="{ 'invalid-input': errors[key] }" :value="vote"
									v-model.trim="formData[key]" :type="el.type">
								<label :for="el.id + vote" class="form-label stethoscope"><i
										class="fa-solid fa-stethoscope"></i></label>
							</template>
						</div>
					</template>
					<!-- If specializations' multiselect field -->
					<template v-else-if="key === 'specializationsId'">
						<label for="el.id" class="badge rounded-pill">{{ el.label }}</label>
						<Multiselect id="" class="specializations-multiselect" :class="{ 'invalid-input': errors[key] }"
							:specializations="formData[key]"
							@send-values="(specializations) => { updateSpecs(specializations, formData, key); }" />
					</template>
					<!-- if input type file field -->
					<template v-else-if="key === 'photo' || key === 'curriculum'">
						<label for="el.id" class="badge rounded-pill">{{ el.label }}</label>
						<FileUpload class="form-control" :class="{ 'invalid-input': errors[key] }"
							:accept="key === 'photo' ? 'image/jpeg,image/png,imgage/jpg,application/pdf' : 'application/pdf,text/plain'"
							:size="2048 * 1000"
							@uploaded-new-file="(value) => { console.log('uploaded new file'); optionalPropsObject.handleUploadedNewFile(value, formData, errors, key) }" />
					</template>
					<!-- If other fields of type text input and textarea -->
					<template v-else>
						<label :for="el.id" class="badge rounded-pill">{{ el.label }}</label>
						<input v-if="el.type !== 'textarea'" :id="el.id" v-model.trim="formData[key]" :type="el.type"
							:placeholder="el.placeholder" class="form-control" :class="{ 'invalid-input': errors[key] }"
							:rows="key === 'content' ? 3 : null" :disabled="el.disabled">
						<textarea v-else :id="el.id" v-model.trim="formData[key]" :placeholder="el.placeholder" class="form-control"
							:class="{ 'invalid-input': errors[key] }" :rows="key === 'content' ? 3 : null"></textarea>
					</template>
					<!-- Box for single input's error message -->
					<div class="invalid" v-if="errors[key]">
						<p>{{ errors[key] }}</p>
					</div>
				</div>

				<!-- /* Buttons section */ -->
				<!-- Submit content for review or message form-->
				<div v-if="name === 'messaggio' || name === 'recensione'" class="buttons-wrapper text-center">
					<button type="submit" class="btn btn-primary btn-submit mx-auto mt-4" :class="{ 'disabled': validated }">Invia
						{{ name.toLowerCase() }}
					</button>
				</div>
				<!-- Submit, reset buttons for registration or login -->
				<div v-if="name === 'registrazione'" class="buttons-wrapper mt-3">
					<button type="submit" id="register-button" class="btn btn-primary btn-submit mx-auto"
						:class="{ 'disabled': validated }">Registrati
					</button>
					<button type="button" id="reset-button" class="btn btn-warning ms-3" :class="{ 'disabled': validated }"
						@click.prevent="resetForm()">Pulisci
					</button>
				</div>
				<!-- Submit, reset buttons for profile creation and edit -->
				<div v-if="name === 'nuovo profilo' || name === 'modifica di profilo'" class="buttons-wrapper mt-3">
					<button type="submit" id="create-profile-button" class="btn btn-submit mx-auto"
						:class="{ 'disabled': validated }">
						<span v-if="name === 'nuovo profilo'">Crea</span>
						<span v-else>Modifica</span>
						profilo
					</button>
					<button type="button" id="reset-button" class="btn btn-warning ms-3" :class="{ 'disabled': validated }"
						@click.prevent="resetForm()">Pulisci
					</button>
				</div>
			</div>
		</form>

		<Loader v-else-if="sent === null" />

		<!-- Notification message for successfull sending -->
		<div v-else-if="sent" class="msg-wrapper">
			<p class="my-2">
				{{ stdPhraseWithName }} è stat{{ conc }} inviat{{ conc }}
				correttamente.
			</p>

			<button type="button" @click="handleSuccessfulSend" class="btn btn-sm d-block mx-auto">
				<span v-if="name !== 'nuovo profilo' && name !== 'modifica di profilo'">Invia nuov{{ conc }}</span>
				<span v-else>Vai al profilo</span>
			</button>
		</div>

		<!-- Notification message for impossible sending -->
		<div v-else class="my-3">
			<p class="my-2 px-2">
				{{ stdPhraseWithName }} non può essere inviat{{ conc }} al
				momento.
				Controlla
				la
				connessione a internet o riprova più tardi.
			</p>

			<button type="button" @click="sent = undefined; validated = undefined"
				class="btn btn-sm d-block mx-auto">Riprova</button>
		</div>
	</div>
</template>

<style scoped>
	.form-frame {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		p {
			width: fit-content;
		}

		.msg-wrapper {
			width: fit-content;
		}

		/* Loader sizing */
		.loader {
			width: 34px;
		}
	}
</style>