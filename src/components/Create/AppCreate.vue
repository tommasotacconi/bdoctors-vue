<script>
import axios from "axios";
import Multiselect from "../Generics/Multiselect.vue";
import PhotoUpload from "../Generics/PhotoUpload.vue";
import CvUpload from "../Generics/CvUpload.vue";

export default {
    data() {
        return {
            formData: {
                user_id: 252,
                photo: 'https://it.images.search.yahoo.com/search/images;_ylt=AwrLAD51f1Bn3wABKk7c5olQ;_ylu=Y29sbwNpcjIEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?p=bender+foto&fr2=piv-web&type=E210IT1590G0&fr=mcafee&guccounter=1#id=0&iurl=https%3A%2F%2Fexternal-preview.redd.it%2F5GA8Zk4JnsMRR88HcZPb402OPXShU3cb05CYZbY7p4g.jpg%3Fauto%3Dwebp%26s%3D40ae96faadffd9bc008c03dc7de21ba4d7c8ae0d&action=click',
                curriculum: "asasasaasddfsdgvfdsdsffffgfsdgsdggsdgsdgsdasdfasfasfasffffffffffffffffffasasasaasddfsdgvfdsdsffasasasaasddfsdgvfdsdsffffgfsdgdsgdsgasasasaasddfsdgvfdsdsffffgfsdgdsgdsgsdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgssdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgsffgfsdgdsgdsgsdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgsgsdgsdgsdgsggsasa",
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
            // if (!this.formData.photo) this.errors.photo = "La foto è obbligatoria";
            // if (!this.formData.curriculum) this.errors.curriculum = "Il curriculum è obbligatorio.";
            if (!this.errors.length) {
                this.validated = true;
                if (this.validated = true) {
                    axios.post(this.apiUrl, this.formData)
                        .then(response => {
                            console.log('Success', response.data);
                        })
                        .catch(error => {
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
            axios.get(this.apiUrl)
                .then(response => {
                    this.formData;
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
            <div class="mb-3">
                <label for="photo" class="form-label">Foto profilo</label>
                <PhotoUpload v-model="formData.photo"></PhotoUpload>
                <!-- <input type="text" class="form-control" :class="errors.photo && 'invalid-input'" id="photo"
                    placeholder="Inserisci un file valido" @change="formData.photo" required> -->
                <div class="invalid" v-if="errors.photo">
                    <p> {{ errors.photo }} </p>
                </div>
            </div>
            <div class="mb-3">
                <label for="curriculum" class="form-label">Curriculum
                    Vitae</label>
                <CvUpload v-model="formData.curriculum"></CvUpload>
                <!-- <input type="text" class="form-control" :class="errors.curriculum && 'invalid-input'" id="curriculum"
                    placeholder="Inserisci un file valido" @change="formData.curriculum" required> -->
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
