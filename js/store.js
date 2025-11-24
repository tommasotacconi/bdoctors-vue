import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
	// Api uri
	apiUri: import.meta.env.VITE_API_URL,
	// Placeholder Uri
	placeholderImg(firstName, lastName) {
		return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
	} ,

	// Authorization status
	isAuthenticated: null,
})

