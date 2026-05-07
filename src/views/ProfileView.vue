<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Данные пользователя из localStorage
const user = ref(null)

// Режим редактирования — false = просмотр, true = редактирование
const isEditing = ref(false)

// Сообщение об успешном сохранении
const savedMsg = ref('')

// Ошибки полей
const errors = reactive({
  name: '',
  phone: '',
})

// Форма редактирования — заполняется данными пользователя
const form = reactive({
  name: '',
  phone: '',
  email: '',
  birthdate: '',
  password: '',
  gender: '',
  height: '',
  weight: '',
  waist: '',
  chest: '',
  bicep: '',
  hip: '',
})

// Замеры — список всех замеров пользователя
const measures = ref([])

// Показывать ли форму добавления замера
const showMeasureForm = ref(false)

// Данные нового замера
const newMeasure = reactive({
  date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
  weight: '',
  chest: '',
  waist: '',
  hip: '',
  bicep: '',
})

// Аватарка — хранится как base64 строка
const avatarPreview = ref('')

onMounted(function() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  // Если пользователь не залогинен — отправляем на логин
  if (!currentUser) {
    router.push('/login')
    return
  }

  user.value = currentUser

  // Заполняем форму данными пользователя
  form.name      = currentUser.name      || ''
  form.phone     = currentUser.phone     || ''
  form.email     = currentUser.email     || ''
  form.birthdate = currentUser.birthdate || ''
  form.password  = currentUser.password  || ''
  form.gender    = currentUser.gender    || ''
  form.height    = currentUser.height    || ''
  form.weight    = currentUser.weight    || ''
  form.waist     = currentUser.waist     || ''
  form.chest     = currentUser.chest     || ''
  form.bicep     = currentUser.bicep     || ''
  form.hip       = currentUser.hip       || ''
  avatarPreview.value = currentUser.avatar || ''

  // Загружаем историю замеров из localStorage
  const savedMeasures = localStorage.getItem('measures_' + currentUser.login)
  if (savedMeasures) {
    measures.value = JSON.parse(savedMeasures)
  }

  // Считаем ИМТ ПОСЛЕ загрузки данных
  calculateBMI()
})

