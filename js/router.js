import { createWebHistory, createRouter } from 'vue-router';
import { store } from './store.js';
import Homepage from '../src/pages/Homepage.vue';
import LoginPage from '../src/pages/LoginPage.vue';
import RegisterPage from '../src/pages/RegisterPage.vue';
import Dashboard from '../src/pages/Dashboard.vue';
import ProfileEdit from '../src/pages/ProfileEdit.vue';
import Createpage from '../src/pages/Createpage.vue';
import AdvancedSearch from '../src/pages/AdvancedSearch.vue';
import DoctorShow from '../src/components/Search/DoctorShow.vue';
import WithHeaderLayout from '../src/layouts/WithHeaderLayout.vue';
import AppHeader from '../src/components/Homepage/AppHeader.vue';
import AppMainHome from '../src/components/Homepage/AppMainHome.vue';
import AppLogin from '../src/components/Login/AppLogin.vue';
import AppRegister from '../src/components/Register/AppRegister.vue';
import SearchedDoctor from '../src/components/Search/SearchedDoctor.vue';
import OneComponentLayout from '../src/layouts/OneComponentLayout.vue';

const routes = [
	{ 
		path: '/',
		// Currently the only layout needed, so all the routes use it
		// even when an header is not present (simply not inserted in the
		// components property) 
		component: WithHeaderLayout,
		children: [
			{
				path: '',
				name: 'homepage',
				component: AppMainHome,
			},
			{ path: 'user/login',
				name: 'login',
				component: AppLogin,
			},
			{ path: 'user/register',
				name: 'register',
				component: AppRegister,
			},
			// Path to all doctors with selected specialization id  
			// { path: '/search/:searchId', component: AdvancedSearch, name: 'search' },
			// Path to all doctors with selected specialization id and satisfing filter parameters
			// `inputRating`, `:inputReviews`  
			{ path: '/search/:specialization',
				name: 'search',
				component: SearchedDoctor,
			},
			// Path to doctor, within specialization id, of doctord_id selected (first id for specialization
			// second for doctor)
			{ path: '/search/:searchId/:nameId',
				name: 'search.show',
				component: DoctorShow,
			},
		]
	},
	{
		path: '/',
		component: OneComponentLayout,
		children: [
			{ path: 'user',
				name: 'dashboard',
				component: Dashboard,
			},
			{ path: '/user/edit',
				name: 'edit',
				component: ProfileEdit,
			},
			{ path: '/user/create',
				name: 'create',
				components: Createpage 
			},
		]
	}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }