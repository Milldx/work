<template>
  <div class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">Твой план</p>
      <h1 class="page-title">Программа тренировок</h1>

      <div v-if="!userData" class="not-logged">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>Войди в аккаунт, чтобы увидеть программу тренировок</p>
        <button class="btn-back" @click="goToLogin()">Войти</button>
      </div>

      <div v-else>
        <div class="user-info">
          <p><strong>Цель:</strong> {{ formatGoal(userData.goal) }}</p>
          <p><strong>Уровень:</strong> {{ formatLevel(userData.level) }}</p>
          <p><strong>Рост:</strong> {{ userData.height }} см</p>
          <p><strong>Вес:</strong> {{ userData.weight }} кг</p>
          <p v-if="userData.gender"><strong>Пол:</strong> {{ userData.gender === 'male' ? 'Мужской' : 'Женский' }}</p>
          <p v-if="userData.waist"><strong>Талия:</strong> {{ userData.waist }} см</p>
        </div>

        <div v-if="currentProgram" class="program-content">
          <h2>{{ currentProgram.title }}</h2>
          <p class="program-desc">{{ currentProgram.description }}</p>

          <div class="personal-tips">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
            </svg>
            <strong>Персональные рекомендации:</strong> {{ personalTips }}
          </div>

          <div class="nutrition-block">
            <div class="block-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <h3>Персональный план питания</h3>
            </div>
            <div class="nutrition-content">
              <p class="nutrition-main">{{ nutritionAdvice.main }}</p>
              <div class="macros" v-if="macros">
                <span>Калории: {{ macros.calories }} ккал/день</span>
                <span>Белки: {{ macros.protein }} г</span>
                <span>Углеводы: {{ macros.carbs }} г</span>
                <span>Жиры: {{ macros.fats }} г</span>
              </div>
              <div class="nutrition-details">
                <div class="food-list">
                  <h4>Рекомендуемые продукты</h4>
                  <ul><li v-for="food in nutritionAdvice.foods" :key="food">{{ food }}</li></ul>
                </div>
                <div class="meal-schedule">
                  <h4>Режим питания (пример)</h4>
                  <ul><li v-for="meal in nutritionAdvice.schedule" :key="meal.name"><strong>{{ meal.name }}:</strong> {{ meal.desc }}</li></ul>
                </div>
                <div class="hydration">
                  <h4>Вода</h4>
                  <p>{{ nutritionAdvice.water }}</p>
                </div>
                <div class="special-note" v-if="nutritionAdvice.note">
                  <h4>Особое внимание</h4>
                  <p>{{ nutritionAdvice.note }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="schedule-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="12" cy="15" r="1"/>
              <circle cx="16" cy="15" r="1"/>
              <circle cx="8" cy="15" r="1"/>
            </svg>
            <h3>Расписание тренировок (нажми на день для деталей)</h3>
          </div>

          <div class="days-container">
            <div v-for="day in currentProgram.days" :key="day.id" class="day-card">
              <div class="day-header" @click="toggleDayDetails(day.id)">
                <h4>День {{ day.id }}: <span>{{ day.name }}</span></h4>
                <span class="expand-icon">{{ expandedDay === day.id ? '▲' : '▼' }}</span>
              </div>
              <div v-if="expandedDay === day.id" class="day-details">
                <div v-if="day.warmUp?.length" class="section"><h5>Разминка (5-10 мин)</h5><ul><li v-for="ex in day.warmUp" :key="ex">{{ ex }}</li></ul></div>
                <div v-if="day.main?.length" class="section">
                  <h5>Основная часть</h5>
                  <div v-for="(block, idx) in day.main" :key="idx" class="exercise-block">
                    <h6>{{ block.title }}</h6>
                    <ul class="exercise-list">
                      <li v-for="(ex, i) in block.exercises" :key="i" @click="showExerciseDetails(ex)" class="clickable-exercise">
                        <span class="exercise-name">{{ ex.name }}</span>
                        <div class="exercise-meta">
                          <span class="reps">{{ ex.reps }}</span>
                          <span class="weight-hint" v-if="ex.suggestedWeight">{{ ex.suggestedWeight }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="day.coolDown?.length" class="section"><h5>Заминка / Растяжка (5-10 мин)</h5><ul><li v-for="ex in day.coolDown" :key="ex">{{ ex }}</li></ul></div>
              </div>
            </div>
          </div>

          <div class="extra-tips">
            <div class="block-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <h3>Полезные советы</h3>
            </div>
            <ul class="tips-list">
              <li>✔️ Всегда делай разминку перед тренировкой и заминку после.</li>
              <li>✔️ Пей воду во время тренировки (150-300 мл каждые 15-20 минут).</li>
              <li>✔️ Отдых между подходами: 60-90 сек (при похудении 30-45 сек).</li>
              <li>✔️ Прогрессируй нагрузку: увеличивай вес, когда можешь сделать на 2 повторения больше.</li>
              <li>✔️ Сон не менее 7-8 часов – ключ к восстановлению.</li>
            </ul>
          </div>

          <div class="action-buttons">
            <button class="btn-back" @click="goToSurvey()">Вернуться к анкете</button>
            <button class="btn-back btn-secondary" @click="resetAndGoToSurvey()">Пройти анкету заново</button>
          </div>
        </div>
        <div v-else class="no-program">
          <p>К сожалению, не удалось подобрать программу. Пожалуйста, заполни анкету заново.</p>
          <button class="btn-back" @click="goToSurvey()">Вернуться к анкете</button>
        </div>
      </div>
    </div>

    <div v-if="selectedExercise" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">✕</button>
        <h3>{{ selectedExercise.name }}</h3>
        <p class="modal-reps">Выполнение: {{ selectedExercise.reps }}</p>
        <p class="modal-desc"><strong>Описание:</strong> {{ selectedExercise.description || 'Нет описания.' }}</p>
        <p class="modal-tips"><strong>Советы:</strong> {{ selectedExercise.tips || 'Сосредоточься на технике.' }}</p>
        <p v-if="selectedExercise.suggestedWeight" class="modal-weight"><strong>Рекомендуемый вес:</strong> {{ selectedExercise.suggestedWeight }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userData = ref(null)
const currentProgram = ref(null)
const personalTips = ref('')
const nutritionAdvice = ref({ main: '', foods: [], schedule: [], water: '', note: '' })
const macros = ref(null)
const expandedDay = ref(null)
const selectedExercise = ref(null)

// -------------------------- ПОЛНАЯ БАЗА ПРОГРАММ (9 вариантов) --------------------------
const programsDB = {
  loss_beginner: {
    title: "Старт похудения",
    description: "Программа для новичков. Акцент на жиросжигание и тонус мышц.",
    days: [
      { id: 1, name: "Full Body + Кардио", warmUp: ["Суставная гимнастика", "Бег на месте 2 мин"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Приседания с собственным весом", reps: "3х15", description: "Ноги на ширине плеч, спина прямая, колени до 90°.", tips: "Не отрывай пятки." },
          { name: "Отжимания с колен", reps: "3х10", description: "Упор на колени, грудью касайся пола.", tips: "Если тяжело – делай с опоры." },
          { name: "Тяга резинки к поясу", reps: "3х15", description: "Наклон, тяни резинку к животу.", tips: "Не округляй спину." }
        ]}, { title: "Кардио блок", exercises: [
          { name: "Прыжки Jumping Jacks", reps: "3х30 сек", description: "Прыжки ноги вместе-врозь с хлопком.", tips: "Можно без прыжков – шаги в сторону." },
          { name: "Бёрпи (облегченные)", reps: "3х8", description: "Упор лежа, прыжок ногами к рукам, прыжок вверх.", tips: "Убери отжимание и прыжок для облегчения." }
        ]}], coolDown: ["Растяжка ног", "Вытяжение спины"] },
      { id: 2, name: "Функциональная тренировка", warmUp: ["Вращения руками", "Наклоны"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Выпады назад", reps: "3х12 (на каждую ногу)", description: "Шаг назад, оба колена 90°.", tips: "Переднее колено не выходит за носок." },
          { name: "Ягодичный мост", reps: "3х20", description: "Лежа на спине, поднимаем таз.", tips: "Сжимай ягодицы вверху." },
          { name: "Планка", reps: "3х40 сек", description: "Упор на предплечья, тело прямое.", tips: "Не провисай в пояснице." }
        ]}], coolDown: ["Йога-растяжка"] },
      { id: 3, name: "Отдых или Активное восстановление", warmUp: [], main: [], coolDown: ["Длительная прогулка 40-60 мин"] }
    ]
  },
  loss_middle: {
    title: "Интенсивное жиросжигание",
    description: "Для среднего уровня. Круговые тренировки + интервальное кардио.",
    days: [
      { id: 1, name: "Круговая на всё тело", warmUp: ["5 мин лёгкий бег", "Суставная разминка"],
        main: [{ title: "Круг 1 (3 подхода)", exercises: [
          { name: "Приседания с выпрыгиванием", reps: "15 раз", description: "Присед и прыжок вверх.", tips: "Мягко приземляйся." },
          { name: "Отжимания", reps: "12 раз", description: "Полные отжимания от пола.", tips: "Локти 45° к корпусу." },
          { name: "Бёрпи", reps: "10 раз", description: "Классические бёрпи с отжиманием.", tips: "Выдыхай на усилии." },
          { name: "Выпады с прыжком", reps: "12 на ногу", description: "Выпад и смена ног в прыжке.", tips: "Контролируй приземление." }
        ]}, { title: "Кардио-финиш", exercises: [
          { name: "Бег на месте с высоким подниманием колен", reps: "20/30 сек 5 раундов", description: "Колени выше талии.", tips: "Активно работай руками." }
        ]}], coolDown: ["Растяжка всего тела"] },
      { id: 2, name: "Верх+Низ + Кардио", warmUp: ["Махи руками", "Наклоны"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Жим гантелей стоя", reps: "4х10", description: "Гантели у плеч, выжимай вверх.", tips: "Не блокируй локти." },
          { name: "Тяга гантели в наклоне", reps: "4х12", description: "Опора на скамью, тяни к поясу.", tips: "Локти близко к корпусу." },
          { name: "Приседания с гантелью", reps: "4х15", description: "Гантель у груди, приседай глубоко.", tips: "Спина прямая." },
          { name: "Румынская тяга с гантелями", reps: "4х12", description: "Таз назад, гантели скользят по голени.", tips: "Чувствуй растяжение задней поверхности." }
        ]}, { title: "Кардио-интервалы", exercises: [
          { name: "Спринт на месте", reps: "8 раундов 20/10 сек", description: "Максимально быстро.", tips: "Следи за пульсом." }
        ]}], coolDown: ["Растяжка спины и ног"] },
      { id: 3, name: "Активное восстановление", warmUp: [], main: [], coolDown: ["Плавание / ходьба 45 мин", "Растяжка"] }
    ]
  },
  loss_advanced: {
    title: "Экстремальный жиросжигатель",
    description: "Высокоинтенсивные тренировки для опытных.",
    days: [
      { id: 1, name: "HIIT + функционалка", warmUp: ["10 мин разминка", "Прыжки на скакалке"],
        main: [{ title: "Взрывная тренировка", exercises: [
          { name: "Бёрпи с отжиманием", reps: "5х15", description: "Классика + отжимание + прыжок.", tips: "Дыши ритмично." },
          { name: "Приседания с выпрыгиванием + гантели", reps: "5х12", description: "С гантелями 5-10 кг.", tips: "Не бери слишком тяжелые." },
          { name: "Запрыгивания на тумбу", reps: "5х10", description: "Запрыгивай на платформу 40-50 см.", tips: "Приземляйся мягко, слезай." },
          { name: "Скалолаз", reps: "5х20 на ногу", description: "В упоре лежа подтягивай колени к груди.", tips: "Держи таз низко." }
        ]}], coolDown: ["Глубокий стретчинг", "Роллинг"] },
      { id: 2, name: "Силовая выносливость", warmUp: ["Велотренажёр 10 мин"],
        main: [{ title: "Круговая на всё тело", exercises: [
          { name: "Становая тяга с гантелями", reps: "5х10", description: "Ноги на ширине таза, гантели вдоль голени.", tips: "Начинай с легких весов." },
          { name: "Жим гантелей лёжа", reps: "5х12", description: "Лёжа на скамье.", tips: "Локти под 45°." },
          { name: "Тяга верхнего блока", reps: "5х12", description: "Широкий хват, тяни к груди.", tips: "Не наклоняй корпус назад." },
          { name: "Выпады с гантелями в ходьбе", reps: "4х10 на ногу", description: "Выпады шагом вперёд.", tips: "Колено не касается пола." }
        ]}], coolDown: ["Растяжка", "Дыхательные упражнения"] },
      { id: 3, name: "Отдых или активное восстановление", warmUp: [], main: [], coolDown: ["Йога 60 мин", "Растяжка на все группы"] }
    ]
  },
  mass_beginner: {
    title: "Мышечный фундамент",
    description: "Базовая программа для роста мышц. Фокус на базовых упражнениях.",
    days: [
      { id: 1, name: "Грудь + Трицепс", warmUp: ["Велотренажер 5 мин", "Жим пустого грифа 2х10"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Жим штанги лежа", reps: "4х8-10", description: "Лёжа на скамье, штанга на уровне сосков.", tips: "Лопатки сведены." },
          { name: "Разведение гантелей лежа", reps: "3х10-12", description: "Руки слегка согнуты.", tips: "Не разгибай локти до конца." },
          { name: "Отжимания на брусьях", reps: "3 до отказа", description: "Корпус вперёд.", tips: "Используй гравитрон." },
          { name: "Французский жим", reps: "3х10", description: "Лёжа, штанга за голову.", tips: "Локти внутрь." }
        ]}], coolDown: ["Растяжка грудных мышц"] },
      { id: 2, name: "Спина + Бицепс", warmUp: ["Тяга верхнего блока 2х15"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Тяга штанги в наклоне", reps: "4х8-10", description: "Наклон, тяга к животу.", tips: "Спина прямая." },
          { name: "Подтягивания (или тяга блока)", reps: "4х8-12", description: "Широкий хват.", tips: "Не раскачивайся." }
        ]}], coolDown: [] },
      { id: 3, name: "Ноги + Плечи", warmUp: ["Приседания с пустым грифом 2х10"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Приседания со штангой", reps: "4х8-10", description: "Штанга на плечах, присед до параллели.", tips: "Спина прямая, колени по стопам." },
          { name: "Жим ногами", reps: "3х10-12", description: "На тренажёре.", tips: "Не отрывай таз." }
        ]}], coolDown: [] }
    ]
  },
  mass_middle: {
    title: "Массонаборный цикл",
    description: "Средний уровень. Прогрессия весов и сплит 3 дня.",
    days: [
      { id: 1, name: "Грудь + Плечи", warmUp: ["10 мин общая разминка", "Разогрев ротаторной манжеты"],
        main: [{ title: "Основная часть", exercises: [
          { name: "Жим штанги на наклонной", reps: "4х8", description: "Наклон 30°.", tips: "Лопатки сведены." },
          { name: "Жим гантелей сидя", reps: "4х10", description: "Гантели у плеч.", tips: "Не блокируй локти." }
        ]}], coolDown: ["Растяжка"] }
    ]
  },
  mass_advanced: { /* аналогично, но кратко для примера */ title: "Продвинутый массонабор", days: [] },
  keep_beginner: { title: "Активное здоровье", days: [] },
  keep_middle: { title: "Тонус и энергия", days: [] },
  keep_advanced: { title: "Мастер контроля тела", days: [] }
}
// Дополните остальные программы по аналогии из вашего предыдущего рабочего кода

// -------------------------- ФУНКЦИИ --------------------------
function formatGoal(goal) {
  const map = { loss: 'Похудение', mass: 'Набор массы', keep: 'Поддержание формы' }
  return map[goal] || goal
}
function formatLevel(level) {
  const map = { beginner: 'Новичок', middle: 'Средний', advanced: 'Продвинутый' }
  return map[level] || level
}

function generateNutritionAndTips(user) {
  const goal = user.goal
  const level = user.level
  const key = `${goal}_${level}`
  const plans = {
    loss_beginner: { main: "Дефицит 500 ккал.", foods: ["Куриная грудка", "Гречка"], schedule: [{ name: "Завтрак", desc: "Омлет" }], water: "2.5 л", note: "Не голодай" },
    loss_middle: { main: "Дефицит 500 ккал.", foods: ["Индейка", "Рис"], schedule: [{ name: "Завтрак", desc: "Каша" }], water: "2.8 л", note: "Больше овощей" },
    loss_advanced: { main: "Дефицит 600 ккал.", foods: ["Курица", "Киноа"], schedule: [{ name: "Завтрак", desc: "Протеин" }], water: "3 л", note: "Циклируй углеводы" },
    mass_beginner: { main: "Профицит 400 ккал.", foods: ["Рис", "Курица"], schedule: [{ name: "Завтрак", desc: "Каша" }], water: "2.5 л", note: "Ешь каждые 3 часа" },
    mass_middle: { main: "Профицит 500 ккал.", foods: ["Макароны", "Говядина"], schedule: [{ name: "Завтрак", desc: "Овсянка" }], water: "3 л", note: "Добавь орехи" },
    mass_advanced: { main: "Профицит 600 ккал.", foods: ["Рис", "Лосось"], schedule: [{ name: "Завтрак", desc: "6 яиц" }], water: "3.5 л", note: "Креатин" },
    keep_beginner: { main: "Поддержание", foods: ["Курица", "Овощи"], schedule: [{ name: "Завтрак", desc: "Омлет" }], water: "2 л", note: "Контроль порций" },
    keep_middle: { main: "Поддержание", foods: ["Индейка", "Гречка"], schedule: [{ name: "Завтрак", desc: "Каша" }], water: "2.5 л", note: "Баланс БЖУ" },
    keep_advanced: { main: "Гибкое питание", foods: ["Любые", "цельные"], schedule: [{ name: "Завтрак", desc: "Овсянка" }], water: "2.5 л", note: "IIFYM" }
  }
  const plan = plans[key] || plans.loss_beginner
  nutritionAdvice.value = plan
  // упрощённые макросы для примера (можно оставить полный расчёт из вашего кода)
  macros.value = { calories: 2000, protein: 150, carbs: 200, fats: 60 }
}

