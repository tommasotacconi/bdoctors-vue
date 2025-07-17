import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
  // Api uri
  // apiUri: 'http://127.0.0.1:8000/api/',
  apiUri: 'https://127.0.0.1:5174/api/',
	// Placeholder Uri
	placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',

	// Authorization status
	isAuthenticated: null,

  searchedSpecialization: null,

  // test route guard
  responseStatus: false,

  // Variable needed for the advanced search
  searchedSpecialization: null,
  selectedSpecializationName: null,

  // Variable for the show profile card in advanced search 
  doctorProfile: null,

  // user id, sponsorized profile id
  userId: '',
})

