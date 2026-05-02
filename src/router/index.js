// Импортируем функции для создания роутера
import { createRouter, createWebHistory } from 'vue-router'

// Импортируем все страницы (views)
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import SurveyView from '../views/SurveyView.vue'
import WorkoutView from '../views/WorkoutView.vue'
import NutritionView from '../views/NutritionView.vue'
import ProgramView from '../views/ProgramView.vue'
import LoginView from '../views/LoginView.vue'

// Создаём роутер — он решает какую страницу показать по адресу
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          component: HomeView },       // Главная
    { path: '/register',  component: RegisterView },   // Регистрация
    { path: '/survey',    component: SurveyView },     // Анкета
    { path: '/login',     component: LoginView },      // Вход
    { path: '/workout',   component: WorkoutView },    // Тренировки
    { path: '/nutrition', component: NutritionView },  // Питание
    { path: '/program',   component: ProgramView },    // Моя программа
  ],
})

export default router