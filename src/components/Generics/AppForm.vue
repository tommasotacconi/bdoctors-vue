<script>
	import axios from 'axios';
	import { store } from '../../../js/store';
	import Multiselect from './Multiselect.vue';
	import FileUpload from './FileUpload.vue';
	import { dashboardStore } from '../../../js/dashboardStore';

	function Result(status, payload) {
		this.status = status;
		this.payload = payload;
	}

	export default {
		data() {
			return {
				formData: {},
				errors: {},
				validated: false,
				sent: undefined,
				requestStatus: null,
				store,
				dashboardStore,
				minHeight: 0,
			}
		},
		methods: {
			updateSpecs(specializations, formData, key) {
				// Prepare a constant array result to insert ids value
				const result = [];
				// Insert ids taken from specializations parameter in reactive variable specializations, property of errors 
				for (let i = 0; i < specializations.length; i++) {
					result.push(specializations[i].id);
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
					if (key === 'specializations') this.$data.formData[key] = eventualValue ? eventualValue : [];
					else if (['vote', 'revsNum'].includes(key)) this.$data.formData[key] = null;
					else this.$data.formData[key] = eventualValue;
					this.$data.errors[key] = '';
				}
			},
			// validateEmail(email) {
			// 	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			// 	return re.test(email)
			// },
			evaluateArt(strings, genreNumber, label) {
				const genNumObj = {
					m: { s: ['il', 'lo', 'l\''], p: ['gli', 'i'] },
					f: { s: ['la', 'l\''], p: 'le' }
				};
				const [gen, num] = genreNumber;
				let art = genNumObj[gen][num];

				let subCaseInd = 0;
				if (gen === 'm') {
					if (num === 's' && 'aeiou'.includes(label[0].toLowerCase())) {
						subCaseInd = 2;
					} else {
						const consonants = [...'bcdfghlmnpqrstvz'];
						// 'lo' 'i' cases depends on the initial letters of the word
						const cases = ['z', ...consonants.map(con => 's' + con), 'gn', 'ps', 'pn', 'x', 'y'];
						const isACase = cases.some(el => label.slice(0, el.length).includes(el));
						if (isACase) subCaseInd = 1;
					}
				} else {
					if (num === 's' && 'aeiou'.includes(label[0].toLowerCase())) subCaseInd = 1;
				}
				if (typeof art === 'object') art = art[subCaseInd];

				return `${strings[0]} ${art}${subCaseInd === 2 ? '' : ' '}${label.toLowerCase()}`;
			},
			validateForm() {
				this.resetErrors();
				// Set errors if any
				for (const field in this.formData) {
					// Prevent validation on set up properties
					if (['_method'].includes(field)) continue;

					const value = this.formData[field];
					const el = this.elements[field];

					// Check that field is not required, enabled or hidden
					if (!el.required || el.disabled || el.hidden || el.type === 'hidden') continue;

					if (!value || value instanceof Array && !value.length) {
						this.errors[field] = this.evaluateArt`Inserisci ${el.fieldGenreNumber} ${el.label}`;
						console.log(this.errors[field])
					}
				}
				// Run custom validation function if any
				if (this.perfectValidation) this.perfectValidation(this.formData, this.elements, this.errors, this.sendOnlyChanged);
				// Check form validity by errors' presence
				let isValid = true;
				for (const field in this.formData) {
					if (this.errors[field]) isValid = false;
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
					else if (key === 'specializations') {
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
				let dataToSend = {};

				// Use computed 'sendOnlyChanged' to determine if there are only some data to send
				if (this.sendOnlyChanged) {
					for (const field of this.sendOnlyChanged) {
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
					.then(res => new Result(res.status, res))
					.catch(err => new Result(err.status, err))
					.then(({ status, payload }) => {
						this.requestStatus = status;
						this.sent = true;
						if (status < 400) this.resetForm();
						this.$emit(this.requestStatus < 400 ? 'success' : 'error', payload);
					});
				this.sent = null;
			},
			camelToSnake(obj) {
				const result = {};
				for (const [key, value] of Object.entries(obj)) {
					const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
					result[snakeKey] = value;
				}

				return result;
			},
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
				required: false
			},
			submitBtnTxt: {
				type: String,
			},
			doctorInfo: {
				type: [Object, null],
				required: true
			},
			// preventNotDisplayedBtns: {
			// 	type: Boolean,
			// 	required: false
			// },
			triggerPersistedForm: {
				type: Number,
			},
			formFrameStyle: {
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
		emits: ['success', 'error'],
		computed: {
			elementsProps() {
				const computedEls = {};
				for (const [key, el] of Object.entries(this.elements)) {
					const { options, ...rest } = el;
					const flattenedEl = { ...rest, ...options };
					const isMultiselect = el.elementType === 'multiselect';

					computedEls[key] = {
						...flattenedEl,
						ref: isMultiselect ? 'multi' : null,
						class: [el.wrapperStyle, { 'invalid-input': this.errors[key], 'form-control': !isMultiselect }],
						initValue: isMultiselect ? this.formData[key] : null,
						size: el.size ? el.size * 1024 : null,
						nameAndConc: [el.label.toLowerCase(), el.fieldGenre === 'm' ? 'o' : 'a'],
						value: el.elementType === 'fileUpload' ? el.value : this.formData[key],
						rows: key === 'content' ? 3 : null
					}
					// console.log(computedEls);
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
			sendOnlyChanged() {
				let send = [];
				let isChanged = false;

				for (const field in this.formData) {
					// Prevent logic for '_method'
					if (['_method', 'send'].includes(field)) continue;

					const el = this.elements[field];
					const value = this.formData[field];
					const previousValue = this.elements[field].value;

					if (this.checkPrevValues) {
						if (field === 'specializations') {
							let allPreviousArePresent = true;
							let sameNumberOfSpecs = true;

							if (!value.every(id => previousValue.some(({ id: prevId }) => id === prevId))) allPreviousArePresent = false;
							if (!(value.length === previousValue.length)) sameNumberOfSpecs = false;

							if (!allPreviousArePresent || !sameNumberOfSpecs) isChanged = true;
						}
						else isChanged = value && value !== previousValue;
					} else isChanged = !el.disabled && !el.hidden && el.type !== 'hidden' && !!value

					if (isChanged) send.push(field);
				}

				return send;
			},
			isAccOrRegForm() {
				return ['registrazione', 'accesso'].includes(this.name);
			},
			isMesOrRevForm() {
				return ['messaggio', 'recensione'].includes(this.name);
			},
			isCreateEditProfForm() {
				return ['creazione di profilo', 'modifica di profilo'].includes(this.name);
			}
		},
		components: {
			Multiselect,
			FileUpload
		},
		watch: {
			triggerPersistedForm() {
				this.sent = undefined;
				this.validated = false;
			}
		},
		created() {
			this.createFormData();
		},
		mounted() {
			this.minHeight = window.getComputedStyle(this.$refs['form-frame']).height;
		}
	}
</script>

<template>
	<div ref="form-frame" class="form-frame container" :style="{ minHeight, ...formFrameStyle }">
		<!-- Generic form element -->
		<form v-if="sent !== true" @submit.prevent="formAction?.(formData)?.noValidation || validateForm()" novalidate
			:class="{ 'd-none': sent === null, ...formClass }">
			<div class="row" :class="wrapperInnerDiv">
				<h1 v-if="$slots.title">
					<slot name="title" />
				</h1>
				<p v-if="$slots.subtitle">
					<slot name="subtitle" />
				</p>

				<!-- /* Form fields */ -->
				<div class="mb-2" :class="el.wrapperStyle" v-for="(el, key) in elementsProps">
					<!-- Vote field -->
					<template v-if="key === 'vote'">
						<label class="badge rounded-pill">{{ el.label }}</label>
						<div class="form-control text-center vote" :class="{ 'invalid-input': errors[key] }">
							<template v-for="opt in el.radioGroupOptions.toReversed()">
								<input :id="el.id + opt" :value="opt" v-model.trim="formData[key]" :type="el.type">
								<label :for="el.id + opt" class="form-label stethoscope"><i class="fa-solid fa-stethoscope"></i></label>
							</template>
						</div>
					</template>
					<!-- Multiselect, FileUpload, input and textarea fields -->
					<template v-else>
						<label :for="el.id" class="badge rounded-pill"
							:class="{ 'd-none': el.type === 'hidden', 'move-top': el.disabled }">{{ el.label
							}}</label>
						<component :is="el.elementType" v-bind.trim="el" v-on="elementEvents[el.elementType](key)" />
					</template>
					<!-- Box for single input's error message -->
					<div class="error-msg" v-if="errors[key]">
						<p>{{ errors[key] }}</p>
					</div>
				</div>

				<!-- /* Buttons */ -->
				<div v-if="!$slots.buttons"
					:class="['buttons-wrapper', { 'mt-3': !isMesOrRevForm, 'mt-4': isMesOrRevForm, 'text-center': isMesOrRevForm }]">
					<button type="submit" class="btn btn-primary btn-submit"
						:class="{ 'disabled': validated, 'mx-auto': isAccOrRegForm, 'mx-auto': isMesOrRevForm }"
						:disabled="sendOnlyChanged && !sendOnlyChanged.length">
						{{ submitBtnTxt ?? 'Invia' }}
						<!-- <span v-if="isMesOrRevForm">Invia {{ name.toLowerCase() }}</span>
						<span v-else-if="isAccOrRegForm">{{ name === 'registrazione' ? 'Registrati' : 'Accedi' }}</span>
						<span v-else>{{ name.includes('creazione') ? 'Crea' : 'Modifica' }}profilo</span> -->
					</button>
					<button v-if="isCreateEditProfForm" type="button" id="reset-button" class="btn btn-warning ms-3"
						:class="{ 'disabled': validated }" @click.prevent="resetForm()">Pulisci</button>
				</div>
				<!-- Arbitrary buttons slot -->
				<slot name="buttons" :formData :resetForm />
			</div>
		</form>

		<Loader v-show="sent === null" />
		<i v-if="sent && requestStatus < 400" class="fa-solid fa-circle-check fa-2xl text-success"></i>
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