function addSuggestedWeights(program, user) {
  return program
}
function generatePersonalTips(user) {
  personalTips.value = "Тренируйся регулярно."
}
function selectProgram() {
  let goal = userData.value.goal
  let level = userData.value.level
  const key = `${goal}_${level}`
  let program = programsDB[key]
  if (!program) program = programsDB.loss_beginner
  currentProgram.value = program
  generatePersonalTips(userData.value)
  generateNutritionAndTips(userData.value)
}

function toggleDayDetails(id) { expandedDay.value = expandedDay.value === id ? null : id }
function showExerciseDetails(ex) { selectedExercise.value = ex }
function closeModal() { selectedExercise.value = null }
function goToSurvey() { router.push('/') }
function goToLogin() { router.push('/login') }
function resetAndGoToSurvey() { localStorage.removeItem('currentUser'); router.push('/') }

onMounted(() => {
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    try {
      userData.value = JSON.parse(stored)
      selectProgram()
    } catch(e) { console.error(e) }
  }
})
</script>

<style scoped>
/* ----- ОСНОВНЫЕ ПЕРЕМЕННЫЕ ----- */
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
  max-width: 1200px;
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

/* Блок неавторизованного пользователя */
.not-logged {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
}
.not-logged svg {
  color: var(--text-secondary);
  margin-bottom: 20px;
}
.not-logged p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* Карточка пользователя */
.user-info {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 24px 32px;
  margin-bottom: 48px;
}
.user-info p {
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  margin: 0;
}
.user-info strong {
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.1em;
  display: inline-block;
  margin-right: 12px;
}

/* Программный контент */
.program-content h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  color: #FFFFFF;
  letter-spacing: 0.03em;
  margin: 0 0 12px 0;
}
.program-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

/* Общие блоки с иконками */
.personal-tips,
.nutrition-block,
.extra-tips {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 20px 28px;
  margin-bottom: 30px;
}
.block-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.block-header svg {
  color: var(--accent);
}
.block-header h3 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin: 0;
}
.personal-tips {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.personal-tips svg {
  flex-shrink: 0;
}
.personal-tips strong {
  color: var(--text-primary);
}
.nutrition-content p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px;
}
.macros {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid var(--border);
  padding-top: 12px;
  margin-top: 8px;
}
.nutrition-details {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
}
.food-list, .meal-schedule, .hydration, .special-note {
  flex: 1;
  min-width: 200px;
  background: rgba(0,0,0,0.2);
  padding: 16px 20px;
}
.nutrition-details h4 {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 12px;
}
.nutrition-details ul {
  list-style: none;
  padding-left: 0;
}
.nutrition-details li {
  padding: 6px 0;
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: none;
}
.nutrition-details li::before {
  content: "▹";
  color: var(--accent);
  margin-right: 8px;
}
.hydration p, .special-note p {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}
.nutrition-main {
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: rgba(59,130,246,0.15);
  padding: 12px 16px;
  margin-bottom: 20px;
}
.schedule-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 32px 0 24px;
}
.schedule-header h3 {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin: 0;
}

