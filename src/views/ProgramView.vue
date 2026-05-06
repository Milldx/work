<template>
  <div class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">Твой план</p>
      <h1 class="page-title">Программа тренировок</h1>

      <!-- Блок с данными пользователя -->
      <div v-if="userData" class="user-info">
        <p><strong>Цель:</strong> {{ formatGoal(userData.goal) }}</p>
        <p><strong>Уровень:</strong> {{ formatLevel(userData.level) }}</p>
        <p><strong>Рост:</strong> {{ userData.height }} см</p>
        <p><strong>Вес:</strong> {{ userData.weight }} кг</p>
        <p v-if="userData.gender"><strong>Пол:</strong> {{ userData.gender === 'male' ? 'Мужской' : 'Женский' }}</p>
        <p v-if="userData.waist"><strong>Талия:</strong> {{ userData.waist }} см</p>
      </div>

      <!-- Блок с программой -->
      <div v-if="currentProgram" class="program-content">
        <h2>{{ currentProgram.title }}</h2>
        <p class="program-desc">{{ currentProgram.description }}</p>

        <!-- Персональные рекомендации (общие) -->
        <div class="personal-tips">
          <p>💡 <strong>Персональные рекомендации:</strong> {{ personalTips }}</p>
        </div>

        <!-- Расширенный блок питания -->
        <div class="nutrition-block">
          <h3>🍽️ Персональный план питания</h3>
          <div class="nutrition-content">
            <p class="nutrition-main">{{ nutritionAdvice.main }}</p>

            <div class="macros" v-if="macros">
              <span>🔥 Калории: {{ macros.calories }} ккал/день</span>
              <span>🥩 Белки: {{ macros.protein }} г</span>
              <span>🍚 Углеводы: {{ macros.carbs }} г</span>
              <span>🧈 Жиры: {{ macros.fats }} г</span>
            </div>

            <div class="nutrition-details">
              <div class="food-list">
                <h4>✅ Рекомендуемые продукты</h4>
                <ul>
                  <li v-for="food in nutritionAdvice.foods" :key="food">{{ food }}</li>
                </ul>
              </div>
              <div class="meal-schedule">
                <h4>⏰ Режим питания (пример)</h4>
                <ul>
                  <li v-for="meal in nutritionAdvice.schedule" :key="meal.name">
                    <strong>{{ meal.name }}:</strong> {{ meal.desc }}
                  </li>
                </ul>
              </div>
              <div class="hydration">
                <h4>💧 Вода</h4>
                <p>{{ nutritionAdvice.water }}</p>
              </div>
              <div class="special-note" v-if="nutritionAdvice.note">
                <h4>📌 Особое внимание</h4>
                <p>{{ nutritionAdvice.note }}</p>
              </div>
            </div>
          </div>
        </div>

        <h3>📅 Расписание тренировок (нажми на день для деталей)</h3>
        <div class="days-container">
          <div v-for="day in currentProgram.days" :key="day.id" class="day-card">
            <div class="day-header" @click="toggleDayDetails(day.id)">
              <h4>День {{ day.id }}: <span>{{ day.name }}</span></h4>
              <span class="expand-icon">{{ expandedDay === day.id ? '▲' : '▼' }}</span>
            </div>

            <div v-if="expandedDay === day.id" class="day-details">
              <div v-if="day.warmUp && day.warmUp.length" class="section">
                <h5>🔥 Разминка (5-10 мин):</h5>
                <ul>
                  <li v-for="ex in day.warmUp" :key="ex">{{ ex }}</li>
                </ul>
              </div>

              <div v-if="day.main && day.main.length" class="section">
                <h5>⚡ Основная часть:</h5>
                <div v-for="(block, index) in day.main" :key="index" class="exercise-block">
                  <h6>{{ block.title }}</h6>
                  <ul>
                    <li v-for="(ex, i) in block.exercises" :key="i" @click="showExerciseDetails(ex, day.id, i)" class="clickable-exercise">
                      {{ ex.name }} — <span class="reps">{{ ex.reps }}</span>
                      <span class="weight-hint" v-if="ex.suggestedWeight">⏐ {{ ex.suggestedWeight }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="day.coolDown && day.coolDown.length" class="section">
                <h5>🧘 Заминка / Растяжка (5-10 мин):</h5>
                <ul>
                  <li v-for="ex in day.coolDown" :key="ex">{{ ex }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Дополнительные советы внизу -->
        <div class="extra-tips">
          <h3>💪 Полезные советы</h3>
          <ul>
            <li>✔️ Всегда делай разминку перед тренировкой и заминку после.</li>
            <li>✔️ Пей воду во время тренировки (150-300 мл каждые 15-20 минут).</li>
            <li>✔️ Отдых между подходами: 60-90 сек (при похудении 30-45 сек).</li>
            <li>✔️ Прогрессируй нагрузку: увеличивай вес, когда можешь сделать на 2 повторения больше.</li>
            <li>✔️ Сон не менее 7-8 часов – ключ к восстановлению.</li>
          </ul>
        </div>
      </div>

      <!-- Если программа не найдена -->
      <div v-else class="no-program">
        <p>К сожалению, не удалось подобрать программу. Пожалуйста, заполни анкету заново.</p>
        <button class="btn-back" @click="goToSurvey()">Вернуться к анкете</button>
      </div>
    </div>

    <!-- Модальное окно с деталями упражнения -->
    <div v-if="selectedExercise" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">✕</button>
        <h3>{{ selectedExercise.name }}</h3>
        <p class="modal-reps">Выполнение: {{ selectedExercise.reps }}</p>
        <p class="modal-desc"><strong>Описание:</strong> {{ selectedExercise.description || 'Нет описания. Следуй технике безопасности, держи спину прямой, не используй инерцию.' }}</p>
        <p class="modal-tips"><strong>💡 Советы:</strong> {{ selectedExercise.tips || 'Сосредоточься на технике, дыши равномерно, не гонись за весом.' }}</p>
        <p v-if="selectedExercise.suggestedWeight" class="modal-weight"><strong>🏋️ Рекомендуемый вес:</strong> {{ selectedExercise.suggestedWeight }}</p>
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

// -------------------------- БАЗА ДАННЫХ (9 программ) --------------------------
const programsDB = {
  // ----- ПОХУДЕНИЕ -----
  loss_beginner: {
    title: "Старт похудения",
    description: "Программа для новичков. Акцент на жиросжигание и тонус мышц без перегрузки.",
    days: [
      { id: 1, name: "Full Body + Кардио", warmUp: ["Суставная гимнастика", "Бег на месте 2 мин"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Приседания с собственным весом", reps: "3х15", description: "Ноги на ширине плеч, спина прямая, колени до 90°.", tips: "Не отрывай пятки, колени не выводи за носки." },
          { name: "Отжимания с колен", reps: "3х10", description: "Упор на колени, грудью касайся пола.", tips: "Если тяжело – делай с опоры (диван)." },
          { name: "Тяга резинки к поясу", reps: "3х15", description: "Наклон, тяни резинку к животу, сводя лопатки.", tips: "Не округляй спину." }
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
  // ----- НАБОР МАССЫ -----
  mass_beginner: {
    title: "Мышечный фундамент",
    description: "Базовая программа для роста мышц. Фокус на базовых упражнениях.",
    days: [
      { id: 1, name: "Грудь + Трицепс", warmUp: ["Велотренажер 5 мин", "Жим пустого грифа 2х10"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Жим штанги лежа", reps: "4х8-10", description: "Лёжа на скамье, штанга на уровне сосков.", tips: "Лопатки сведены, мост не сильный." },
          { name: "Разведение гантелей лежа", reps: "3х10-12", description: "Руки слегка согнуты.", tips: "Не разгибай локти до конца." },
          { name: "Отжимания на брусьях", reps: "3 до отказа", description: "Корпус вперёд.", tips: "Используй гравитрон при необходимости." },
          { name: "Французский жим", reps: "3х10", description: "Лёжа, штанга за голову.", tips: "Локти внутрь." }
        ]}], coolDown: ["Растяжка грудных мышц"] },
      { id: 2, name: "Спина + Бицепс", warmUp: ["Тяга верхнего блока 2х15"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Тяга штанги в наклоне", reps: "4х8-10", description: "Наклон, тяга к животу.", tips: "Спина прямая." },
          { name: "Подтягивания (или тяга блока)", reps: "4х8-12", description: "Широкий хват.", tips: "Не раскачивайся." },
          { name: "Тяга гантели одной рукой", reps: "3х10-12", description: "Опора на скамью.", tips: "Локоть близко к корпусу." },
          { name: "Подъем штанги на бицепс", reps: "3х10", description: "Стойка, штанга к груди.", tips: "Без рывков." }
        ]}], coolDown: [] },
      { id: 3, name: "Ноги + Плечи", warmUp: ["Приседания с пустым грифом 2х10"],
        main: [{ title: "Силовой блок", exercises: [
          { name: "Приседания со штангой", reps: "4х8-10", description: "Штанга на плечах, присед до параллели.", tips: "Спина прямая, колени по стопам." },
          { name: "Жим ногами", reps: "3х10-12", description: "На тренажёре.", tips: "Не отрывай таз." },
          { name: "Жим гантелей сидя", reps: "4х8-10", description: "Гантели вверх.", tips: "Локти не блокируй." },
          { name: "Махи гантелями в стороны", reps: "3х12-15", description: "Лёгкие гантели.", tips: "Контролируй движение." }
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
          { name: "Жим гантелей сидя", reps: "4х10", description: "Гантели у плеч.", tips: "Не блокируй локти." },
          { name: "Махи гантелями в стороны", reps: "4х12", description: "Локти чуть согнуты.", tips: "Без инерции." },
          { name: "Жим Арнольда", reps: "3х10", description: "Поворот кистей.", tips: "Следи за запястьями." },
          { name: "Пуловер с гантелей", reps: "3х12", description: "Лёжа поперёк скамьи.", tips: "Растягивай грудные." }
        ]}], coolDown: ["Растяжка"] },
      { id: 2, name: "Спина + Бицепс", warmUp: ["Гиперэкстензии 2х15"],
        main: [{ title: "Основная часть", exercises: [
          { name: "Тяга штанги в наклоне", reps: "4х8", description: "Тяга к поясу.", tips: "Своди лопатки." },
          { name: "Тяга нижнего блока к поясу", reps: "4х10", description: "Сидя, рукоятка V.", tips: "Не наклоняйся вперёд." },
          { name: "Тяга гантели одной рукой", reps: "4х12", description: "Опора на скамью.", tips: "Локоть близко." },
          { name: "Подтягивания с весом", reps: "3х8", description: "Дополнительный груз.", tips: "Чистые движения." },
          { name: "Сгибания рук со штангой", reps: "4х10", description: "Стойка, штанга.", tips: "Локти прижаты." },
          { name: "Молотковые сгибания", reps: "3х12", description: "Гантели нейтральным хватом.", tips: "Без раскачки." }
        ]}], coolDown: [] },
      { id: 3, name: "Ноги", warmUp: ["Приседания с пустым грифом"],
        main: [{ title: "Основная часть", exercises: [
          { name: "Приседания со штангой", reps: "5х5", description: "Тяжёлые приседания.", tips: "Поясница прямая." },
          { name: "Румынская тяга", reps: "4х10", description: "Ноги прямые, таз назад.", tips: "Растяжение бицепса бедра." },
          { name: "Жим ногами", reps: "4х12", description: "Широкая постановка.", tips: "Полная амплитуда." },
          { name: "Выпады с гантелями", reps: "3х12 на ногу", description: "Шаг вперёд.", tips: "Колено 90°." },
          { name: "Икры стоя", reps: "4х15", description: "В тренажёре.", tips: "Задержка вверху." }
        ]}], coolDown: ["Растяжка ног"] }
    ]
  },
  mass_advanced: {
    title: "Продвинутый массонабор",
    description: "Интенсивные тренировки с периодизацией.",
    days: [
      { id: 1, name: "Тяжёлый день: грудь/спина", warmUp: ["15 мин кардио", "Динамическая растяжка"],
        main: [{ title: "Суперсеты", exercises: [
          { name: "Жим штанги лёжа + Тяга штанги в наклоне", reps: "5х5", description: "Суперсет без отдыха.", tips: "Большой вес, качество." },
          { name: "Отжимания на брусьях + Подтягивания", reps: "4х10", description: "Суперсет.", tips: "Контролируй негатив." },
          { name: "Разведение гантелей + Тяга гантели одной рукой", reps: "4х12", description: "Суперсет.", tips: "Плавно." }
        ]}], coolDown: ["Растяжка мышц кора"] },
      { id: 2, name: "Ноги + Акцент на квадрицепсы", warmUp: ["Велотренажёр"],
        main: [{ title: "Основная часть", exercises: [
          { name: "Приседания со штангой", reps: "5х5", description: "Тяжёлые.", tips: "Поясница заблокирована." },
          { name: "Фронтальные приседания", reps: "4х8", description: "Штанга на груди.", tips: "Локти высоко." },
          { name: "Румынская тяга", reps: "4х10", description: "Акцент на бицепс бедра.", tips: "Колени мягкие." },
          { name: "Выпады с гантелями", reps: "4х12 на ногу", description: "В ходьбе.", tips: "Колено не касается." },
          { name: "Икры стоя", reps: "5х15", description: "Полный диапазон.", tips: "Задержка 2 сек." }
        ]}], coolDown: [] },
      { id: 3, name: "Дельты + Руки", warmUp: ["Махи гантелями лёгкими"],
        main: [{ title: "Основная часть", exercises: [
          { name: "Жим штанги из-за головы", reps: "4х8", description: "Сидя.", tips: "Локти вперёд." },
          { name: "Махи в стороны + Махи перед собой", reps: "4х12", description: "Дроп-сет.", tips: "Без рывков." },
          { name: "Концентрированные сгибания на бицепс", reps: "4х10", description: "Сидя, рука на бедро.", tips: "Пиковое сокращение." },
          { name: "Французский жим лёжа", reps: "4х10", description: "Штанга EZ.", tips: "Локти неподвижны." },
          { name: "Молотки", reps: "3х12", description: "Гантели нейтрально.", tips: "Не спеши." }
        ]}], coolDown: ["Растяжка рук и плеч"] }
    ]
  },
  // ----- ПОДДЕРЖАНИЕ ФОРМЫ -----
  keep_beginner: {
    title: "Активное здоровье",
    description: "Умеренные тренировки для тонуса и хорошего самочувствия.",
    days: [
      { id: 1, name: "Общая физическая подготовка", warmUp: ["Суставная гимнастика 5 мин"],
        main: [{ title: "Круг для всего тела", exercises: [
          { name: "Приседания", reps: "3х12", description: "С собственным весом.", tips: "Колени по стопам." },
          { name: "Отжимания от стены/колен", reps: "3х8", description: "Облегчённый вариант.", tips: "Держи корпус прямым." },
          { name: "Махи ногами назад стоя", reps: "3х15", description: "Упор на руки.", tips: "Ягодицы напряжены." },
          { name: "Планка", reps: "3х20 сек", description: "На предплечьях.", tips: "Не провисай в пояснице." }
        ]}], coolDown: ["Растяжка"] },
      { id: 2, name: "Кардио + Растяжка", warmUp: [], main: [{ title: "Кардио", exercises: [{ name: "Быстрая ходьба 30 мин", reps: "", description: "Пульсовая зона 2." }]}], coolDown: ["Йога 15 мин"] },
      { id: 3, name: "Отдых", warmUp: [], main: [], coolDown: ["Прогулка на свежем воздухе"] }
    ]
  },
  keep_middle: {
    title: "Тонус и энергия",
    description: "Для поддержания формы и улучшения выносливости.",
    days: [
      { id: 1, name: "Функциональный микс", warmUp: ["Разминка 5 мин"],
        main: [{ title: "Круговая", exercises: [
          { name: "Приседания с гантелями", reps: "3х15", description: "Гантель у груди.", tips: "Спина прямая." },
          { name: "Отжимания", reps: "3х12", description: "От пола.", tips: "Локти 45°." },
          { name: "Выпады с гантелями", reps: "3х10 на ногу", description: "В ходьбе.", tips: "Колено не касается." },
          { name: "Планка с подъемом руки", reps: "3х30 сек", description: "Попеременно.", tips: "Таз неподвижен." }
        ]}], coolDown: ["Растяжка"] },
      { id: 2, name: "Интервальное кардио", warmUp: [], main: [{ title: "Кардио-интервалы", exercises: [{ name: "30 сек бег / 30 сек шаг", reps: "15 раундов" }]}], coolDown: ["Заминка и растяжка"] },
      { id: 3, name: "Йога / Пилатес", warmUp: [], main: [{ title: "Гибкость и кор", exercises: [
        { name: "Собака мордой вниз", reps: "удержание 1 мин", description: "Дыхание.", tips: "Пятки тянуть вниз." },
        { name: "Поза планки", reps: "3х30 сек", description: "Классическая.", tips: "Втяни живот." },
        { name: "Мостик", reps: "3х10", description: "Подъём таза.", tips: "Ягодицы включать." }
      ]}], coolDown: ["Шавасана"] }
    ]
  },
  keep_advanced: {
    title: "Мастер контроля тела",
    description: "Для тех, кто хочет оставаться в отличной форме.",
    days: [
      { id: 1, name: "Силовая выносливость", warmUp: ["Динамическая растяжка"],
        main: [{ title: "Круговая из базовых", exercises: [
          { name: "Становая тяга с гантелями", reps: "4х12", description: "Ноги прямые.", tips: "Спина прямая." },
          { name: "Жим гантелей лёжа", reps: "4х12", description: "Умеренный вес.", tips: "Без пауз." },
          { name: "Приседания с гантелью над головой", reps: "4х10", description: "Гантель вверх.", tips: "Корпус ровно." },
          { name: "Тяга гантели в наклоне", reps: "4х12", description: "Опора на скамью.", tips: "Локоть к корпусу." },
          { name: "Боковые выпады", reps: "3х10", description: "В сторону.", tips: "Колено по стопе." }
        ]}], coolDown: ["Стретчинг"] },
      { id: 2, name: "Кондиционное кардио", warmUp: [], main: [{ title: "Бег или велосипед", exercises: [{ name: "40 минут в пульсовой зоне 2-3", reps: "" }]}], coolDown: ["Растяжка"] },
      { id: 3, name: "Восстановление", warmUp: [], main: [], coolDown: ["Массаж роллом", "Баня/сауна по желанию"] }
    ]
  }
}

// -------------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ --------------------------
function formatGoal(goal) {
  const map = { loss: 'Похудение', mass: 'Набор массы', keep: 'Поддержание формы' }
  return map[goal] || goal
}
function formatLevel(level) {
  const map = { beginner: 'Новичок', middle: 'Средний', advanced: 'Продвинутый' }
  return map[level] || level
}

// -------------------------- РАСШИРЕННОЕ ПИТАНИЕ --------------------------
function generateNutritionAndTips(user) {
  const weight = parseFloat(user.weight)
  const height = parseFloat(user.height)
  const goal = user.goal
  const level = user.level
  const gender = user.gender
  const age = user.age || 30

  // BMR по Миффлину-Сан Жеору
  let bmr
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }
  let activityFactor = 1.375 // beginner по умолчанию
  if (level === 'middle') activityFactor = 1.55
  else if (level === 'advanced') activityFactor = 1.725
  const tdee = bmr * activityFactor

  let calories, protein, carbs, fats
  let main = ''
  let foods = []
  let schedule = []
  let water = ''
  let note = ''

  if (goal === 'loss') {
    calories = tdee - 500
    protein = weight * 1.8
    carbs = (calories * 0.35) / 4
    fats = (calories * 0.25) / 9
    main = `Для эффективного похудения создай дефицит ~500 ккал в день. Упор на белок и клетчатку. Исключи быстрые углеводы, сахар, жареное.`
    foods = ['Куриная грудка', 'Индейка', 'Творог 5%', 'Яйца', 'Рыба (минтай, треска)', 'Овощи (брокколи, огурцы)', 'Гречка', 'Овсянка', 'Зелень', 'Авокадо (1/2 в день)']
    schedule = [
      { name: 'Завтрак 8:00', desc: 'Омлет из 2 яиц + овсянка на воде + ягоды' },
      { name: 'Перекус 11:00', desc: 'Творог 150г или протеиновый коктейль' },
      { name: 'Обед 14:00', desc: 'Куриная грудка 150г + гречка 80г + салат из огурцов' },
      { name: 'Полдник 17:00', desc: 'Яблоко или горсть орехов (10г)' },
      { name: 'Ужин 19:30', desc: 'Рыба на пару 150г + тушеные овощи' }
    ]
    water = '2.5–3 литра в день. Стакан воды перед каждым приёмом пищи для ускорения метаболизма.'
    note = 'Не снижай калории ниже 1500 для мужчин и 1200 для женщин – это замедлит обмен веществ.'
  } else if (goal === 'mass') {
    calories = tdee + 400
    protein = weight * 2.0
    carbs = (calories * 0.5) / 4
    fats = (calories * 0.25) / 9
    main = `Для набора мышечной массы нужен профицит ~400 ккал. Ешь каждые 3–4 часа, делай упор на сложные углеводы и белок.`
    foods = ['Курица', 'Говядина', 'Творог 9%', 'Рис (бурый, белый)', 'Гречка', 'Макароны из твёрдых сортов', 'Орехи', 'Бананы', 'Картофель', 'Протеин', 'Яйца']
    schedule = [
      { name: 'Завтрак 7:30', desc: 'Каша на молоке + 3 яйца + орехи' },
      { name: 'Второй завтрак 10:30', desc: 'Бутерброд с индейкой + банан' },
      { name: 'Обед 13:30', desc: 'Говядина 200г + рис 150г + овощи' },
      { name: 'Перед тренировкой 16:30', desc: 'Овсянка с протеином или 2 тоста с арахисовой пастой' },
      { name: 'После тренировки 19:00', desc: 'Протеин + быстрые углеводы (банан/сок)' },
      { name: 'Ужин 20:00', desc: 'Творог 200г или рыба + гречка' }
    ]
    water = '3–3.5 литра в день – мышцы задерживают воду, потребность выше.'
    note = 'Не бойся жиров – они нужны для синтеза тестостерона. Добавляй оливковое масло, орехи.'
  } else { // keep
    calories = tdee
    protein = weight * 1.6
    carbs = (calories * 0.45) / 4
    fats = (calories * 0.25) / 9
    main = `Поддержание формы. Сбалансированное питание без лишних дефицитов. Контролируй порции и качество продуктов.`
    foods = ['Курица', 'Рыба', 'Творог', 'Крупы (гречка, киноа)', 'Овощи', 'Фрукты', 'Орехи', 'Яйца', 'Цельнозерновой хлеб']
    schedule = [
      { name: 'Завтрак', desc: 'Овсянка с ягодами + 2 яйца' },
      { name: 'Обед', desc: 'Гречка + куриная грудка + салат' },
      { name: 'Ужин', desc: 'Творог или рыба с овощами' },
      { name: 'Перекус', desc: 'Фрукт / горсть орехов / протеин' }
    ]
    water = '2–2.5 литра – для тонуса кожи и метаболизма.'
    note = 'Не увлекайся сладким даже при поддержке – быстрые углеводы вызывают скачки инсулина.'
  }

  if (gender === 'female') {
    if (goal === 'mass') foods.push('Больше листовой зелени для железа')
    if (goal === 'loss') note += ' Женщинам важно не урезать жиры ниже 0.8 г/кг веса – для гормонального здоровья.'
  }
  if (level === 'beginner') {
    schedule = schedule.slice(0, 4)
    main += ' Начинай с небольших порций, не голодай между приемами пищи.'
  }

  macros.value = { calories: Math.round(calories), protein: Math.round(protein), carbs: Math.round(carbs), fats: Math.round(fats) }
  nutritionAdvice.value = { main, foods, schedule, water, note }
}

// -------------------------- ДОБАВЛЕНИЕ РЕКОМЕНДУЕМЫХ ВЕСОВ --------------------------
function addSuggestedWeights(program, user) {
  const weight = parseFloat(user.weight)
  const level = user.level
  const gender = user.gender
  const goal = user.goal

  program.days.forEach(day => {
    if (day.main) {
      day.main.forEach(block => {
        block.exercises.forEach(ex => {
          let baseWeight = 0
          const exName = ex.name.toLowerCase()
          if (exName.includes('присед') && !exName.includes('выпрыг')) baseWeight = gender === 'male' ? 30 : 20
          else if (exName.includes('жим гантелей') || exName.includes('французский')) baseWeight = gender === 'male' ? 12 : 8
          else if (exName.includes('тяга') && !exName.includes('резин')) baseWeight = gender === 'male' ? 15 : 10
          else if (exName.includes('бицепс')) baseWeight = gender === 'male' ? 12 : 8
          else if (exName.includes('махи в стороны')) baseWeight = gender === 'male' ? 6 : 4
          else if (exName.includes('выпады с гантелями')) baseWeight = gender === 'male' ? 10 : 7
          else if (exName.includes('становая')) baseWeight = gender === 'male' ? 40 : 25

          if (level === 'middle') baseWeight = Math.round(baseWeight * 1.3)
          else if (level === 'advanced') baseWeight = Math.round(baseWeight * 1.6)
          if (weight > 80 && goal === 'mass') baseWeight = Math.round(baseWeight * 1.2)
          if (weight < 60 && goal === 'loss') baseWeight = Math.round(baseWeight * 0.8)

          if (baseWeight > 0) ex.suggestedWeight = `~${baseWeight} кг`
        })
      })
    }
  })
  return program
}

// -------------------------- ПЕРСОНАЛЬНЫЕ СОВЕТЫ --------------------------
function generatePersonalTips(user) {
  const tips = []
  if (user.goal === 'loss' && user.weight > 90) tips.push('При высоком весе избегай прыжков, замени бег на ходьбу или эллипс.')
  if (user.goal === 'mass' && user.weight < 65) tips.push('Для набора массы ешь каждые 3 часа, добавь протеин или гейнер.')
  if (user.level === 'beginner') tips.push('Новичок – сначала отработай технику с маленьким весом, не гонись за цифрами.')
  if (user.level === 'advanced') tips.push('Продвинутый – используй периодизацию нагрузки, меняй упражнения каждые 6-8 недель.')
  if (user.gender === 'female' && user.goal === 'mass') tips.push('Девушкам больше внимания на ягодицы и ноги, добавь румынскую тягу и выпады.')
  personalTips.value = tips.join(' ') || 'Тренируйся регулярно, слушай своё тело и прогрессируй плавно.'
}

// -------------------------- ВЫБОР ПРОГРАММЫ --------------------------
function selectProgram() {
  const goal = userData.value.goal
  const level = userData.value.level
  const key = `${goal}_${level}`
  let program = programsDB[key]
  if (!program) {
    if (goal === 'loss') program = programsDB.loss_beginner
    else if (goal === 'mass') program = programsDB.mass_beginner
    else program = programsDB.keep_beginner
  }
  const cloned = JSON.parse(JSON.stringify(program))
  const withWeights = addSuggestedWeights(cloned, userData.value)
  currentProgram.value = withWeights
  generatePersonalTips(userData.value)
  generateNutritionAndTips(userData.value)
}

// -------------------------- ИНТЕРАКТИВНОСТЬ --------------------------
function toggleDayDetails(dayId) {
  expandedDay.value = expandedDay.value === dayId ? null : dayId
}
function showExerciseDetails(exercise) {
  selectedExercise.value = exercise
}
function closeModal() {
  selectedExercise.value = null
}

// -------------------------- ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ --------------------------
onMounted(() => {
  const stored = localStorage.getItem('currentUser')
  if (stored) {
    try {
      userData.value = JSON.parse(stored)
      if (!userData.value.age) userData.value.age = 30
      selectProgram()
    } catch (e) {
      console.error(e)
    }
  } else {
    router.push('/')
  }
})

function goToSurvey() {
  router.push('/')
}
</script>

<style scoped>
/* ----- ОСНОВНЫЕ ПЕРЕМЕННЫЕ ----- */
:root {
  --bg-dark: #0a0c12;
  --bg-card: rgba(18, 22, 35, 0.7);
  --border-glow: rgba(80, 150, 255, 0.2);
  --accent: #3b82f6;
  --accent-glow: #2563eb;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 20% 30%, #0e121f, #020408);
  padding: 100px 80px 80px;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 50% 60% at 70% 20%, rgba(59,130,246,0.15), transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.box {
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: fadeUp 0.8s ease-out;
}

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Типографика */
.page-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: linear-gradient(135deg, #a5b4fc, #818cf8);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 12px;
}

.page-title {
  font-family: 'Bebas Neue', 'Inter', sans-serif;
  font-size: 58px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: linear-gradient(to right, #ffffff, #cbd5e1);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 24px;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, transparent);
}

/* Карточка пользователя */
.user-info {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 48px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 24px 36px;
  margin-bottom: 52px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
  transition: var(--transition);
}

.user-info p {
  font-size: 14px;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.user-info strong {
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.12em;
  background: rgba(59,130,246,0.2);
  padding: 4px 8px;
  border-radius: 20px;
}

/* Программный контент */
.program-content h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 42px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.program-desc {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
}

.program-content h3 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: white;
  margin: 32px 0 24px;
}

/* Персонализированные блоки */
.personal-tips,
.nutrition-block,
.extra-tips {
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 28px;
  padding: 24px 32px;
  margin-bottom: 36px;
  transition: var(--transition);
}

.personal-tips:hover,
.nutrition-block:hover,
.extra-tips:hover {
  border-color: rgba(59,130,246,0.5);
  box-shadow: 0 8px 20px -8px rgba(59,130,246,0.2);
}

.nutrition-block h3,
.extra-tips h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: white;
  letter-spacing: -0.2px;
}

.nutrition-content p {
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.macros {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 48px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
}

.macros span {
  color: #cbd5e1;
}

.macros span::before {
  content: "⚡";
  margin-right: 6px;
  font-size: 12px;
}

.nutrition-details {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: space-between;
}
.food-list, .meal-schedule, .hydration, .special-note {
  flex: 1;
  min-width: 200px;
  background: rgba(0,0,0,0.2);
  border-radius: 20px;
  padding: 16px 20px;
}
.nutrition-details h4 {
  font-size: 14px;
  font-weight: 700;
  color: #a5b4fc;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
}
.nutrition-details ul {
  list-style: none;
  padding-left: 0;
}
.nutrition-details li {
  padding: 6px 0;
  border-bottom: none;
  display: list-item;
  font-size: 13px;
  color: #cbd5e1;
}
.nutrition-details li::before {
  content: "▹";
  color: #3b82f6;
  margin-right: 8px;
}
.hydration p, .special-note p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.4;
}
.nutrition-main {
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: rgba(59,130,246,0.15);
  padding: 12px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}

/* Карточки дней */
.days-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.day-card {
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 32px;
  overflow: hidden;
  transition: var(--transition);
}

.day-card:hover {
  border-color: rgba(59,130,246,0.4);
  box-shadow: 0 20px 35px -15px rgba(0,0,0,0.5);
  transform: translateY(-2px);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  cursor: pointer;
  background: rgba(0,0,0,0.2);
  transition: background 0.2s;
}

.day-header:hover {
  background: rgba(59,130,246,0.08);
}

.day-card h4 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 26px;
  font-weight: 500;
  margin: 0;
  color: white;
}

.day-card h4 span {
  font-size: 16px;
  font-family: 'Inter', monospace;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: 12px;
}

.expand-icon {
  font-size: 20px;
  color: var(--accent);
  transition: transform 0.2s;
}

.day-details {
  padding: 0 8px 24px 8px;
}

.section {
  margin: 0 20px 24px 20px;
  padding: 20px 24px;
  background: rgba(255,255,255,0.02);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.03);
}

