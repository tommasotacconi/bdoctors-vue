<script>
export default {
    name: 'PhotoUpload',
    methods: {
        handleFileChange(event) {
            this.$emit('file-selected', event.target.files[0]);
        },
    },
};
</script>

<template>
    <input type="file" accept="image/png, image/jpeg" @change="handleFileChange">
</template>