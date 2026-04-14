<script>
	import { store } from "../../../../../js/store.js";
	import { dashboardStore } from "../../../../../js/dashboardStore.js";
	import { emitter } from "../../../../../js/eventBus.js";
	import AppForm from "../../../Generics/AppForm.vue";
	import FormField from "../../../../../js/utils/FormField.js";
	import { useDefaultValidation } from "../../../../../js/composables/useDefaultValidation.js";

	export default {
		data() {
			return {
				// List of all form all elements to select from the singular form  
				formElements: {
					firstName: new FormField('first-name-input', 'input', 'Nome', { t: 'text', v: dashboardStore.tmp.first_name, d: true, wS: 'col-md-6' }),
					lastName: new FormField('last-name-input', 'input', 'Cognome', { t: 'text', v: dashboardStore.tmp.last_name, d: true, wS: 'col-md-6' }),
					phone: new FormField('phone-input', 'input', 'Telefono d\'ufficio', { t: 'phone', p: '+39 333.../333...', wS: 'col-md-6' }),
					officeAddress: new FormField('office-address-input', 'input', 'Indirizzo d\'ufficio', { t: 'text', p: 'Piazza/Via...', r: true, wS: 'col-md-6' }),
					services: new FormField('services-input', 'textarea', 'Prestazioni erogate', { p: 'Indicare le prestazioni prefissandole con un asterisco', fGN: ['f', 'p'], r: true, wS: 'col-md-12' }),
					photo: new FormField('photo-input', 'fileUpload', 'Foto profilo', { a: 'image/jpeg,image/png,imgage/jpg,application/pdf', fGN: ['f', 's'], s: 2048, wS: 'col-md-6' }),
					curriculum: new FormField('curriculum-input', 'fileUpload', 'Curriculum', { a: 'application/pdf,text/plain', s: 2048, wS: 'col-md-6' }),
				},
				triggerPersistedForm: 0,
				store,
				dashboardStore,
			}
		},
		components: {
			AppForm,
		},
		methods: {
			/**
			 * 
			 * @param data Form data 
			 * @param els Form elements 
			 * @param errs Form errors
			 */
			validate(data, els, errs) {
				for (const field in data) {
					// Prevent logic for 'type=hidden' and 'disabled' element
					if (els[field].disabled || els[field].type === 'hidden' || errs[field]) continue;

					const value = data[field];
					const label = els[field].label;
					const result = this['validate' + field[0].toUpperCase() + field.slice(1)](value, label);
					if (result) errs[field] = result;
				}
			},
			handleSuc(res) {
				const action = () => this.dashboardStore.currentProfileSectionComponentIndex = 0;
				this.triggerAlert(res.data.message, this.dashboardStore.headerHeight + 10, undefined, {
					txt: 'Visualizza',
					action
				});
				this.dashboardStore.profileDataGeneral = res.data.profile;
				emitter.emit('reset-dashboard-header');
			},
			handleErr({ status, response: res }) {
				this.triggerAlert(res.data.message, this.dashboardStore.headerHeight + 10, 'warning');
				this.triggerPersistedForm++;
				// this.showAlert = true;
			}
		},
		computed: {
			nameArtConc() {
				return ['creazione di profilo', 'la', 'a'];
			},
		},
		inject: ['triggerAlert', /* 'triggerPersistedForm' */],
		setup() {
			const { validatePhone, validateOfficeAddress, validateServices, validatePhoto, validateCurriculum } = useDefaultValidation();

			return { validatePhone, validateOfficeAddress, validateServices, validatePhoto, validateCurriculum };
		},
	}
</script>

<template>
	<div class="container py-3">
		<header class="page-header row">
			<div class="col-2 align-items-center">
				<button class="btn back-arrow" @click="dashboardStore.currentProfileSectionComponentIndex = 0">
					<i class="fa-solid fa-circle-arrow-left fa-xl"></i></button>
			</div>
			<h1 class="col-8 text-center">Crea il tuo profilo</h1>
		</header>

		<!-- Form -->
		<AppForm class="user-data-form" id="" :doctorInfo="null" :apiRouteAndMethod="{ route: 'profiles', method: 'post' }"
			:elements="formElements" :nameArtConc :wrapperInnerDiv="['row']" :perfectValidation="validate"
			:triggerPersistedForm @success="handleSuc" @error="handleErr">
			<template v-slot:submitBtnTxt>Crea profilo</template>
		</AppForm>
	</div>
</template>

<style scoped lang="scss">
	@use '../../../../styles/forms';

	header {
		margin-bottom: 30px;

		h1 {
			margin-bottom: 0;
		}
	}

	.btn.back-arrow {
		width: 60px;
		padding: 10px 0;
		background-color: var(--color-primary);
		transition: 0.4s;

		&:hover {
			color: var(--color-secondary);
		}
	}

	.btn-submit {
		background-color: var(--color-secondary);
	}

	.btn-reset {
		background-color: var(--color-tertiary);
		color: white;

		&:hover {
			color: black;
		}
	}

	.alert-footer button {
		background-color: var(--color-complementary);
		border-color: var(--color-complementary);
	}

	:deep() {
		form {
			@include forms.set-fields-color(var(--color-secondary));

			textarea {
				height: 200px;
			}
		}
	}
</style>