.section h5 {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #818cf8;
  margin-bottom: 18px;
}

.section h6 {
  font-size: 14px;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
}

.exercise-block {
  margin-bottom: 24px;
}

.exercise-block:last-child {
  margin-bottom: 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  font-size: 15px;
  color: var(--text-secondary);
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
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
  transition: all 0.15s;
  border-radius: 12px;
  padding: 8px 12px;
  margin: -8px -12px;
}

.clickable-exercise:hover {
  background: rgba(59,130,246,0.1);
  transform: translateX(6px);
}

.reps {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #38bdf8;
  background: rgba(56,189,248,0.1);
  padding: 4px 12px;
  border-radius: 40px;
}

.weight-hint {
  font-size: 12px;
  color: #a78bfa;
  background: rgba(167,139,250,0.1);
  padding: 2px 8px;
  border-radius: 16px;
  margin-left: 8px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(12px); }
}

.modal-content {
  background: #0f1422;
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: 32px;
  max-width: 520px;
  width: 100%;
  padding: 32px;
  position: relative;
  box-shadow: 0 30px 40px -20px black;
  animation: slideUpModal 0.3s ease;
}

@keyframes slideUpModal {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: white;
}

.modal-content h3 {
  font-size: 28px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #fff, #94a3b8);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.modal-reps {
  font-size: 14px;
  font-weight: 500;
  color: #38bdf8;
  margin-bottom: 20px;
}

