<script>
export default {
    name: 'CvUpload',
    // props: ['modelValue'],
    methods: {
        handleFileChange(event) {
            this.$emit('cv-selected', event.target.files[0]);
        },
    },
};
</script>

<template>
    <input type="file" accept=".doc, .pdf" @change="handleFileChange">
</template>