// Обработка загрузки аватарки
function onAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Читаем файл как base64 — чтобы хранить в localStorage
  const reader = new FileReader()
  reader.onload = function(e) {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Открыть диалог выбора файла
function triggerFileInput() {
  document.getElementById('avatar-input').click()
}

// Убрать аватарку
function removeAvatar() {
  avatarPreview.value = ''
}

// Валидация формы
function validate() {
  errors.name = ''
  errors.phone = ''
  let hasErrors = false

  if (!form.name) {
    errors.name = 'Имя обязательно'
    hasErrors = true
  }
  if (!form.phone) {
    errors.phone = 'Телефон обязателен'
    hasErrors = true
  } else if (form.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Введи корректный номер'
    hasErrors = true
  }

  return !hasErrors
}

// Сохранение изменений
function save() {
  if (!validate()) return

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  // Обновляем все поля кроме логина
  currentUser.name      = form.name
  currentUser.phone     = form.phone
  currentUser.email     = form.email
  currentUser.birthdate = form.birthdate
  currentUser.password  = form.password
  currentUser.gender    = form.gender
  currentUser.height    = form.height
  currentUser.weight    = form.weight
  currentUser.waist     = form.waist
  currentUser.chest     = form.chest
  currentUser.bicep     = form.bicep
  currentUser.hip       = form.hip
  currentUser.avatar    = avatarPreview.value

  // Сохраняем обновлённого пользователя
  localStorage.setItem('currentUser', JSON.stringify(currentUser))
  user.value = currentUser

    // Загружаем историю замеров из localStorage
const savedMeasures = localStorage.getItem('measures_' + currentUser.login)
if (savedMeasures) {
  measures.value = JSON.parse(savedMeasures)
}

  // Обновляем и в общем списке пользователей
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  for (let i = 0; i < users.length; i++) {
    if (users[i].login === currentUser.login) {
      users[i] = currentUser
      break
    }
  }
  localStorage.setItem('users', JSON.stringify(users))

  // Выходим из режима редактирования
  isEditing.value = false

  // Показываем сообщение об успехе
  savedMsg.value = 'Данные сохранены!'
  setTimeout(function() {
    savedMsg.value = ''
  }, 3000)
}

// Отмена редактирования — возвращаем старые данные
function cancelEdit() {
  form.name      = user.value.name      || ''
  form.phone     = user.value.phone     || ''
  form.email     = user.value.email     || ''
  form.birthdate = user.value.birthdate || ''
  form.password  = user.value.password  || ''
  form.gender    = user.value.gender    || ''
  form.height    = user.value.height    || ''
  form.weight    = user.value.weight    || ''
  form.waist     = user.value.waist     || ''
  form.chest     = user.value.chest     || ''
  form.bicep     = user.value.bicep     || ''
  form.hip       = user.value.hip       || ''
  avatarPreview.value = user.value.avatar || ''
  isEditing.value = false
  errors.name = ''
  errors.phone = ''
}

// Перевод значений для отображения
function genderLabel(g) {
  if (g === 'male') return 'Мужской'
  if (g === 'female') return 'Женский'
  return '—'
}

function goalLabel(g) {
  if (g === 'loss') return 'Похудение'
  if (g === 'mass') return 'Набор массы'
  if (g === 'keep') return 'Поддержание формы'
  return '—'
}

function levelLabel(l) {
  if (l === 'beginner') return 'Новичок'
  if (l === 'middle') return 'Средний'
  if (l === 'advanced') return 'Продвинутый'
  return '—'
}

// Форматирование даты для отображения
function formatDate(dateStr) {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return parts[2] + '.' + parts[1] + '.' + parts[0]
}

// Сохранить новый замер
function saveMeasure() {
  if (!newMeasure.date) return

  // Добавляем в начало массива (новые сверху)
  measures.value.unshift({
    date: newMeasure.date,
    weight: newMeasure.weight,
    chest: newMeasure.chest,
    waist: newMeasure.waist,
    hip: newMeasure.hip,
    bicep: newMeasure.bicep,
  })

  // Сохраняем в localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  localStorage.setItem('measures_' + currentUser.login, JSON.stringify(measures.value))

  // Сбрасываем форму
  newMeasure.date = new Date().toISOString().split('T')[0]
  newMeasure.weight = ''
  newMeasure.chest = ''
  newMeasure.waist = ''
  newMeasure.hip = ''
  newMeasure.bicep = ''
  showMeasureForm.value = false
}

// Удалить замер по индексу
function deleteMeasure(index) {
  measures.value.splice(index, 1)
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  localStorage.setItem('measures_' + currentUser.login, JSON.stringify(measures.value))
}

// Считаем разницу между двумя замерами
function getDiff(current, previous) {
  const diff = parseFloat(current) - parseFloat(previous)
  if (diff > 0) return '+' + diff.toFixed(1)
  if (diff < 0) return diff.toFixed(1)
  return '0'
}

// Цвет разницы зависит от типа параметра
// Для веса и талии — уменьшение это хорошо (зелёный)
// Для бицепса — увеличение это хорошо (зелёный)
function getDiffClass(current, previous, type) {
  const diff = parseFloat(current) - parseFloat(previous)
  if (diff === 0) return 'measure-diff--neutral'
  if (type === 'weight' || type === 'waist') {
    return diff < 0 ? 'measure-diff--good' : 'measure-diff--bad'
  }
  return diff > 0 ? 'measure-diff--good' : 'measure-diff--bad'
}

// ИМТ = вес / (рост в метрах)²
const bmi = ref(null)
const bmiCategory = ref('')
const bmiColor = ref('')

function calculateBMI() {
  // Берём рост и вес из формы или из данных пользователя
  const weight = parseFloat(form.weight || user.value.weight)
  const height = parseFloat(form.height || user.value.height)

  // Проверяем что данные введены
  if (!weight || !height) {
    bmi.value = null
    bmiCategory.value = 'Укажи рост и вес в параметрах тела'
    bmiColor.value = 'rgba(255,255,255,0.25)'
    return
  }

  // Считаем ИМТ
  const heightInMeters = height / 100
  const result = weight / (heightInMeters * heightInMeters)
  bmi.value = result.toFixed(1)

  // Определяем категорию
  if (result < 16) {
    bmiCategory.value = 'Выраженный дефицит массы'
    bmiColor.value = '#F44336'
  } else if (result < 18.5) {
    bmiCategory.value = 'Дефицит массы тела'
    bmiColor.value = '#FF9800'
  } else if (result < 25) {
    bmiCategory.value = 'Норма'
    bmiColor.value = '#4CAF50'
  } else if (result < 30) {
    bmiCategory.value = 'Избыточный вес'
    bmiColor.value = '#FF9800'
  } else if (result < 35) {
    bmiCategory.value = 'Ожирение I степени'
    bmiColor.value = '#F44336'
  } else if (result < 40) {
    bmiCategory.value = 'Ожирение II степени'
    bmiColor.value = '#D32F2F'
  } else {
    bmiCategory.value = 'Ожирение III степени'
    bmiColor.value = '#B71C1C'
  }
}

// Таблица категорий ИМТ
const bmiCategories = [
  { range: '< 16',     label: 'Выраженный дефицит массы', color: '#F44336' },
  { range: '16 — 18.5', label: 'Дефицит массы тела',      color: '#FF9800' },
  { range: '18.5 — 25', label: 'Норма',                    color: '#4CAF50' },
  { range: '25 — 30',   label: 'Избыточный вес',           color: '#FF9800' },
  { range: '30 — 35',   label: 'Ожирение I степени',       color: '#F44336' },
  { range: '35 — 40',   label: 'Ожирение II степени',      color: '#D32F2F' },
  { range: '> 40',      label: 'Ожирение III степени',     color: '#B71C1C' },
]

// Считаем позицию указателя на шкале (от 0 до 100%)
function getBMIPointerPosition() {
  const value = parseFloat(bmi.value)
  // Шкала от 14 до 44
  const min = 14
  const max = 44
  const pos = ((value - min) / (max - min)) * 100
  // Ограничиваем от 2 до 98
  if (pos < 2) return 2
  if (pos > 98) return 98
  return Math.round(pos)
}

</script>

<template>
  <div class="page">
    <div class="glow"></div>

    <!-- Пока данные загружаются -->
    <div v-if="!user" class="loading">Загрузка...</div>

    <div v-else class="container">

      <!-- Шапка профиля -->
      <div class="profile-header">
        <div class="avatar-section">
          <!-- Аватарка или заглушка -->
          <div class="avatar-wrap" @click="isEditing && triggerFileInput()">
            <img v-if="avatarPreview" :src="avatarPreview" class="avatar-img" alt="Аватар" />
            <div v-else class="avatar-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <!-- Оверлей при редактировании -->
            <div v-if="isEditing" class="avatar-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span>Изменить</span>
            </div>
          </div>

          <!-- Скрытый инпут для загрузки файла -->
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onAvatarChange"
          />

          <!-- Кнопка удалить аватар -->
          <button
            v-if="isEditing && avatarPreview"
            class="btn-remove-avatar"
            @click="removeAvatar"
          >
            Удалить фото
          </button>
        </div>

        <div class="profile-info">
          <p class="page-label">Личный кабинет</p>
          <h1 class="page-title">{{ user.name }}</h1>
          <p class="profile-login">@{{ user.login }}</p>

          <!-- Сообщение об успешном сохранении -->
          <p v-if="savedMsg" class="saved-msg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ savedMsg }}
          </p>
        </div>

        <!-- Кнопки редактирования -->
        <div class="profile-actions">
          <button v-if="!isEditing" class="btn-edit" @click="isEditing = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Редактировать
          </button>
          <div v-else class="edit-btns">
            <button class="btn-save" @click="save">Сохранить</button>
            <button class="btn-cancel" @click="cancelEdit">Отмена</button>
          </div>
        </div>
      </div>

      <!-- Секции данных -->
      <div class="sections">

        <!-- Личные данные -->
        <div class="section">
          <p class="section-title">Личные данные</p>

          <div class="fields-grid">
            <!-- Логин — нельзя изменить -->
            <div class="field-row">
              <p class="field-label">Логин</p>
              <p class="field-value field-value--locked">
                {{ user.login }}
                <span class="lock-badge">нельзя изменить</span>
              </p>
            </div>

            <!-- Имя -->
            <div class="field-row">
              <p class="field-label">Имя</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="text" v-model="form.name" @input="errors.name = ''" placeholder="Твоё имя" :class="{ 'input--error': errors.name }" />
                <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
              </div>
              <p v-else class="field-value">{{ user.name || '—' }}</p>
            </div>

            <!-- Пол -->
            <div class="field-row">
              <p class="field-label">Пол</p>
              <div v-if="isEditing" class="gender-row">
                <button type="button" :class="['gender-mini', { 'gender-mini--active': form.gender === 'male' }]" @click="form.gender = 'male'">Мужской</button>
                <button type="button" :class="['gender-mini', { 'gender-mini--active': form.gender === 'female' }]" @click="form.gender = 'female'">Женский</button>
              </div>
              <p v-else class="field-value">{{ genderLabel(user.gender) }}</p>
            </div>

            <!-- Дата рождения -->
            <div class="field-row">
              <p class="field-label">Дата рождения</p>
              <input v-if="isEditing" type="date" v-model="form.birthdate" />
              <p v-else class="field-value">{{ formatDate(user.birthdate) }}</p>
            </div>

            <!-- Телефон -->
            <div class="field-row">
              <p class="field-label">Телефон</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="tel" v-model="form.phone" @input="errors.phone = ''" placeholder="+7 (999) 999-99-99" :class="{ 'input--error': errors.phone }" />
                <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
              </div>
              <p v-else class="field-value">{{ user.phone || '—' }}</p>
            </div>

            <!-- Email -->
            <div class="field-row">
              <p class="field-label">Email</p>
              <input v-if="isEditing" type="email" v-model="form.email" placeholder="your@email.com" />
              <p v-else class="field-value">{{ user.email || '—' }}</p>
            </div>

            <!-- Пароль -->
            <div class="field-row">
              <p class="field-label">Пароль</p>
              <input v-if="isEditing" type="password" v-model="form.password" placeholder="Новый пароль" />
              <p v-else class="field-value">••••••</p>
            </div>
          </div>
        </div>

        <!-- Параметры тела -->
        <div class="section">
          <p class="section-title">Параметры тела</p>

          <div class="fields-grid">
            <div class="field-row">
              <p class="field-label">Цель</p>
              <p class="field-value">{{ goalLabel(user.goal) }}</p>
            </div>
            <div class="field-row">
              <p class="field-label">Уровень</p>
              <p class="field-value">{{ levelLabel(user.level) }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Рост</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.height" placeholder="см" />
              </div>
              <p v-else class="field-value">{{ user.height ? user.height + ' см' : '—' }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Вес</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.weight" placeholder="кг" />
              </div>
              <p v-else class="field-value">{{ user.weight ? user.weight + ' кг' : '—' }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Талия</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.waist" placeholder="см" />
              </div>
              <p v-else class="field-value">{{ user.waist ? user.waist + ' см' : '—' }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Грудь</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.chest" placeholder="см" />
              </div>
              <p v-else class="field-value">{{ user.chest ? user.chest + ' см' : '—' }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Бицепс</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.bicep" placeholder="см" />
              </div>
              <p v-else class="field-value">{{ user.bicep ? user.bicep + ' см' : '—' }}</p>
            </div>

            <div class="field-row">
              <p class="field-label">Бёдра</p>
              <div v-if="isEditing" class="field-input-wrap">
                <input type="number" v-model="form.hip" placeholder="см" />
              </div>
              <p v-else class="field-value">{{ user.hip ? user.hip + ' см' : '—' }}</p>
            </div>
          </div>
        </div>

                <!-- Калькулятор ИМТ -->
        <div class="section">
          <div class="section-head">
            <p class="section-title">Индекс массы тела (ИМТ)</p>
          </div>

          <div class="bmi-content">

            <!-- Результат ИМТ -->
            <div class="bmi-result">
              <div class="bmi-number-wrap">
                <p class="bmi-number" :style="{ color: bmiColor }">
                  {{ bmi || '—' }}
                </p>
                <p class="bmi-unit">кг/м²</p>
              </div>
              <div class="bmi-info">
                <p class="bmi-category" :style="{ color: bmiColor }">
                  {{ bmiCategory || 'Заполни рост и вес' }}
                </p>
                <p class="bmi-desc">
                  Индекс массы тела показывает соотношение веса и роста.
                  Норма — от 18.5 до 24.9
                </p>
                <!-- Кнопка пересчитать -->
                <button class="btn-calc" @click="calculateBMI">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Пересчитать
                </button>
              </div>
            </div>

            <!-- Шкала ИМТ -->
            <div class="bmi-scale">
              <div class="bmi-scale-track">
                <!-- Цветные сегменты шкалы -->
                <div class="bmi-segment" style="background: #2196F3; flex: 2"></div>
                <div class="bmi-segment" style="background: #03A9F4; flex: 1.5"></div>
                <div class="bmi-segment" style="background: #4CAF50; flex: 3.25"></div>
                <div class="bmi-segment" style="background: #FF9800; flex: 2.5"></div>
                <div class="bmi-segment" style="background: #F44336; flex: 2.5"></div>
                <div class="bmi-segment" style="background: #D32F2F; flex: 2.5"></div>
                <div class="bmi-segment" style="background: #B71C1C; flex: 2"></div>

                <!-- Указатель текущего ИМТ -->
                <div
                  v-if="bmi"
                  class="bmi-pointer"
                  :style="{ left: getBMIPointerPosition() + '%' }"
                ></div>
              </div>

              <!-- Подписи шкалы -->
              <div class="bmi-scale-labels">
                <span>16</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
            </div>

            <!-- Таблица категорий -->
            <div class="bmi-table">
              <div
                v-for="cat in bmiCategories"
                :key="cat.label"
                :class="['bmi-table-row', { 'bmi-table-row--active': bmiCategory === cat.label }]"
              >
                <div class="bmi-table-dot" :style="{ background: cat.color }"></div>
                <p class="bmi-table-range">{{ cat.range }}</p>
                <p class="bmi-table-label">{{ cat.label }}</p>
              </div>
            </div>

          </div>
        </div>

            <!-- Раздел замеров — история изменений тела -->
            <div class="section">
            <div class="section-head">
                <p class="section-title">История замеров</p>
                <!-- Кнопка добавить новый замер -->
                <button class="btn-add-measure" @click="showMeasureForm = !showMeasureForm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Добавить замер
                </button>
            </div>

            <!-- Форма добавления нового замера -->
            <div v-if="showMeasureForm" class="measure-form">
                <p class="measure-form-title">Новый замер</p>
                <div class="measure-grid">
                <div class="field">
                    <label>Дата</label>
                    <input type="date" v-model="newMeasure.date" />
                </div>
                <div class="field">
                    <label>Вес (кг)</label>
                    <input type="number" v-model="newMeasure.weight" placeholder="70" />
                </div>
                <div class="field">
                    <label>Грудь (см)</label>
                    <input type="number" v-model="newMeasure.chest" placeholder="95" />
                </div>
                <div class="field">
                    <label>Талия (см)</label>
                    <input type="number" v-model="newMeasure.waist" placeholder="80" />
                </div>
                <div class="field">
                    <label>Бёдра (см)</label>
                    <input type="number" v-model="newMeasure.hip" placeholder="95" />
                </div>
                <div class="field">
                    <label>Бицепс (см)</label>
                    <input type="number" v-model="newMeasure.bicep" placeholder="35" />
                </div>
                </div>
                <div class="measure-form-btns">
                <button class="btn-save-measure" @click="saveMeasure">Сохранить замер</button>
                <button class="btn-cancel-measure" @click="showMeasureForm = false">Отмена</button>
                </div>
            </div>

            <!-- Если замеров нет -->
            <div v-if="measures.length === 0 && !showMeasureForm" class="measures-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                </svg>
                <p>Замеров пока нет. Добавь первый!</p>
            </div>

            <!-- Список замеров -->
            <div v-else class="measures-list">
                <div
                v-for="(measure, index) in measures"
                :key="index"
                class="measure-row"
                >
                <p class="measure-date">{{ formatDate(measure.date) }}</p>
                <div class="measure-values">

                    <!-- Вес -->
                    <div class="measure-val">
                    <span class="measure-val-label">Вес</span>
                    <span class="measure-val-num">{{ measure.weight || '—' }}</span>
                    <!-- Сравниваем с предыдущим замером -->
                    <span
                        v-if="index < measures.length - 1 && measure.weight && measures[index+1].weight"
                        :class="['measure-diff', getDiffClass(measure.weight, measures[index+1].weight, 'weight')]"
                    >
                        {{ getDiff(measure.weight, measures[index+1].weight) }}
                    </span>
                    </div>

                    <div class="measure-val">
                    <span class="measure-val-label">Грудь</span>
                    <span class="measure-val-num">{{ measure.chest || '—' }}</span>
                    <span
                        v-if="index < measures.length - 1 && measure.chest && measures[index+1].chest"
                        :class="['measure-diff', 'measure-diff--neutral']"
                    >
                        {{ getDiff(measure.chest, measures[index+1].chest) }}
                    </span>
                    </div>

                    <div class="measure-val">
                    <span class="measure-val-label">Талия</span>
                    <span class="measure-val-num">{{ measure.waist || '—' }}</span>
                    <span
                        v-if="index < measures.length - 1 && measure.waist && measures[index+1].waist"
                        :class="['measure-diff', getDiffClass(measure.waist, measures[index+1].waist, 'waist')]"
                    >
                        {{ getDiff(measure.waist, measures[index+1].waist) }}
                    </span>
                    </div>

                    <div class="measure-val">
                    <span class="measure-val-label">Бёдра</span>
                    <span class="measure-val-num">{{ measure.hip || '—' }}</span>
                    </div>

                    <div class="measure-val">
                    <span class="measure-val-label">Бицепс</span>
                    <span class="measure-val-num">{{ measure.bicep || '—' }}</span>
                    <span
                        v-if="index < measures.length - 1 && measure.bicep && measures[index+1].bicep"
                        :class="['measure-diff', 'measure-diff--good']"
                    >
                        {{ getDiff(measure.bicep, measures[index+1].bicep) }}
                    </span>
                    </div>

                </div>

                <!-- Кнопка удалить замер -->
                <button class="btn-delete-measure" @click="deleteMeasure(index)" title="Удалить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    </svg>
                </button>
                </div>
            </div>
            </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
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

.loading {
  color: rgba(255,255,255,0.3);
  font-size: 13px;
  text-align: center;
  padding-top: 200px;
}

.container {
  max-width: 860px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.7s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Шапка профиля */
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 36px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 48px;
}

/* Аватарка */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Заглушка если нет аватарки */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.2);
}

/* Оверлей при редактировании — появляется при наведении */
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255,255,255,0.8);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity .2s;
}

.avatar-wrap:hover .avatar-overlay { opacity: 1; }

.btn-remove-avatar {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: none;
  border: none;
  color: rgba(220,60,60,0.7);
  cursor: pointer;
  transition: color .2s;
  padding: 0;
}

.btn-remove-avatar:hover { color: #DC3C3C; }

.profile-info { flex: 1; }

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
  margin-bottom: 6px;
}

.profile-login {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
  margin-bottom: 12px;
}

.saved-msg {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px 14px;
  border-radius: 2px;
  animation: fadeUp 0.3s ease both;
}

.profile-actions { flex-shrink: 0; }

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-edit:hover {
  background: rgba(255,255,255,0.08);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.25);
}

.edit-btns { display: flex; gap: 8px; }

.btn-save {
  padding: 10px 24px;
  background: #FFFFFF;
  color: #06080F;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: opacity .2s;
}

.btn-save:hover { opacity: 0.85; }

.btn-cancel {
  padding: 10px 20px;
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.35);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-cancel:hover {
  border-color: rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.7);
}

/* Секции */
.sections { display: flex; flex-direction: column; gap: 40px; }

.section {
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}

.fields-grid { padding: 8px 0; }

/* Строка с одним полем */
.field-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  gap: 20px;
}

.field-row:last-child { border-bottom: none; }

.field-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
}

.field-value {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
}

/* Заблокированное поле — логин */
.field-value--locked {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.4);
}

.lock-badge {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 3px 8px;
  border-radius: 2px;
}

.field-input-wrap { display: flex; flex-direction: column; gap: 4px; }

input {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
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

input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }

.input--error { border-color: rgba(220,60,60,0.5) !important; }
.field-error { font-size: 11px; color: #DC3C3C; }

/* Мини кнопки выбора пола */
.gender-row { display: flex; gap: 8px; }

.gender-mini {
  padding: 8px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.35);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.gender-mini:hover {
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
}

.gender-mini--active {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.4);
  color: #FFFFFF;
}

/* Шапка секции с кнопкой добавить */
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}

.btn-add-measure {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-add-measure:hover {
  background: rgba(255,255,255,0.08);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.25);
}

/* Форма добавления замера */
.measure-form {
  padding: 24px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}

.measure-form-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16px;
}

.measure-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.measure-form-btns {
  display: flex;
  gap: 10px;
}