.modal-desc, .modal-tips, .modal-weight {
  font-size: 15px;
  line-height: 1.5;
  color: #cbd5e1;
  margin-bottom: 16px;
}

/* Кнопка назад */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1));
  border: 1px solid rgba(59,130,246,0.4);
  color: white;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 60px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--accent);
  border-color: var(--accent);
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(59,130,246,0.3);
}

/* Сообщение об ошибке */
.no-program {
  text-align: center;
  padding: 80px 30px;
  background: rgba(255,255,255,0.02);
  border-radius: 48px;
  border: 1px dashed rgba(255,255,255,0.1);
}

.extra-tips {
  margin-top: 60px;
}

.extra-tips ul li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.extra-tips ul li::before {
  content: "⚡";
  font-size: 14px;
  color: #3b82f6;
}

/* Адаптивность */
@media (max-width: 1000px) {
  .page {
    padding: 60px 40px 40px;
  }
  .user-info {
    padding: 20px 24px;
    gap: 16px;
  }
  .page-title {
    font-size: 44px;
  }
  .day-header {
    padding: 18px 24px;
  }
  .section {
    margin: 0 12px 18px;
    padding: 16px 20px;
  }
}

@media (max-width: 700px) {
  .page {
    padding: 30px 20px 30px;
  }
  .page-title {
    font-size: 32px;
    margin-bottom: 32px;
  }
  .day-card h4 {
    font-size: 22px;
  }
  .day-card h4 span {
    font-size: 12px;
    display: block;
    margin-left: 0;
  }
  .macros {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  .modal-content {
    padding: 24px;
  }
  li {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Стилизация скроллбара */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0a0c12;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 10px;
}
</style>git status
