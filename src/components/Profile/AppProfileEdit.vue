<script>
import axios from "axios";
import Multiselect from "../Generics/Multiselect.vue";
import PhotoUpload from "../Generics/PhotoUpload.vue";
import CvUpload from "../Generics/CvUpload.vue";


export default {
    data() {
        return {
            formData: {
                user_id: 250,
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone: "",
                office_address: "",
                oldSpecializations: [],
                specializations: [],
                services: "",
                photo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/Bender_Rodriguez.png/220px-Bender_Rodriguez.png",
                curriculum: "asasasaasddfsdgvfdsdsffffgfsdgsdggsdgsdgsdasdfasfasfasffffffffffffffffffasasasaasddfsdgvfdsdsffasasasaasddfsdgvfdsdsffffgfsdgdsgdsgasasasaasddfsdgvfdsdsffffgfsdgdsgdsgsdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgssdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgsffgfsdgdsgdsgsdgsdgsdgsdgsdgsdgsdgsdgdsgsdgsdgsdgsgsdgsdgsdgsggsasa",
            },
            apiUrl: "http://127.0.0.1:8000/api/profiles/edit/248",
            errors: {
                first_name: '',
                last_name: "",
                email: "",
                password: "",
                phone: "",
                office_address: "",
                specializations: '',
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
        // updateForm() {

        //     axios.post('/user', this.formData)
        //         .then((response) => {
        //             console.log(response);
        //             console.log("success", response);
        //         })
        //         .catch((error) => {
        //             this.errors = response.result.errors;
        //             console.log(response.result.errors);
        //         });

        //     redirect
        //     this.$router.push({ name: 'routename' })
        // },

        validateForm() {
            this.errors = [];
            if (!this.formData.first_name) {
                this.errors.first_name = 'Il nome è obbligatorio.';
            } else if (this.formData.first_name.length <= 2) {
                this.errors.first_name = 'Il nome deve contenere almeno 3 caratteri.';
            };
            if (!this.formData.last_name) {
                this.errors.last_name = "Il cognome è obbligatorio."
            } else if (this.formData.last_name.length <= 2) {
                this.errors.last_name = "Il cognome deve contenere almeno 3 caratteri."
            };
            if (!this.formData.email) {
                this.errors.email = "L'email è obbligatoria.";
            } else if (!this.validEmail(this.formData.email)) {
                this.errors.email = "L'email inserita non è valida.";
            }
            if (!this.formData.password) { this.errors.password = "La password è obbligatoria." }
            else if (!this.validPassword(this.formData.password)) { this.errors.password = "La password deve contenere almeno una maiuscola, una minuscola ed un numero" };
            if (!this.formData.phone) { this.errors.phone = "Il numero di telefono è obbligatorio." }
            else if (isNaN(this.formData.phone)) { this.errors.phone = "Il numero di telefono può contenere solo numeri" };
            if (!this.formData.office_address) this.errors.office_address = "L'indirizzo è obbligatorio.";
            if (!this.formData.specializations) this.errors.specializations = "Inserire almeno una specializzazione.";
            if (!this.formData.services) this.errors.services = "Inserire almeno una prestazione.";
            // if (!this.formData.photo) this.errors.photo = "La foto è obbligatoria";
            // if (!this.formData.curriculum) this.errors.curriculum = "Il curriculum è obbligatorio.";

            if (!this.errors.length) {
                this.validated = true;

                if (this.validated = true) {
                    axios.put(this.apiUrl, this.formData)
                        .then(response => {
                            console.log('Profile updated', response.data)

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
        validEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        validPassword(password) {
            const lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            let isLowercase = false;
            let isUppercase = false;
            let isNumber = false;

            for (let i = 0; i < password.length; i++) {
                const char = password[i];
                if (lowercase.includes(char)) isLowercase = true;
                if (uppercase.includes(char)) isUppercase = true;
                if (numbers.includes(char)) isNumber = true;
            }

            return isLowercase && isUppercase && isNumber;
        },

        updateSpecs(specializations) {
            this.formData.specializations = specializations;
            console.log(this.formData.specializations);
        },
    },
    computed: {
        openProfile() {
            // Once the user's been redirected to his profile, the modal's backdrop disappears
            // const backdrop = document.querySelector('.modal-backdrop');
            // if (backdrop) {
            //     backdrop.remove();
            // }
            // redirect to user profile
            this.$router.push('/user/:id');
        }
    },
    created() {
        axios.get(this.apiUrl, this.formData)
            .then(response => {
                this.formData = response.data.data;
                this.formData.first_name = response.data.data.doctor.first_name;
                this.formData.last_name = response.data.data.doctor.last_name;
                this.formData.email = response.data.data.doctor.email;
                this.formData.password = response.data.data.doctor.password;
                this.formData.oldSpecializations = response.data.data.doctor.specializations;

                console.log(response)
                console.log('formData after call', this.formData);
            })
            .catch(function (error) {
                // handle error
                console.error("failed", error);
            })
            .finally(function () {
                // always executed
            });
    },
}

</script>

<template>
    <div class="container py-3">
        <h1 class="text-center">Modifica le tue informazioni</h1>

        <form action="" method="PUT" class="row py-4 my-4" id="edit-form" @submit.prevent="validateForm" novalidate>

            <div class="mb-3 col-4">
                <label for="first_name" class="form-label">Nome</label>
                <input type="text" class="form-control" :class="{ 'invalid-input': errors.first_name }" id="first_name"
                    v-model="formData.first_name" required>
                <div class="invalid" v-if="errors.first_name">
                    <p> {{ errors.first_name }} </p>
                </div>
            </div>
            <div class="mb-3 col-4">
                <label for="last_name" class="form-label">Cognome</label>
                <input type="text" class="form-control" :class="{ 'invalid-input': errors.last_name }" id="last_name"
                    v-model="formData.last_name" required>
                <div class="invalid" v-if="errors.last_name">
                    <p> {{ errors.last_name }} </p>
                </div>
            </div>
            <div class="mb-3 col-4">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" :class="{ 'invalid-input': errors.email }" id="email"
                    v-model="formData.email" required>
                <div class="invalid" v-if="errors.email">
                    <p> {{ errors.email }} </p>
                </div>
            </div>
            <div class="mb-3 col-6">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" :class="{ 'invalid-input': errors.password }" id="password"
                    v-model="formData.password" required>
                <div class="invalid" v-if="errors.password">
                    <p> {{ errors.password }} </p>
                </div>
            </div>
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
                <input type="text" class="form-control" :class="{ 'invalid-input': errors.office_address }"
                    id="office_address" v-model='formData.office_address' required>
                <div class="invalid" v-if="errors.office_address">
                    <p> {{ errors.office_address }} </p>
                </div>
            </div>
            <!-- <div class="mb-3 col-6">
                    <label for="specializations" class="form-label">Specializzazioni</label>
                    <select class="form-select" aria-label="Default select example" id="specializations"
                        v-model="formData.specializations" >
                        <option disabled selected>Seleziona la/e tua/e specializzazione/i</option>
                        <option value="surgery">Chirurgia</option>
                        <option value="cardiology">Cardiologia</option>
                        <option value="ophthalmology">Oculistica</option>
                    </select>
                </div> -->
            <div class="mb-3 col-6">
                <label for="specializations" class="form-label">Specializzazioni</label>
                <Multiselect @send-values="updateSpecs" :specializations="formData.oldSpecializations" />
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
                <PhotoUpload v-model="formData.photo"></PhotoUpload>
                <!-- <input type="text" class="form-control" :class="{ 'invalid-input': errors.photo }" id="photo"
                    placeholder="Inserisci un file valido" @change="formData.photo" required> -->
                <div class="invalid" v-if="errors.photo">
                    <p> {{ errors.photo }} </p>
                </div>
            </div>
            <div class="mb-3 d-flex flex-column col-6">
                <label for="curriculum" class="form-label">Curriculum
                    Vitae</label>
                <CvUpload v-model="formData.curriculum"></CvUpload>
                <!-- <input type="text" class="form-control" :class="{ 'invalid-input': errors.curriculum }" id="curriculum"
                    placeholder="Inserisci un file valido" @change="formData.curriculum" required> -->
                <div class="invalid" v-if="errors.curriculum">
                    <p> {{ errors.curriculum }} </p>
                </div>
            </div>
            <div class="mb-3">
                <!-- <button type="submit" class="btn me-2 btn-submit">Modifica</button>
                    <button type="reset" class="btn btn-reset">Reset</button> -->
                <button type="submit" class="btn me-2 btn-submit" data-bs-toggle="myModal"
                    data-bs-target="myModal">Modifica</button>
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
