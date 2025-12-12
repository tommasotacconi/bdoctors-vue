import { reactive } from 'vue'
import axios from 'axios';


export const store = reactive({
	// Api uri
	apiUri: import.meta.env.VITE_API_URL,
	// Placeholder Uri
	placeholderImg(firstName, lastName) {
		/* Credits: Avatar Placeholder */
		// return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
		/* Credits: DiceBear */
		return `https://api.dicebear.com/9.x/initials/svg?seed=${firstName[0]}+${lastName[0]}&fontSize=40`;
	} ,

	// Authorization status
	isAuthenticated: null,
})