.btn-save-measure {
  padding: 11px 24px;
  background: #FFFFFF;
  color: #06080F;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: opacity .2s;
}

.btn-save-measure:hover { opacity: 0.85; }

.btn-cancel-measure {
  padding: 11px 20px;
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.3);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-cancel-measure:hover { color: rgba(255,255,255,0.6); }

/* Пустое состояние */
.measures-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 52px 28px;
  color: rgba(255,255,255,0.2);
  font-size: 13px;
  font-weight: 300;
}

/* Список замеров */
.measures-list { padding: 8px 0; }

.measure-row {
  display: flex;
  align-items: center;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  gap: 24px;
  transition: background .2s;
}

.measure-row:last-child { border-bottom: none; }
.measure-row:hover { background: rgba(255,255,255,0.02); }

.measure-date {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
  flex-shrink: 0;
  min-width: 90px;
}

.measure-values {
  display: flex;
  gap: 32px;
  flex: 1;
  flex-wrap: wrap;
}

.measure-val {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.measure-val-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
}

.measure-val-num {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.7);
}

/* Разница с предыдущим замером */
.measure-diff {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.measure-diff--good    { color: #4CAF50; }  /* Зелёный — хорошо */
.measure-diff--bad     { color: #F44336; }  /* Красный — плохо */
.measure-diff--neutral { color: rgba(255,255,255,0.25); }

.btn-delete-measure {
  background: none;
  border: none;
  color: rgba(255,255,255,0.15);
  cursor: pointer;
  padding: 4px;
  transition: color .2s;
  flex-shrink: 0;
}

.btn-delete-measure:hover { color: #F44336; }

/* Калькулятор ИМТ */
.bmi-content {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Результат */
.bmi-result {
  display: flex;
  align-items: flex-start;
  gap: 28px;
}

.bmi-number-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 20px 28px;
  min-width: 120px;
}

.bmi-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 56px;
  line-height: 1;
  letter-spacing: 0.03em;
  transition: color .3s;
}

.bmi-unit {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin-top: 4px;
}

.bmi-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
}

.bmi-category {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: color .3s;
}

.bmi-desc {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
  line-height: 1.7;
}

.btn-calc {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
  width: fit-content;
}

.btn-calc:hover {
  background: rgba(255,255,255,0.08);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.25);
}

/* Шкала */
.bmi-scale { display: flex; flex-direction: column; gap: 8px; }

.bmi-scale-track {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: visible;
  position: relative;
  gap: 2px;
}

.bmi-segment {
  height: 100%;
  border-radius: 2px;
  opacity: 0.7;
}

/* Указатель на шкале */
.bmi-pointer {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #FFFFFF;
  border-radius: 50%;
  border: 2px solid #06080F;
  box-shadow: 0 0 8px rgba(255,255,255,0.5);
  transition: left .4s ease;
  z-index: 2;
}

.bmi-scale-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.bmi-scale-labels span {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255,255,255,0.2);
  letter-spacing: 0.05em;
}

/* Таблица категорий */
.bmi-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.bmi-table-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  transition: background .2s;
}

/* Подсвечиваем текущую категорию */
.bmi-table-row--active {
  background: rgba(255,255,255,0.06);
  border-left: 2px solid rgba(255,255,255,0.4);
}

.bmi-table-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bmi-table-range {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  min-width: 90px;
  letter-spacing: 0.05em;
}

.bmi-table-label {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255,255,255,0.5);
}

.bmi-table-row--active .bmi-table-label {
  color: #FFFFFF;
  font-weight: 600;
}

</style>