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
				store,
				dashboardStore
			}
		},
		methods: {
			updateSpecs(specializations, formData, key) {
				// Prepare a constant array result to insert ids value
				const result = [];
				// Insert ids taken from specializations parameter in reactive variable specializations, property of errors 
				for (let i = 0; i < specializations.length; i++) {
					result.push(specializations[i]);
				}

				formData[key] = result;
			},
			updateFile(file, formData, errors, field) {
				errors[field] = '';
				if (file /* && !isObjectEmpty(file) */) formData[field] = file;
				else if (file === false) errors[field] = `Inserire un file di dimensioni non superiori a 2048KB e del tipo indicato nel selettore di file`;
				else formData[field] = null;
			},
			createFormData() {
				for (const key in this.elements) {
					const eventualValue = this.elements[key].value ?? '';
					if (key === 'specializationsId') this.$data.formData[key] = eventualValue ? eventualValue : [];
					else if (['vote', 'revsNum'].includes(key)) this.$data.formData[key] = null;
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
					// Prevent validation on set up properties
					if (['_method'].includes(data)) continue;

					const value = this.formData[data];
					const label = this.elements[data].label;

					// Check that field is enabled
					if (this.elements[data].disabled) continue;

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
				if (this.perfectValidation) this.perfectValidation(this.formData, this.elements, this.errors, this.fieldsToSend);
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
					// Check if field enabled
					if (this.elements[key].disabled) continue;

					if (!['vote', 'photo', 'curriculum', 'revsNum'].includes(key)) this.formData[key] = '';
					else if (key === 'specializationsId') {
						this.formData[key] = [];
						// Reset Multiselect if present on page (that is when sent === undefined)
						if (this.sent === undefined) this.$refs.multi[0].reset();
					}
					else this.formData[key] = null;
				}

				this.validated = false;
			},
			resetErrors() {
				for (const key in this.formData) {
					this.errors[key] = '';
				}
			},
			sendForm() {
				this.sent = null;
				let dataToSend = {};

				// Use computed 'send' to determine if there are only some data to send
				if (this.fieldsToSend) {
					for (const field of this.fieldsToSend) {
						dataToSend[field] = this.formData[field];
					}

					const { _method } = this.formData;
					dataToSend._method = _method;

					dataToSend = this.camelToSnake(dataToSend);
				} else {
					// Convert to snake_case data omitting pwConf
					const { pw_conf, ...toSend } = this.camelToSnake(this.formData);
					dataToSend = toSend;
				}

				const baseUri = this.useApiRoute ? this.store.apiUri : this.store.apiUri.slice(0, -4);
				axios[this.method](baseUri + this.route, {
					doctor_details: this.doctorInfo,
					...dataToSend,
				}, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true
				})
					.then(response => {
						// console.log('message sent', response.data);
						this.resetForm();
						this.sent = true;
					})
					.catch(err => {
						// console.log('catched error', err.response.data);
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
				if (this.name === 'messaggio' || this.name === 'recensione') this.sent = undefined;
				else if (this.name === 'nuovo profilo' || this.name === 'modifica di profilo') {
					this.sent = undefined;
					this.dashboardStore.currentProfileSectionComponentIndex = 0;
				}
			}
		},
		props: {
			apiRouteAndMethod: {
				required: true,
				validator(value) {
					if (value === undefined) return false;
					if (value === null) return true;
					const { route, method } = value
					return !!(route && method);
				}
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
			checkPrevValues: {
				type: Boolean,
			},
			perfectValidation: {
				type: Function,
			},
			formAction: {
				type: Function,
				require: false
			},
			doctorInfo: {
				type: [Object, null],
				required: true
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
			elementProps() {
				const computedEls = {};
				for (const [key, el] of Object.entries(this.elements)) {
					const { options, ...rest } = el;
					const flattenedEl = { ...rest, ...options };
					const isMultiselect = el.elementType === 'multiselect';

					computedEls[key] = {
						...flattenedEl,
						ref: isMultiselect ? 'multi' : null,
						class: [el.wrapperStyle, { 'invalid-input': this.errors[key], 'specializations-multiselect': isMultiselect, 'form-control': !isMultiselect }],
						initValue: isMultiselect ? this.formData[key] : null,
						size: el.size ? el.size * 1024 : null,
						nameAndConc: [el.label.toLowerCase(), el.fieldGenre = 'm' ? 'o' : 'a'],
						value: el.elementType === 'fileUpload' ? el.value : this.formData[key],
						rows: key === 'content' ? 3 : null
					}
				}

				return computedEls;
			},
			elementEvents() {
				const fData = this.formData;
				function inputTextareaSharedEvent(key) {
					return { input: event => fData[key] = event.target.value.trim() }
				}

				return {
					multiselect: key => ({
						sendValues: specializations => this.updateSpecs(specializations, this.formData, key)
					}),
					fileUpload: key => ({
						uploadedFile: file => this.updateFile(file, this.formData, this.errors, key)
					}),
					input: key => ({ ...inputTextareaSharedEvent(key) }),
					textarea: key => ({ ...inputTextareaSharedEvent(key) })
				}
			},
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
			route() {
				const { route } = this.apiRouteAndMethod;

				return route;
			},
			method() {
				const { method } = this.apiRouteAndMethod;

				return method;
			},
			useApiRoute() {
				const { useApiRoute = true } = this.apiRouteAndMethod;

				return useApiRoute;
			},
			fieldsToSend() {
				// Set to undefined outside ProfileEdit
				if (this.nameArtConc[0] !== 'modifica di profilo') return undefined;

				let send = [];
				let isChanged = false;

				for (const field in this.formData) {
					// Prevent logic for '_method'
					if (['_method', 'send'].includes(field)) continue;

					const value = this.formData[field];
					const previousValue = this.elements[field].value;

					if (field === 'specializationsId') {
						let allPreviousArePresent = true;
						let sameNumberOfSpecs = true;

						if (!value.every(({ name: spec }) => previousValue.some(({ name: prevSpec }) => spec === prevSpec))) allPreviousArePresent = false;
						if (!(value.length === previousValue.length)) sameNumberOfSpecs = false;

						if (!allPreviousArePresent || !sameNumberOfSpecs) isChanged = true;
					}
					else isChanged = value && value !== previousValue;

					if (isChanged) send.push(field);
				}

				return send;
			}
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
	<div class="form-frame container" :class="formFrameClass">
		<!-- Generic form element -->
		<form v-if="sent === undefined" @submit.prevent="formAction?.(formData) || validateForm()" novalidate
			:class="formClass">
			<div class="row" :class="wrapperInnerDiv">
				<h1 v-if="$slots.title">
					<slot name="title" />
				</h1>
				<p v-if="$slots.subtitle">
					<slot name="subtitle" />
				</p>

				<!-- /* Form fields */ -->
				<div class="mb-2" :class="el.wrapperStyle" v-for="(el, key) in elementProps">
					<!-- Vote field -->
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
					<!-- Multiselect, FileUpload, input and textarea fields -->
					<template v-else>
						<label :for="el.id" class="badge rounded-pill" :class="{ 'd-none': el.type === 'hidden' }">{{ el.label
						}}</label>
						<component :is="el.elementType" v-bind="el" v-on="elementEvents[el.elementType](key)" />
					</template>
					<!-- Box for single input's error message -->
					<div class="invalid" v-if="errors[key]">
						<p>{{ errors[key] }}</p>
					</div>
				</div>

				<!-- /* Buttons */ -->
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
						:class="{ 'disabled': validated }" :disabled="checkPrevValues && !fieldsToSend.length">
						<span v-if="name === 'nuovo profilo'">Crea</span>
						<span v-else>Modifica</span>
						profilo
					</button>
					<button type="button" id="reset-button" class="btn btn-warning ms-3" :class="{ 'disabled': validated }"
						@click.prevent="resetForm()">Pulisci
					</button>
				</div>
				<!-- Arbitrary buttons slot -->
				<slot name="buttons" :formData :resetForm />
			</div>
		</form>

		<Loader v-else-if="sent === null" />

		<!-- /* NOTIFICATIONS */ -->
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