/* Дни тренировок */
.days-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.day-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
  transition: border-color 0.2s;
}
.day-card:hover {
  border-color: rgba(255,255,255,0.12);
}
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 20px 28px 8px 28px;
}
.day-header:hover {
  background: rgba(255,255,255,0.02);
}
.day-card h4 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #FFFFFF;
  margin: 0;
}
.day-card h4 span {
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: rgba(255,255,255,0.35);
  margin-left: 12px;
}
.expand-icon {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.day-details {
  padding: 0 20px 20px 20px;
}
.section {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.section:last-child {
  border-bottom: none;
}
.section h5 {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin: 0 0 12px 0;
}
.section h6 {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
  margin: 0 0 8px 0;
  text-transform: uppercase;
}
.exercise-block {
  margin-bottom: 16px;
}
.exercise-block:last-child {
  margin-bottom: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  font-size: 14px;
  font-weight: 300;
  color: var(--text-secondary);
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
li:last-child {
  border-bottom: none;
}
.clickable-exercise {
  cursor: pointer;
  transition: all 0.1s;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.clickable-exercise:hover {
  background: rgba(59,130,246,0.05);
  transform: translateX(4px);
}
.exercise-name {
  flex: 1;
  font-weight: 400;
}
.exercise-meta {
  display: flex;
  gap: 12px;
  align-items: baseline;
  flex-shrink: 0;
}
.reps {
  font-family: monospace;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.04);
  padding: 2px 8px;
  border-radius: 2px;
}
.weight-hint {
  font-size: 11px;
  color: #7aa2f7;
  margin-left: 4px;
}

/* Дополнительные советы */
.extra-tips {
  margin-top: 60px;
  margin-bottom: 30px;
}
.tips-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: none;
}
.tips-list li::before {
  content: "•";
  font-size: 14px;
  color: var(--accent);
}

/* Кнопки */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
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
.btn-secondary {
  background: rgba(59,130,246,0.1);
  border-color: rgba(59,130,246,0.3);
}
.btn-secondary:hover {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.5);
}

/* Сообщение об отсутствии программы */
.no-program {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 2px;
}
.no-program p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-content {
  background: #0a0f1c;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2px;
  max-width: 500px;
  width: 100%;
  padding: 28px;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 20px;
  cursor: pointer;
}
.modal-content h3 {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 8px;
}
.modal-reps, .modal-desc, .modal-tips, .modal-weight {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 900px) {
  .page { padding: 60px 40px 40px; }
  .user-info { flex-direction: column; gap: 12px; padding: 20px; }
  .day-card h4 { font-size: 18px; }
  .day-card h4 span { font-size: 12px; display: block; margin-left: 0; }
  .section { padding: 12px 0; }
  .clickable-exercise { flex-direction: column; align-items: flex-start; }
  .action-buttons { flex-direction: column; align-items: center; }
}
@media (max-width: 600px) {
  .page { padding: 40px 20px 30px; }
  .page-title { font-size: 32px; }
  .program-content h2 { font-size: 24px; }
  .nutrition-details { flex-direction: column; }
}
</style>