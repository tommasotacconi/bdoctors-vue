import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
  // Variable for change content inside dashboard
  informationPage: true,
  messagePage: false,
  reviewPage: false,
  sponsorshipPage: false,
  statisticPage: false,

  // Variable needed for the advanced search
  searchedSpecialization: null,
  selectedSpecializationName: null,

  // Variable for the show profile card in advanced search 
  doctorProfile: null,

  // Variable for toggle sidebar inside dashboard
  sidebar: true,

  // Api uri
  // apiUri: 'https://127.0.0.1:8000/api/',
  apiUri: 'https://127.0.0.1:5173/api/',
  // Api call for profile information
  informationPageId: '',

  profileDataGeneral: {},

  // Dashboard Chart
  charDataMessages: {},
  charDataReviews: {},
  charDataVotes: {},
  messagesProfile: [],
  reviewsProfile: [],

  // User id, sponsorized profile id
  userId: '',
})

