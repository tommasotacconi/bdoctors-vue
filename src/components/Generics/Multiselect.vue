<script>
	import VueMultiselect from 'vue-multiselect';
	import axios from 'axios';
	import { store } from '../../../js/store';

	export default {

		data() {
			return {
				value: null,
				options: [],
				maxHeight: 150,
				store
			}
		},
		props: {
			initValue: {
				type: Array,
				required: false,
			},
		},
		components: { VueMultiselect },
		methods: {
			// Get Specializations through API call
			getSpecializations() {
				return axios.get(this.store.apiUri + 'specializations')
					.then(response => {
						this.options = response.data.specializations;
					})
					.catch(function (err) {
						// console.log('multiselect\'s error GET /api/specialization: ', err);
					});
			},
			addIdTo(value) {
				const noIdSpecializations = value.filter(({ id }) => !id);

				return noIdSpecializations.map(el => this.options.find(({ name: scannedName }) => scannedName === el.name))
			},
			reset() {
				this.value = [];
			}
		},
		emits: ['sendValues'],
		watch: {
			value(newValue) {
				this.$emit('sendValues', newValue)
			}
		},
		async created() {
			await this.getSpecializations();
			this.value = this.addIdTo(this.initValue)
		},
	}

</script>

<template>
	<!--- @update:modelValue: on every change inside specializations array, this will update the parent's array through custom events -->
	<div>
		<VueMultiselect v-model="value" :options :multiple="true" :close-on-select="false" :max-height
			:clear-on-select="false" track-by="name" label="name" placeholder="Seleziona una o più specializzazioni"
			:show-labels="true">
		</VueMultiselect>
	</div>
</template>
<style lang="scss">
	@use "../../styles/variables" as v;
	@import 'vue-multiselect/dist/vue-multiselect.min.css';

	.multiselect__placeholder {
		font-size: v.$font-size-base;

		padding: {
			top: 0;
			left: 5px;
		}

		;
		line-height: 1;
	}

	.multiselect__tag {
		background-color: var(--color-secondary);
	}

	.multiselect--active {
		z-index: auto;
	}
</style>