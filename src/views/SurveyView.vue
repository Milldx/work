<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const totalSteps = 3

const form = reactive({
  goal: '',
  level: '',
  height: '',
  weight: '',
  waist: '',
  chest: '',
  bicep: '',
  hip: '',
})

const errors = reactive({
  goal: '',
  level: '',
  body: '',
})

function nextStep() {
  if (currentStep.value === 1) {
    if (!form.goal) { errors.goal = 'Выбери цель'; return }
    errors.goal = ''
  }
  if (currentStep.value === 2) {
    if (!form.level) { errors.level = 'Выбери уровень'; return }
    errors.level = ''
  }
  currentStep.value++
}

function prevStep() {
  currentStep.value--
}

function submit() {
  if (!form.height || !form.weight) {
    errors.body = 'Укажи рост и вес — они обязательны'
    return
  }
  errors.body = ''

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  currentUser.goal = form.goal
  currentUser.level = form.level
  currentUser.height = form.height
  currentUser.weight = form.weight
  currentUser.waist = form.waist
  currentUser.chest = form.chest
  currentUser.bicep = form.bicep
  currentUser.hip = form.hip

  localStorage.setItem('currentUser', JSON.stringify(currentUser))

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  for (let i = 0; i < users.length; i++) {
    if (users[i].login === currentUser.login) {
      users[i] = currentUser
      break
    }
  }
  localStorage.setItem('users', JSON.stringify(users))

  router.push('/program')
}

const goals = [
  {
    id: 'loss',
    label: 'Похудение',
    desc: 'Снижение веса и жировой массы',
    icon: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
  },
  {
    id: 'mass',
    label: 'Набор массы',
    desc: 'Рост мышц и силовых показателей',
    icon: `<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>`,
  },
  {
    id: 'keep',
    label: 'Поддержание',
    desc: 'Сохранение формы и тонуса',
    icon: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  },
]

const levels = [
  { id: 'beginner', label: 'Новичок', desc: 'Тренируюсь менее 6 месяцев' },
  { id: 'middle',   label: 'Средний', desc: 'Тренируюсь от 6 месяцев до 2 лет' },
  { id: 'advanced', label: 'Продвинутый', desc: 'Тренируюсь более 2 лет' },
]
</script>

<template>
  <div class="page">
    <div class="glow"></div>

    <div class="box">
      <p class="page-label">Анкета</p>
      <h1 class="page-title">Расскажи о себе</h1>

      <!-- Прогресс -->
      <div class="progress">
        <div class="progress-steps">
          <div
            v-for="n in totalSteps"
            :key="n"
            :class="['progress-step', { 'progress-step--done': n < currentStep, 'progress-step--active': n === currentStep }]"
          ></div>
        </div>
        <p class="progress-text">Шаг {{ currentStep }} из {{ totalSteps }}</p>
      </div>

      <!-- Шаг 1 — Цель -->
      <div v-if="currentStep === 1" class="step">
        <p class="step-title">Твоя цель</p>
        <div class="goals-grid">
          <button
            v-for="g in goals"
            :key="g.id"
            type="button"
            :class="['goal-btn', { 'goal-btn--active': form.goal === g.id }]"
            @click="form.goal = g.id; errors.goal = ''"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="g.icon"></svg>
            <div>
              <p class="goal-label">{{ g.label }}</p>
              <p class="goal-desc">{{ g.desc }}</p>
            </div>
          </button>
        </div>
        <p v-if="errors.goal" class="field-error">{{ errors.goal }}</p>
        <button class="btn-submit" @click="nextStep">
          Далее
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      <!-- Шаг 2 — Уровень -->
      <div v-if="currentStep === 2" class="step">
        <p class="step-title">Уровень подготовки</p>
        <div class="options-col">
          <button
            v-for="l in levels"
            :key="l.id"
            type="button"
            :class="['option-btn', { 'option-btn--active': form.level === l.id }]"
            @click="form.level = l.id; errors.level = ''"
          >
            <div>
              <p class="option-label">{{ l.label }}</p>
              <p class="option-desc">{{ l.desc }}</p>
            </div>
            <svg v-if="form.level === l.id" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>
        <p v-if="errors.level" class="field-error">{{ errors.level }}</p>
        <div class="btn-row">
          <button class="btn-back" @click="prevStep">Назад</button>
          <button class="btn-submit btn-submit--flex" @click="nextStep">
            Далее
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Шаг 3 — Параметры тела -->
      <div v-if="currentStep === 3" class="step">
        <p class="step-title">Параметры тела</p>
        <p class="step-hint">Рост и вес обязательны. Остальное — по желанию.</p>

        <div class="body-grid">
          <div class="field">
            <label>Рост (см) *</label>
            <input type="number" v-model="form.height" placeholder="175" min="100" max="250" />
          </div>
          <div class="field">
            <label>Вес (кг) *</label>
            <input type="number" v-model="form.weight" placeholder="70" min="30" max="300" />
          </div>
          <div class="field">
            <label>Талия (см)</label>
            <input type="number" v-model="form.waist" placeholder="80" />
          </div>
          <div class="field">
            <label>Грудь (см)</label>
            <input type="number" v-model="form.chest" placeholder="95" />
          </div>
          <div class="field">
            <label>Бицепс (см)</label>
            <input type="number" v-model="form.bicep" placeholder="35" />
          </div>
          <div class="field">
            <label>Бёдра (см)</label>
            <input type="number" v-model="form.hip" placeholder="95" />
          </div>
        </div>

        <p v-if="errors.body" class="field-error">{{ errors.body }}</p>

        <div class="btn-row">
          <button class="btn-back" @click="prevStep">Назад</button>
          <button class="btn-submit btn-submit--flex" @click="submit">
            Получить программу
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
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
  background: radial-gradient(ellipse 50% 60% at 30% 40%, rgba(25, 70, 150, 0.3) 0%, transparent 65%);
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.box {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.7s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
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
  margin-bottom: 28px;
  line-height: 1;
}

/* Прогресс */
.progress { margin-bottom: 40px; }

.progress-steps {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.progress-step {
  flex: 1;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  transition: background .4s;
}

.progress-step--done { background: rgba(255,255,255,0.4); }
.progress-step--active { background: #FFFFFF; }

.progress-text {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}

.step { animation: fadeUp 0.4s ease both; }

.step-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 20px;
}

.step-hint {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.25);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Цели */
.goals-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.goal-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  border-radius: 2px;
  text-align: left;
  transition: all .2s;
}

.goal-btn:hover {
  border-color: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.04);
}

.goal-btn--active {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.07);
  color: #FFFFFF;
}

.goal-label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: inherit;
  margin-bottom: 3px;
}

.goal-desc {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
}

.goal-btn--active .goal-desc { color: rgba(255,255,255,0.5); }

/* Уровень */
.options-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  border-radius: 2px;
  text-align: left;
  transition: all .2s;
}

.option-btn:hover {
  border-color: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.04);
}

.option-btn--active {
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.07);
  color: #FFFFFF;
}

.option-label {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  margin-bottom: 3px;
}

.option-desc {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
}

/* Параметры тела */
.body-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 8px;
}

.field { display: flex; flex-direction: column; }

label {
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

/* Кнопки */
.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity .2s;
}

.btn-submit--flex { margin-top: 0; flex: 1; }
.btn-submit:hover { opacity: 0.85; }

.btn-back {
  padding: 14px 20px;
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
  transition: all .2s;
  white-space: nowrap;
}

.btn-back:hover {
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.6);
}

.field-error {
  font-size: 11px;
  color: #DC3C3C;
  margin-top: 6px;
  margin-bottom: 8px;
}
</style>