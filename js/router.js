import { createWebHistory, createRouter } from 'vue-router';
import OneComponentLayout from '../src/layouts/OneComponentLayout.vue';
import WithHeaderLayout from '../src/layouts/WithHeaderLayout.vue';
import HomepagePage from '../src/pages/HomepagePage.vue';
import RegisterPage from '../src/pages/RegisterPage.vue';
import LoginPage from '../src/pages/LoginPage.vue';
import AdvancedSearchPage from '../src/pages/AdvancedSearchPage.vue';
import SearchedDoctor from '../src/components/Search/SearchedDoctor.vue';
import DoctorShow from '../src/components/Search/DoctorShow.vue';
import DashboardPage from '../src/pages/DashboardPage.vue';

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
				component: HomepagePage,
			},
			{ path: 'user/login',
				name: 'login',
				component: LoginPage,
			},
			{ path: 'user/register',
				name: 'register',
				component: RegisterPage,
			},
			// Path to all doctors with selected specialization id  
			// { path: '/search/:searchId', component: AdvancedSearch, name: 'search' },
			// Path to all doctors with selected specialization id and satisfing filter parameters
			// `inputRating`, `:inputReviews`  
			{ path: '',
				component: AdvancedSearchPage,
				children: [
					{
						path: '/:specialization',
						name: 'search',
						component: SearchedDoctor
					},
					{
						path: '/:specialization/:searchId/:nameId/testroute',
						name: 'search.show',
						component: DoctorShow
					}
				]
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