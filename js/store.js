import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
  // Api uri
  // apiUri: 'http://127.0.0.1:8000/api/',
  apiUri: 'https://127.0.0.1:5174/api/',

  // Variable for change content inside dashboard
  informationPage: true,
  messagePage: false,
  reviewPage: false,
  sponsorshipPage: false,
  statisticPage: false,
  searchedSpecialization: null,

  // test route guard
  responseStatus: false,

  // Variable needed for the advanced search
  searchedSpecialization: null,
  selectedSpecializationName: null,

  // Variable for the show profile card in advanced search 
  doctorProfile: null,

  // Variable for toggle sidebar inside dashboard
  sidebar: true,

	/* Dashboard state */
  profileDataGeneral: {},

  // chart
  charDataMessages: {},
  charDataReviews: {},
  charDataVotes: {},
  messagesProfile: [],
  reviewsProfile: [],

  // user id, sponsorized profile id
  userId: '',
})

