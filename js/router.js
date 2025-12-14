import { createWebHistory, createRouter } from 'vue-router';
import OneComponentLayout from '../src/layouts/OneComponentLayout.vue';
import WithHeaderLayout from '../src/layouts/WithHeaderLayout.vue';
import HomepagePage from '../src/pages/HomepagePage.vue';
import RegisterPage from '../src/pages/RegisterPage.vue';
import LoginPage from '../src/pages/LoginPage.vue';
import AdvancedSearchPage from '../src/pages/AdvancedSearchPage.vue';
import SearchedSpecializationDoctors from '../src/components/Search/SearchedSpecializationDoctors.vue';
import DoctorShow from '../src/components/Search/DoctorShow.vue';
import DashboardPage from '../src/pages/DashboardPage.vue';
import axios from 'axios';
import { store } from './store';

async function getAuthStatus() {
	return store.isAuthenticated ?? (store.isAuthenticated = (await axios.get(store.apiUri.slice(0, -4) + 'user/status')).data.authenticated);
}

async function checkAuthorization({ name: toName, meta: { requiredAuthValue } }, from) {
	if (requiredAuthValue !== undefined) {
		if (requiredAuthValue && !(await getAuthStatus())) return toName !== 'dashboard' ?  false : { name: 'login' };
		else if (!requiredAuthValue && await getAuthStatus()) return toName === 'login' ? { name: 'dashboard' } : from.name ? false : { name: 'homepage' };
	}
 };

const routes = [
	{ 
		path: '/',
		component: WithHeaderLayout,
		beforeEnter: async () => {await getAuthStatus()},
		children: [
			{
				path: 'inizia-ricerca',
				name: 'homepage',
				component: HomepagePage,
			},
			{ path: 'utente/accesso',
				name: 'login',
				component: LoginPage,
				meta: { requiredAuthValue: false },
				beforeEnter: checkAuthorization
			},
			{ path: 'utente/registrazione',
				name: 'register',
				component: RegisterPage,
				meta: { requiredAuthValue: false },
				beforeEnter: checkAuthorization
			},
			// Path to all doctors with selected specialization id and satisfing filter parameters
			// 'rating' and 'reviewsNumber'  
			{ path: '',
				component: AdvancedSearchPage,
				children: [
					{
						path: ':specialization',
						name: 'specializationDoctors',
						component: SearchedSpecializationDoctors,
						children: [
							{
								// Path to doctor, within specialization
								path: ':name',
								name: 'specializationDoctors.show',
								component: DoctorShow
							}
						]
					},
				]
			},
			{ path: '/cerca/:name',
				name: 'search',
				component: DoctorShow,
			},
		]
	},
	{
		path: '/utente',
		component: OneComponentLayout,
		children: [
			{ 
				path: 'profilo',
				name: 'dashboard',
				component: DashboardPage,
				meta: { requiredAuthValue: true },
				beforeEnter: checkAuthorization
			},
		]
	}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }