<template>
  <div class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">Твой дневник</p>
      <h1 class="page-title">Журнал прогресса</h1>

      <!-- Блок для незалогиненного пользователя -->
      <div v-if="!user" class="not-logged">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>Войди в аккаунт, чтобы вести дневник прогресса</p>
        <button class="btn-back" @click="$router.push('/login')">Войти</button>
      </div>

      <div v-else>
        <!-- Выбор месяца и год -->
        <div class="month-nav">
          <button class="nav-btn" @click="prevMonth">←</button>
          <span class="current-month">{{ currentMonthYear }}</span>
          <button class="nav-btn" @click="nextMonth">→</button>
          <button class="today-btn" @click="resetToToday">Сегодня</button>
        </div>

        <!-- Календарь -->
        <div class="calendar-wrapper">
          <div class="calendar-weekdays">
            <span v-for="day in weekdays" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-grid">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day"
              :class="{ 'empty': !day, 'today': isToday(day) }"
            >
              <div v-if="day" class="day-number">{{ day.date }}</div>
              <div v-if="day" class="day-checkboxes">
                <label class="check-label" :title="'Тренировка\n' + getWorkoutTooltip(day)">
                  <input type="checkbox" v-model="day.workout" @change="saveDay(day)">
                  <span class="check-icon workout-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                </label>
                <label class="check-label" title="Вода (2.5 л)">
                  <input type="checkbox" v-model="day.water" @change="saveDay(day)">
                  <span class="check-icon water-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </span>
                </label>
                <label class="check-label" title="Шаги (15000)">
                  <input type="checkbox" v-model="day.steps" @change="saveDay(day)">
                  <span class="check-icon steps-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика активности -->
        <div class="stats-card">
          <div class="stats-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <h3>Активность за месяц</h3>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Тренировки</span>
              <span class="stat-value">{{ workoutDays }} / {{ totalDays }}</span>
              <div class="progress-bar-bg"><div class="progress-fill" :style="{ width: workoutPercent + '%' }"></div></div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Вода (2.5 л)</span>
              <span class="stat-value">{{ waterDays }} / {{ totalDays }}</span>
              <div class="progress-bar-bg"><div class="progress-fill" :style="{ width: waterPercent + '%' }"></div></div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Шаги (15000)</span>
              <span class="stat-value">{{ stepsDays }} / {{ totalDays }}</span>
              <div class="progress-bar-bg"><div class="progress-fill" :style="{ width: stepsPercent + '%' }"></div></div>
            </div>
            <div class="stat-item total-activity">
              <span class="stat-label">Общий прогресс</span>
              <span class="stat-value">{{ totalActivityPercent }}%</span>
              <div class="progress-bar-bg"><div class="progress-fill" :style="{ width: totalActivityPercent + '%', background: '#4ade80' }"></div></div>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="quick-actions">
          <button class="btn-quick" @click="markTodayWorkout">✅ Отметить тренировку сегодня</button>
          <button class="btn-quick" @click="markTodayAll">⭐ Отметить всё (вода+шаги+тренировка)</button>
        </div>
      </div>
    </div>

    <!-- Тост-уведомления (не браузер) -->
    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const calendarDays = ref([])
const toastMessage = ref('')
let toastTimeout = null

function showToast(msg) {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = msg
  toastTimeout = setTimeout(() => { toastMessage.value = '' }, 2000)
}

// Загрузка данных из localStorage
function loadDayData(year, month, day) {
  const key = `daily_${user.value?.login}_${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const saved = localStorage.getItem(key)
  if (saved) {
    return JSON.parse(saved)
  }
  return { workout: false, water: false, steps: false }
}

function saveDay(dayObj) {
  const key = `daily_${user.value?.login}_${dayObj.fullDate}`
  localStorage.setItem(key, JSON.stringify({
    workout: dayObj.workout,
    water: dayObj.water,
    steps: dayObj.steps
  }))
  showToast('Сохранено ✓')
  // пересчитаем статистику (вызовется реактивно)
}

// Построение календаря
function buildCalendar() {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const startDayOfWeek = firstDayOfMonth.getDay() // 0 вс, 1 пн ...
  let offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const daysArray = []
  for (let i = 0; i < offset; i++) daysArray.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${currentYear.value}-${String(currentMonth.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const saved = loadDayData(currentYear.value, currentMonth.value, d)
    daysArray.push({
      date: d,
      fullDate: fullDate,
      workout: saved.workout,
      water: saved.water,
      steps: saved.steps
    })
  }
  calendarDays.value = daysArray
}

// Навигация по месяцам
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  buildCalendar()
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  buildCalendar()
}
function resetToToday() {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  buildCalendar()
}

function isToday(day) {
  if (!day) return false
  const today = new Date()
  return day.date === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()
}

// Статистика
const totalDays = computed(() => calendarDays.value.filter(d => d !== null).length)
const workoutDays = computed(() => calendarDays.value.filter(d => d && d.workout).length)
const waterDays = computed(() => calendarDays.value.filter(d => d && d.water).length)
const stepsDays = computed(() => calendarDays.value.filter(d => d && d.steps).length)
const workoutPercent = computed(() => totalDays.value ? (workoutDays.value / totalDays.value * 100).toFixed(1) : 0)
const waterPercent = computed(() => totalDays.value ? (waterDays.value / totalDays.value * 100).toFixed(1) : 0)
const stepsPercent = computed(() => totalDays.value ? (stepsDays.value / totalDays.value * 100).toFixed(1) : 0)
const totalActivityPercent = computed(() => {
  if (!totalDays.value) return 0
  const totalChecks = workoutDays.value + waterDays.value + stepsDays.value
  const maxChecks = totalDays.value * 3
  return ((totalChecks / maxChecks) * 100).toFixed(1)
})

// Быстрые отметки на сегодня
function markTodayWorkout() {
  const today = new Date()
  if (today.getMonth() !== currentMonth.value || today.getFullYear() !== currentYear.value) {
    showToast('Сегодня не в текущем месяце. Переключитесь на текущий месяц.')
    return
  }
  const dayObj = calendarDays.value.find(d => d && d.date === today.getDate())
  if (dayObj && !dayObj.workout) {
    dayObj.workout = true
    saveDay(dayObj)
  } else if (dayObj && dayObj.workout) {
    showToast('Тренировка уже отмечена')
  } else {
    showToast('Сегодня нет ячейки?')
  }
}
function markTodayAll() {
  const today = new Date()
  if (today.getMonth() !== currentMonth.value || today.getFullYear() !== currentYear.value) {
    showToast('Сегодня не в текущем месяце. Переключитесь на текущий месяц.')
    return
  }
  const dayObj = calendarDays.value.find(d => d && d.date === today.getDate())
  if (dayObj) {
    dayObj.workout = true
    dayObj.water = true
    dayObj.steps = true
    saveDay(dayObj)
  } else {
    showToast('Сегодня нет ячейки?')
  }
}

// Тултип для тренировки (можно просто текст)
function getWorkoutTooltip(day) {
  if (day.workout) return 'Тренировка выполнена'
  return 'Отметить тренировку'
}

// Загрузка пользователя
function loadUser() {
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    user.value = JSON.parse(stored)
    buildCalendar()
  }
}

onMounted(() => {
  loadUser()
})

// computed для отображения месяца и года
const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
})
</script>

<style scoped>
/* ----- ОСНОВНЫЕ ПЕРЕМЕННЫЕ (как в проекте) ----- */
:root {
  --bg-dark: #06080F;
  --border: rgba(255,255,255,0.06);
  --accent: #3b82f6;
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.6);
}

.page {
  min-height: 100vh;
  background: #06080F;
  padding: 100px 80px 80px;
  font-family: 'Inter', sans-serif;
  position: relative;
}
.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 40% 50% at 80% 20%, rgba(25, 70, 150, 0.2) 0%, transparent 65%);
  pointer-events: none;
}
.box {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.7s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin-bottom: 8px;
}
.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  line-height: 1;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
}
.not-logged {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
}
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: rgba(255,255,255,0.7);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
}
.btn-back:hover {
  background: rgba(255,255,255,0.08);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.25);
}

/* Навигация по месяцам */
.month-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background: rgba(255,255,255,0.02);
  padding: 12px 24px;
  border: 1px solid var(--border);
  border-radius: 2px;
}
.nav-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  padding: 6px 16px;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-secondary);
}
.nav-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}
.current-month {
  font-weight: 500;
  color: white;
  font-size: 16px;
  text-transform: capitalize;
}
.today-btn {
  margin-left: auto;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  padding: 6px 16px;
  font-size: 12px;
  cursor: pointer;
  color: var(--accent);
}
.today-btn:hover {
  background: rgba(59,130,246,0.15);
}

/* Календарь */
.calendar-wrapper {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 20px;
  margin-bottom: 32px;
}
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 12px;
}
.calendar-weekdays span {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 8px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.calendar-day {
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 8px 4px;
  text-align: center;
  min-height: 85px;
  transition: border-color 0.2s;
}
.calendar-day.empty {
  background: none;
  border-color: transparent;
}
.calendar-day.today {
  border-color: var(--accent);
  background: rgba(59,130,246,0.05);
}
.day-number {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 8px;
}
.day-checkboxes {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.check-label {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.check-label input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 2px;
  transition: all 0.1s;
}
.check-label input:checked + .check-icon {
  background: var(--accent);
  border-color: var(--accent);
}
.check-icon svg {
  stroke: rgba(255,255,255,0.7);
  stroke-width: 2;
}
.check-label input:checked + .check-icon svg {
  stroke: white;
}
.workout-icon svg, .water-icon svg, .steps-icon svg {
  width: 14px;
  height: 14px;
}

/* Статистика */
.stats-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 24px 28px;
  margin-bottom: 32px;
}
.stats-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.stats-header svg {
  color: var(--accent);
}
.stats-header h3 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin: 0;
}
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stat-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.stat-label {
  width: 140px;
  font-size: 13px;
  color: var(--text-secondary);
}
.stat-value {
  width: 70px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}
.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  width: 0%;
  transition: width 0.3s;
}
.total-activity .progress-fill {
  background: #4ade80;
}
.total-activity .stat-value {
  color: #4ade80;
}

/* Быстрые действия */
.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.btn-quick {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  padding: 10px 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-quick:hover {
  background: rgba(255,255,255,0.08);
  color: white;
  border-color: rgba(255,255,255,0.25);
}

/* Тост (уведомление внутри сайта) */
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 12px 24px;
  border-radius: 2px;
  z-index: 1100;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border-left: 3px solid var(--accent);
  animation: fadeToast 0.2s ease;
}
@keyframes fadeToast {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Адаптивность */
@media (max-width: 800px) {
  .page { padding: 60px 30px 40px; }
  .calendar-day { min-height: 70px; }
  .check-icon { width: 24px; height: 24px; }
  .stat-label { width: 110px; }
}
@media (max-width: 600px) {
  .page { padding: 40px 20px 30px; }
  .page-title { font-size: 32px; }
  .month-nav { flex-wrap: wrap; justify-content: center; }
  .quick-actions { flex-direction: column; align-items: center; }
  .stats-grid { gap: 12px; }
  .stat-item { flex-wrap: wrap; }
}
</style>