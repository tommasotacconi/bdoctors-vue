<script>
import VueMultiselect from 'vue-multiselect';
import axios from 'axios';

export default {

    data() {
        return {
            value: [],
            options: ['Chirurgia', 'Cardiologia', 'Medicina Generale', 'Ginecologia', 'Urologia'],
        }
    },
    components: { VueMultiselect },
    methods: {
        // Get Specializations through API call
        getSpecializations() {

        },

        //send specializations to AppProfileEdit specializations's Array 
        sendValues() {
            if (this.value.length > 0) {
                console.log("sendValues works");
                console.log(this.value);
                this.$emit('send-values', this.value)
            }
        },

    },
}

</script>

<template>
    <!--- @update:modelValue: on every change inside specializations array, this will update the parent's array through custom events -->
    <div>
        <VueMultiselect v-model="value" :options="options" :multiple="true" :close-on-select="false"
            :clear-on-select="false" placeholder="Seleziona una o più specializzazioni" :show-labels="true"
            @update:modelValue="sendValues">
        </VueMultiselect>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped></style>