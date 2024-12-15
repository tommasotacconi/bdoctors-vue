<script>
import VueMultiselect from 'vue-multiselect';
import axios from 'axios';

export default {

    data() {
        return {
            value: this.specializations,
            options: [],
            apiUrl: "http://127.0.0.1:8000/api/specializations"
        }
    },
    props: {
        specializations: {
            type: Array,
            required: true,
        }
    },
    components: { VueMultiselect },
    methods: {

        // Get Specializations through API call
        getSpecializations() {
            axios.get(this.apiUrl)
                .then(response => {
									this.options = response.data.specializations;
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        },

        //send specializations to AppProfileEdit specializations's Array 
        sendValues() {
            if (this.value.length > 0) {
                console.log("sendValues works");
                console.log(this.value);
                this.$emit('send-values', this.value)
            }
        },
        // method to show only the specialization name as options (multiselect)
        nameOnly({ name }) {
            return `${name}`
        },

    },
    mounted() {
        this.getSpecializations();
    },
}

</script>

<template>
    <!--- @update:modelValue: on every change inside specializations array, this will update the parent's array through custom events -->
    <div>
        <VueMultiselect v-model="value" :options="options" :multiple="true" :close-on-select="false"
            :clear-on-select="false" track-by="name" placeholder="Seleziona una o più specializzazioni"
            :show-labels="true" @update:modelValue="sendValues" :custom-label="nameOnly">
        </VueMultiselect>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">
.invalid-input {
    border-color: red;
}
</style>