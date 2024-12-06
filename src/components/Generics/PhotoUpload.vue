<script>
export default {
    props: ['modelValue'],
    methods: {
        onChange(event) {
            this.$emit('update:modelValue', event.target.files[0]);
        },
    },
};
</script>

<template>
    <input type="file" accept="image/png, image/jpeg" @change="onChange($event)">
</template>