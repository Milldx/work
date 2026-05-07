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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          component: HomeView },
    { path: '/register',  component: RegisterView },
    { path: '/survey',    component: SurveyView },
    { path: '/login',     component: LoginView },
    { path: '/workout',   component: WorkoutView },
    { path: '/nutrition', component: NutritionView },
    { path: '/pay', component: PayView },

    // Защищённые маршруты — только для залогиненных
    { path: '/program',   component: ProgramView,  meta: { requiresAuth: true } },
    { path: '/profile',   component: ProfileView,  meta: { requiresAuth: true } },

    // Страница 404 — ловит все неизвестные адреса
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
})

// Навигационный guard — проверяет каждый переход
router.beforeEach(function(to, from, next) {
  // Проверяем нужна ли авторизация для этой страницы
  const requiresAuth = to.meta.requiresAuth

  // Проверяем залогинен ли пользователь
  const currentUser = localStorage.getItem('currentUser')

  if (requiresAuth && !currentUser) {
    // Не залогинен — отправляем на /login
    next('/login')
  } else {
    // Всё ок — пропускаем
    next()
  }
})

export default router