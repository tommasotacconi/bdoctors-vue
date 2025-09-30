import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
  // Api uri
  apiUri: import.meta.env.VITE_API_URL,
	// Placeholder Uri
	placeholderImg: 'https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg',

	// Authorization status
	isAuthenticated: null,
})

