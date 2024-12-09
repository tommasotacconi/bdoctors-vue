<script>
export default {
    name: 'CvUpload',
    // props: ['modelValue'],
    methods: {
        onChange(event) {
            this.$emit('file-selected', event.target.files[0]);
        },
    },
};
</script>

<template>
    <input type="file" accept=".doc, .pdf" @change="onChange">
</template>