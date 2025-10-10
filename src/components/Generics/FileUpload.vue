<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			handleFileChange(event) {
				const fileChecked = event.target.files[0];
				if (!fileChecked) return this.$emit('uploadedNewFile', null);

				const allowedTypes = this.accept.split(',').map(t => t.trim());
				const isTypeAllowed =
					this.accept === '' ||
					allowedTypes.some(type =>
						type.endsWith('/*')
							? fileChecked.type.startsWith(type.replace('/*', ''))
							: fileChecked.type === type
					);
				const isSizeAllowed = fileChecked.size < this.size;

				if (isTypeAllowed && isSizeAllowed) this.$emit('uploadedNewFile', fileChecked);
				else this.$emit('uploadedNewFile', false);
			},
		},
		props: {
			accept: {
				type: String,
			},
			size: {
				type: Number,
			}
		},
		emits: ['uploadedNewFile']
	};
</script>

<template>
	<input type="file" :accept @change="handleFileChange">
</template>