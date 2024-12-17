<script>
import axios from "axios";
import { store } from "../../../js/store";
import Multiselect from "../Generics/Multiselect.vue";
import PhotoUpload from "../Generics/PhotoUpload.vue";
import CvUpload from "../Generics/CvUpload.vue";
import AppAlert from "../Generics/AppAlert.vue";

export default {
    data() {
        return {
            formData: {
                //user_id: localStorage.getItem('user_id'),
                photo: null,
                curriculum: null,
                user_id: store.informationPageId
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
						isResponseStatusSuccess: false,
            store,
            profileData: {},
        }
    },
    components: {
        Multiselect,
        PhotoUpload,
        CvUpload,
				AppAlert
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
            axios.post('http://localhost:8000/api/profiles/' + this.store.informationPageId, this.formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(response => {
                    console.log('Response', response.data);
                    this.profileData = response.data.profile;
										this.isResponseStatusSuccess = true;
                    // Data da condividere all'interno degli altri componenti
                    //store.profileDataGeneral = response.data.data
                    //localStorage.setItem('user_id', response.data.data.doctor.id)
                })
                .catch(function (error) {
                    // handle error
                    console.error(error)
                })
                .finally(function () {
                    // always executed
                });
        },
				openProfile() {
            // Once the user's been redirected to his profile, the modal's backdrop disappears
            // const backdrop = document.querySelector('.modal-backdrop');
            // if (backdrop) {
            //     backdrop.remove();
            // }
            // redirect to user profile
            this.$router.push({ name: 'dashboard', params: { id: this.profileData.id } });
				}
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
    },
    created() {
        this.store.informationPageId = this.$route.params.id;
        console.log(store.informationPageId);
    }
}
</script>

<template>
    <div class="container py-3">
        <h1 class="text-center">Crea il tuo profilo</h1>

        <form action="" method="POST" class="row py-4 my-4" id="edit-form" @submit.prevent="validateForm" novalidate>

            <div class="mb-3 col-6">
                <label for="phone" class="form-label">Telefono</label>
                <input type="tel" class="form-control" :class="{ 'invalid-input': errors.phone }" id="phone"
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
            <div class="mb-3">
                <label for="services" class="form-label">Prestazioni</label>
                <textarea class="form-control" :class="{ 'invalid-input': errors.services }" id="services"
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
                    <button type="submit" class="btn me-2 btn-submit" data-bs-toggle="myModal :"
                        data-bs-target="myModal" :disabled="isResponseStatusSuccess">Crea profilo</button>
                    <button type="reset" class="btn btn-reset" :disabled="isResponseStatusSuccess">Reset</button>
            </div>

            <!-- Alert -->
						<div class="col-6" v-if="isResponseStatusSuccess">
							<AppAlert class="alert-success d-flex">
								<div class="col alert-body">
									I tuoi dati sono stati aggiornati.
								</div>
								<div class="alert-footer">
									<button type="button" class="btn btn-primary" @click="openProfile">
										Torna al profilo
									</button>
								</div>
							</AppAlert>
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

.alert-footer button{
	background-color: var(--color-complementary);
	border-color: var(--color-complementary);
}
</style>
