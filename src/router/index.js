import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import SurveyView from '../views/SurveyView.vue'
import WorkoutView from '../views/WorkoutView.vue'
import ExerciseView from '../views/ExerciseView.vue'
import NutritionView from '../views/NutritionView.vue'
import ProgramView from '../views/ProgramView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          component: HomeView },
    { path: '/register',  component: RegisterView },
    { path: '/survey',    component: SurveyView },
    { path: '/login',     component: LoginView },
    { path: '/workout',   component: WorkoutView },
    { path: '/exercise/:id',   component: ExerciseView },
    { path: '/nutrition', component: NutritionView },
    { path: '/program',   component: ProgramView },
    { path: '/profile',   component: ProfileView }, // Личный кабинет
  ],
})

export default router