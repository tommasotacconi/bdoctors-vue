import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
	//Login state
	loggedUserId: 0,

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
  apiUri: 'http://localhost:8000/api/',
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

