import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import SurveyView from '../views/SurveyView.vue'
import WorkoutView from '../views/WorkoutView.vue'
import NutritionView from '../views/NutritionView.vue'
import ProgramView from '../views/ProgramView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import PayView from '../views/PayView.vue'
import SupplementsView from '../views/SupplementsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          component: HomeView },
    { path: '/register',  component: RegisterView },
    { path: '/survey',    component: SurveyView },
    { path: '/login',     component: LoginView },
    { path: '/workout',   component: WorkoutView },
    { path: '/nutrition', component: NutritionView },
    { path: '/supplements', component: SupplementsView },
    { path: '/pay',       component: PayView },
    { path: '/program',   component: ProgramView, meta: { requiresAuth: true } },
    { path: '/profile',   component: ProfileView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
})

router.beforeEach(function(to, from, next) {
  const requiresAuth = to.meta.requiresAuth
  const currentUser = localStorage.getItem('currentUser')
  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router