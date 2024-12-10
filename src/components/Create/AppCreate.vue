<script>
import axios from "axios";
import Multiselect from "../Generics/Multiselect.vue";
import PhotoUpload from "../Generics/PhotoUpload.vue";
import CvUpload from "../Generics/CvUpload.vue";

export default {
    data() {
        return {
            formData: {
                user_id: localStorage.getItem('user_id'),
                photo: null,
                curriculum: null,
            },
            apiUrl: 'http://127.0.0.1:8000/api/profiles',
            errors: {
                phone: "",
                office_address: "",
                services: "",
                photo: "",
                curriculum: ""
            },
            validated: false,
        }
    },
    components: {
        Multiselect,
        PhotoUpload,
        CvUpload
    },

    methods: {
        validateForm() {
            this.errors = [];
            if (!this.formData.phone) { this.errors.phone = "Il numero di telefono è obbligatorio." }
            else if (isNaN(this.formData.phone)) { this.errors.phone = "Il numero di telefono può contenere solo numeri" };
            if (!this.formData.office_address) this.errors.office_address = "L'indirizzo è obbligatorio.";
            if (!this.formData.services) this.errors.services = "Inserire almeno una prestazione.";
            if (!this.formData.photo) this.errors.photo = "La foto è obbligatoria";
            if (!this.formData.curriculum) this.errors.curriculum = "Il curriculum è obbligatorio.";
            if (!this.errors.length) {
                this.validated = true;
                if (this.validated = true) {
                    this.createProfile();
                }
            }
            console.log(this.formData);
            console.log(this.errors);
        },

        handlePhoto(photo) {
            this.formData.photo = photo;
        },

        handleCurriculum(curriculum) {
            this.formData.curriculum = curriculum;
        },
         //commento per commit 2
        createProfile() {
            axios.post('http://localhost:8000/api/profiles/' + this.formData.user_id, this.formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(response => {
                    console.log('Profile created', response.data)
                })
                .catch(function (error) {
                    // handle error
                    console.error(error)
                    console.log(error.response.data.errors);
                })
                .finally(function () {
                    // always executed
                });
        },


        // onPickFile() {
        //     this.$refs.fileInput.click()
        // },
        // onFilePicked(event) {
        //     const files = event.target.files
        //     let filename = files[0].name
        //     const fileReader = new FileReader()
        //     fileReader.addEventListener('load', () => {
        //         this.imageUrl = fileReader.result
        //     })
        //     fileReader.readAsDataURL(files[0])
        //     this.photo = files[0]
        // },


        mounted() {
        }
    },
}
</script>

<template>
    <div class="container py-3">
        <h1 class="text-center">Crea il tuo profilo</h1>

        <form action="" method="POST" class="row py-4 my-4" id="edit-form" @submit.prevent="validateForm" novalidate>

            <div class="mb-3 col-6">
                <label for="phone" class="form-label">Telefono</label>
                <input type="tel" class="form-control" :class="errors.phone && 'invalid-input'" id="phone"
                    v-model="formData.phone" required>
                <div class="invalid" v-if="errors.phone">
                    <p> {{ errors.phone }} </p>
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="office_address" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" :class="errors.office_address && 'invalid-input'"
                    id="office_address" v-model='formData.office_address' required>
                <div class="invalid" v-if="errors.office_address">
                    <p> {{ errors.office_address }} </p>
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="services" class="form-label">Prestazioni</label>
                <textarea class="form-control" :class="errors.services && 'invalid-input'" id="services"
                    v-model="formData.services" required></textarea>
                <div class="invalid" v-if="errors.services">
                    <p> {{ errors.services }} </p>
                </div>
            </div>
            <div class="mb-3 d-flex flex-column col-6">
                <label for="photo" class="form-label">Foto profilo</label>
                <PhotoUpload v-model="formData.photo" @file-selected="handlePhoto"></PhotoUpload>
                <div>
                    <p> {{ errors.photo }} </p>
                </div>
            </div>
            <div class="mb-3 d-flex flex-column col-6">
                <label for="curriculum" class="form-label">Curriculum
                    Vitae</label>
                <CvUpload v-model="formData.curriculum" @cv-selected="handleCurriculum"></CvUpload>
                <div class="invalid" v-if="errors.curriculum">
                    <p> {{ errors.curriculum }} </p>
                </div>
            </div>

            <div class="mb-3">
                <!-- <button type="submit" class="btn me-2 btn-submit">Modifica</button>
                    <button type="reset" class="btn btn-reset">Reset</button> -->
                <button type="submit" class="btn me-2 btn-submit" data-bs-toggle="myModal" data-bs-target="myModal">Crea
                    Profilo</button>
                <button type="reset" class="btn btn-reset">Reset</button>
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
