<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Данные формы входа
const form = reactive({
  login: '',
  password: '',
})

// Ошибки под полями
const errors = reactive({
  login: '',
  password: '',
})

const hasErrors = ref(false)

// Функция входа
function submit() {
  hasErrors.value = false
  errors.login = ''
  errors.password = ''

  // Проверяем что поля заполнены
  if (!form.login) {
    errors.login = 'Введи логин'
    hasErrors.value = true
  }

  if (!form.password) {
    errors.password = 'Введи пароль'
    hasErrors.value = true
  }

  if (hasErrors.value) return

  // Берём список пользователей из localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  // Ищем пользователя с таким логином и паролем
  let foundUser = null
  for (let i = 0; i < users.length; i++) {
    if (users[i].login === form.login && users[i].password === form.password) {
      foundUser = users[i]
      break
    }
  }

  // Если не нашли — показываем ошибку
  if (!foundUser) {
    errors.login = 'Неверный логин или пароль'
    return
  }

  // Сохраняем текущего пользователя и идём на программу
  localStorage.setItem('currentUser', JSON.stringify(foundUser))
  router.push('/program')
}
</script>

<template>
  <div class="page">
    <!-- Светящийся фон -->
    <div class="glow"></div>

    <div class="box">
      <!-- Кнопка назад -->
      <RouterLink to="/" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        На главную
      </RouterLink>

      <p class="page-label">С возвращением</p>
      <h1 class="page-title">Войти</h1>
      <p class="page-subtitle">Введи логин и пароль от своего аккаунта</p>

      <div class="field">
        <label>Логин</label>
        <input
          type="text"
          v-model="form.login"
          @input="errors.login = ''"
          placeholder="Твой логин"
          :class="{ 'input--error': errors.login }"
        />
        <!-- Показываем ошибку только если она есть -->
        <p v-if="errors.login" class="field-error">{{ errors.login }}</p>
      </div>

      <div class="field">
        <label>Пароль</label>
        <input
          type="password"
          v-model="form.password"
          @input="errors.password = ''"
          placeholder="Твой пароль"
          :class="{ 'input--error': errors.password }"
        />
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      </div>

      <button class="btn-submit" @click="submit">
        Войти
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>

      <!-- Ссылка на регистрацию -->
      <p class="auth-link">
        Нет аккаунта?
        <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #06080F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 60px;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 50% 60% at 30% 70%, rgba(25, 70, 150, 0.3) 0%, transparent 65%);
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.box {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.7s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  text-decoration: none;
  margin-bottom: 40px;
  transition: color .2s;
}

.back-link:hover { color: rgba(255,255,255,0.6); }

.page-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin-bottom: 10px;
}

.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 52px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  line-height: 1;
}

.page-subtitle {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
  margin-bottom: 36px;
  line-height: 1.7;
}

.field { margin-bottom: 18px; }

label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 8px;
}

input {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 14px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #FFFFFF;
  box-sizing: border-box;
  border-radius: 2px;
  transition: border-color .2s, background .2s;
}

input::placeholder { color: rgba(255,255,255,0.18); }

input:focus {
  outline: none;
  border-color: rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.05);
}

.input--error { border-color: rgba(220,60,60,0.5) !important; }
.field-error { font-size: 11px; color: #DC3C3C; margin-top: 6px; }

.btn-submit {
  width: 100%;
  padding: 15px;
  background: #FFFFFF;
  color: #06080F;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  margin-top: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity .2s;
}

.btn-submit:hover { opacity: 0.85; }

.auth-link {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.25);
  text-align: center;
}

.auth-link a {
  color: rgba(255,255,255,0.6);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color .2s;
}

.auth-link a:hover { color: #FFFFFF; }
</style>