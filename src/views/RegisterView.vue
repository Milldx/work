<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  login: '',
  password: '',
  gender: '',
})

const errors = reactive({
  name: '',
  login: '',
  password: '',
  gender: '',
})

const hasErrors = ref(false)
const step = ref(1)

function validateStep1() {
  hasErrors.value = false
  errors.name = ''
  errors.login = ''
  errors.password = ''

  if (!form.name) {
    errors.name = 'Имя обязательно'
    hasErrors.value = true
  }
  if (!form.login) {
    errors.login = 'Логин обязателен'
    hasErrors.value = true
  } else if (form.login.length < 3) {
    errors.login = 'Логин не короче 3 символов'
    hasErrors.value = true
  }
  if (!form.password) {
    errors.password = 'Пароль обязателен'
    hasErrors.value = true
  } else if (form.password.length < 6) {
    errors.password = 'Пароль не короче 6 символов'
    hasErrors.value = true
  }
}

function nextStep() {
  validateStep1()
  if (hasErrors.value) return
  step.value = 2
}

function submit() {
  if (!form.gender) {
    errors.gender = 'Выбери пол'
    return
  }
  errors.gender = ''

  const users = JSON.parse(localStorage.getItem('users') || '[]')

  let exists = false
  for (let i = 0; i < users.length; i++) {
    if (users[i].login === form.login) {
      exists = true
      break
    }
  }

  if (exists) {
    step.value = 1
    errors.login = 'Такой логин уже занят'
    return
  }

  const newUser = {
    name: form.name,
    login: form.login,
    password: form.password,
    gender: form.gender,
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))

  router.push('/survey')
}
</script>

<template>
  <div class="page">
    <div class="glow"></div>

    <div class="box">

      <RouterLink to="/" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        На главную
      </RouterLink>

      <!-- Прогресс -->
      <div class="progress">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: step === 1 ? '50%' : '100%' }"></div>
        </div>
        <p class="progress-text">Шаг {{ step }} из 2</p>
      </div>

      <p class="page-label">Регистрация</p>
      <h1 class="page-title">{{ step === 1 ? 'Создай аккаунт' : 'Твой пол' }}</h1>
      <p class="page-subtitle">
        {{ step === 1 ? 'Заполни данные для входа' : 'Это нужно для подбора программы' }}
      </p>

      <!-- Шаг 1 — данные аккаунта -->
      <div v-if="step === 1" class="step">
        <div class="field">
          <label>Имя</label>
          <input
            type="text"
            v-model="form.name"
            @input="errors.name = ''"
            placeholder="Как тебя зовут?"
            :class="{ 'input--error': errors.name }"
          />
          <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label>Логин</label>
          <input
            type="text"
            v-model="form.login"
            @input="errors.login = ''"
            placeholder="Придумай логин"
            :class="{ 'input--error': errors.login }"
          />
          <p v-if="errors.login" class="field-error">{{ errors.login }}</p>
        </div>

        <div class="field">
          <label>Пароль</label>
          <input
            type="password"
            v-model="form.password"
            @input="errors.password = ''"
            placeholder="Минимум 6 символов"
            :class="{ 'input--error': errors.password }"
          />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <button class="btn-submit" @click="nextStep">
          Далее
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        <p class="auth-link">
          Уже есть аккаунт?
          <RouterLink to="/login">Войти</RouterLink>
        </p>
      </div>

      <!-- Шаг 2 — пол -->
      <div v-if="step === 2" class="step">
        <div class="gender-grid">
          <button
            type="button"
            :class="['gender-btn', { 'gender-btn--active': form.gender === 'male' }]"
            @click="form.gender = 'male'"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="10" cy="14" r="5"/>
              <line x1="19" y1="5" x2="14.14" y2="9.86"/>
              <polyline points="15 5 19 5 19 9"/>
            </svg>
            <span class="gender-label">Мужской</span>
          </button>

          <button
            type="button"
            :class="['gender-btn', { 'gender-btn--active': form.gender === 'female' }]"
            @click="form.gender = 'female'"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="12" cy="8" r="5"/>
              <line x1="12" y1="13" x2="12" y2="21"/>
              <line x1="9" y1="18" x2="15" y2="18"/>
            </svg>
            <span class="gender-label">Женский</span>
          </button>
        </div>

        <p v-if="errors.gender" class="field-error">{{ errors.gender }}</p>

        <button class="btn-submit" @click="submit">
          Зарегистрироваться
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        <button class="btn-back" @click="step = 1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Назад
        </button>
      </div>

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
  background: radial-gradient(ellipse 50% 60% at 70% 30%, rgba(25, 70, 150, 0.3) 0%, transparent 65%);
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.box {
  width: 100%;
  max-width: 460px;
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
  margin-bottom: 36px;
  transition: color .2s;
}

.back-link:hover { color: rgba(255,255,255,0.6); }

/* Прогресс */
.progress {
  margin-bottom: 36px;
}

.progress-track {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin-bottom: 10px;
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #FFFFFF;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}

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

.step { animation: fadeUp 0.4s ease both; }

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

/* Гендер */
.gender-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}

.gender-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  border-radius: 2px;
  transition: all .25s;
}

.gender-btn:hover {
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.05);
}

.gender-btn--active {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.5);
  color: #FFFFFF;
}

.gender-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Кнопки */
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
  margin-top: 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity .2s;
}

.btn-submit:hover { opacity: 0.85; }

.btn-back {
  width: 100%;
  padding: 14px;
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.3);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .2s;
}

.btn-back:hover {
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.6);
}

.auth-link {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.25);
  text-align: center;
  margin-top: 8px;
}

.auth-link a {
  color: rgba(255,255,255,0.6);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color .2s;
}

.auth-link a:hover { color: #FFFFFF; }
</style>