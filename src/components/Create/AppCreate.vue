<script>
import axios from "axios";
import Multiselect from "../Generics/Multiselect.vue";

export default {
    data() {
        return {
            formData: {
                phone: "",
                officeAddress: "",
                services: "",
                photo: null,
                curriculum: null,
            },
            apiUrl: "http://127.0.0.1:8000/api/profiles",
            errors: {
                phone: "",
                officeAddress: "",
                services: "",
                photo: "",
                curriculum: ""
            },
            validated: false,
        }
    },
    components: {
        Multiselect,
    },

    methods: {
        validateForm() {
            this.errors = [];
            if (!this.formData.phone) { this.errors.phone = "Il numero di telefono è obbligatorio." }
            else if (isNaN(this.formData.phone)) { this.errors.phone = "Il numero di telefono può contenere solo numeri" };
            if (!this.formData.officeAddress) this.errors.officeAddress = "L'indirizzo è obbligatorio.";
            if (!this.formData.services) this.errors.services = "Inserire almeno una prestazione.";
            if (!this.formData.photo) this.errors.photo = "La foto è obbligatoria";
            if (!this.formData.curriculum) this.errors.curriculum = "Il curriculum è obbligatorio.";
            if (!this.errors.length) {
                this.validated = true;
                if (this.validated = true) {

                    axios.post(this.apiUrl, this.formData)
                        .then(response => {
                            this.formData = response.data;
                            console.log(response);
                        })
                        .catch(function (error) {
                            // handle error
                            console.error(error);
                        })
                        .finally(function () {
                            // always executed
                        });
                }
            }
            console.log(this.formData);
            console.log(this.errors);
        },

        onPhotoPicked(event) {
            const files = event.target.files
            this.photo = files[0];
        },

        onCvPicked(event) {
            const files = event.target.files
            this.curriculum = files[0];
        },
        // onFilePicked(event) {
        //     const files = event.target.files
        //     let filename = files[0].name
        //     const fileReader = new FileReader()
        //     fileReader.onload = () => {
        //         this.imageUrl = fileReader.result;
        //     };
        //     fileReader.readAsDataURL(filename)
        //     this.image = filename;
        //     console.log(this.image);
        // },


        mounted() {
            axios.get(this.apiUrl)
                .then(response => {
                    this.formData;
                    console.log('Success', response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.error('Failed', error);
                })
                .finally(function () {
                    // always executed
                });
        }
    },
}
</script>

<template>
    <div class="container py-3">
        <h1 class="text-center">Crea il tuo profilo</h1>

        <form action="" method="PUT" class="row py-4 my-4" id="edit-form" @submit.prevent="validateForm" novalidate>

            <div class="mb-3 col-6">
                <label for="phone" class="form-label">Telefono</label>
                <input type="tel" class="form-control" :class="{ 'invalid-input': errors.phone }" id="phone"
                    v-model="formData.phone" required>
                <div class="invalid" v-if="errors.phone">
                    <p> {{ errors.phone }} </p>
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="officeAddress" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" :class="{ 'invalid-input': errors.officeAddress }"
                    id="officeAddress" v-model='formData.officeAddress' required>
                <div class="invalid" v-if="errors.officeAddress">
                    <p> {{ errors.officeAddress }} </p>
                </div>
            </div>
            <div class="mb-3">
                <label for="services" class="form-label">Prestazioni</label>
                <textarea class="form-control" :class="{ 'invalid-input': errors.services }" id="services"
                    v-model="formData.services" required></textarea>
                <div class="invalid" v-if="errors.services">
                    <p> {{ errors.services }} </p>
                </div>
            </div>
            <div class="mb-3">
                <label for="photo" class="form-label">Foto profilo</label>

                <input type="file" accept="image/*" @change="onPhotoPicked" />
                <div class="invalid" v-if="errors.photo">
                    <p> {{ errors.photo }} </p>
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="curriculum" class="form-label">Curriculum
                    Vitae</label>
                <input type="file" accept="file_extension|image/*|.pdf" @change="onCvPicked" />
                <div class="invalid" v-if="errors.curriculum">
                    <p> {{ errors.curriculum }} </p>
                </div>
                <div class="mb-3">
                    <!-- <button type="submit" class="btn me-2 btn-submit">Modifica</button>
                    <button type="reset" class="btn btn-reset">Reset</button> -->
                    <button type="submit" class="btn me-2 btn-submit" data-bs-toggle="myModal"
                        data-bs-target="myModal">Crea profilo</button>
                    <button type="reset" class="btn btn-reset">Reset</button>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="myModal" tabindex="-1" aria-hidden="true" v-if="validated">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="myModal"
                                aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            I tuoi dati sono stati aggiornati.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="openProfile">
                                Torna al profilo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </form>
    </div>

</template>

<style scoped lang="scss">
#edit-form,
#errors {
    border: 1px solid;
    border-radius: 20px;
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

.invalid {
    color: red;
}

.invalid-input {
    border-color: red;
}
</style>
