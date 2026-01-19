<script>
	function constructPlaceholder(name, conc) {
		return `Nessun${conc === 'a' ? conc : ''} ${name ? name : 'file'} presente nel database`;
	}

	export default {
		data() {
			return {
				prevValue: ''
			};
		},
		methods: {
			handleFileChange(event) {
				const fileChecked = event.target.files[0];
				if (!fileChecked) return this.$emit('uploadedFile', null);

				const allowedTypes = this.accept.split(',').map(t => t.trim());
				const isTypeAllowed =
					this.accept === '' ||
					allowedTypes.some(type => type.endsWith('/*')
						? fileChecked.type.startsWith(type.replace('/*', ''))
						: fileChecked.type === type
					);
				const isSizeAllowed = fileChecked.size < this.size;

				if (isTypeAllowed && isSizeAllowed) this.$emit('uploadedFile', fileChecked);
				else this.$emit('uploadedFile', false);
			},
			constructPlaceholder
		},
		props: {
			nameAndConc: {
				type: Array,
				validator(value, props) {
					const [fileName, concordance] = value;
					if (fileName && concordance === 'o' || concordance === 'a') return true;
				},
				default: ['file', 'o'],
			},
			accept: {
				type: String,
			},
			size: {
				type: Number,
			},
			value: {
				type: String,
			},
			showPrevValue: {
				type: Boolean,
			}
		},
		emits: ['uploadedFile'],
		created() {
			this.prevValue = this.value;
		}
	}
</script>

<template>
	<input v-bind="$attrs" type="file" :accept @change="handleFileChange">
	<input v-bind="$attrs" :value="prevValue ? prevValue : constructPlaceholder(nameAndConc[0], nameAndConc[1])"
		type="text" disabled :hidden="!showPrevValue">
</template>