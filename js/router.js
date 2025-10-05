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

const routes = [
	{ 
		path: '/',
		component: WithHeaderLayout,
		children: [
			{
				path: 'inizia-ricerca',
				name: 'homepage',
				component: HomepagePage,
			},
			{ path: 'utente/accesso',
				name: 'login',
				component: LoginPage,
			},
			{ path: 'utente/registrazione',
				name: 'register',
				component: RegisterPage,
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
			{ path: 'profilo',
				name: 'dashboard',
				component: DashboardPage,
			},
		]
	}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }