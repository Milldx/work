<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Шаг оплаты: 1 — форма, 2 — успех
const step = ref(1)

// Данные карты
const card = reactive({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
})

const errors = reactive({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
})

const isLoading = ref(false)

// Форматирование номера карты
function formatCardNumber(e) {
  let value = e.target.value.replace(/\D/g, '')
  value = value.substring(0, 16)
  let formatted = ''
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' '
    formatted += value[i]
  }
  card.number = formatted
  errors.number = ''
}

// Форматирование срока
function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, '')
  value = value.substring(0, 4)
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }
  card.expiry = value
  errors.expiry = ''
}

// Только цифры для CVV
function formatCVV(e) {
  card.cvv = e.target.value.replace(/\D/g, '').substring(0, 3)
  errors.cvv = ''
}

// Платёжная система
function getCardType() {
  const num = card.number.replace(/\s/g, '')
  if (num.startsWith('4')) return 'Visa'
  if (num.startsWith('5')) return 'Mastercard'
  if (num.startsWith('2')) return 'Мир'
  return ''
}

// Валидация
function validate() {
  let hasErrors = false
  errors.number = ''
  errors.name = ''
  errors.expiry = ''
  errors.cvv = ''

  const num = card.number.replace(/\s/g, '')
  if (!num || num.length < 16) {
    errors.number = 'Введи корректный номер карты'
    hasErrors = true
  }
  if (!card.name) {
    errors.name = 'Введи имя как на карте'
    hasErrors = true
  }
  if (!card.expiry || card.expiry.length < 5) {
    errors.expiry = 'Введи срок действия'
    hasErrors = true
  }
  if (!card.cvv || card.cvv.length < 3) {
    errors.cvv = 'Введи CVV'
    hasErrors = true
  }
  return !hasErrors
}

// Оплата
function pay() {
  if (!validate()) return
  isLoading.value = true

  setTimeout(function() {
    isLoading.value = false

    // Считаем дату начала и конца подписки
    const now = new Date()
    const expiry = new Date()
    expiry.setMonth(expiry.getMonth() + 1)

    const subscription = {
      active: true,
      price: 790,
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
    }

    // Сохраняем подписку
    localStorage.setItem('subscription', JSON.stringify(subscription))

    // Обновляем currentUser
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    currentUser.subscription = subscription
    localStorage.setItem('currentUser', JSON.stringify(currentUser))

    // Обновляем в списке пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    for (let i = 0; i < users.length; i++) {
      if (users[i].login === currentUser.login) {
        users[i] = currentUser
        break
      }
    }
    localStorage.setItem('users', JSON.stringify(users))

    step.value = 2
  }, 2000)
}

// Считаем дату следующего платежа
function nextPaymentDate() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

</script>

<template>
  <div class="page">
    <div class="glow"></div>

    <div class="container">

      <!-- Шаг 1 — форма оплаты -->
      <div v-if="step === 1" class="step">

        <RouterLink to="/" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Назад
        </RouterLink>

        <p class="page-label">Оформление подписки</p>
        <h1 class="page-title">Оплата</h1>

        <!-- Итог заказа -->
        <div class="order-summary">
          <div class="order-row">
            <p class="order-label">Подписка FITNESS</p>
            <p class="order-value">790 ₽ / месяц</p>
          </div>
          <div class="order-row">
            <p class="order-label">Период</p>
            <p class="order-value">1 месяц</p>
          </div>
          <div class="order-row">
            <p class="order-label">Следующее списание</p>
            <p class="order-value">{{ nextPaymentDate() }}</p>
          </div>
          <div class="order-divider"></div>
          <div class="order-row">
            <p class="order-label order-label--total">Итого</p>
            <p class="order-value order-value--total">790 ₽</p>
          </div>
        </div>

        <!-- Визуальная карта -->
        <div class="card-visual">
          <div class="card-visual-top">
            <p class="card-visual-bank">FITNESS PAY</p>
            <p class="card-visual-type">{{ getCardType() }}</p>
          </div>
          <p class="card-visual-number">
            {{ card.number || '•••• •••• •••• ••••' }}
          </p>
          <div class="card-visual-bottom">
            <div>
              <p class="card-visual-label">Имя</p>
              <p class="card-visual-value">{{ card.name || 'IVAN IVANOV' }}</p>
            </div>
            <div>
              <p class="card-visual-label">Срок</p>
              <p class="card-visual-value">{{ card.expiry || 'MM/YY' }}</p>
            </div>
          </div>
        </div>

        <!-- Поля -->
        <div class="card-form">
          <div class="field">
            <label>Номер карты</label>
            <div class="input-wrap">
              <input
                type="text"
                :value="card.number"
                @input="formatCardNumber"
                placeholder="0000 0000 0000 0000"
                :class="{ 'input--error': errors.number }"
                maxlength="19"
              />
              <span v-if="getCardType()" class="card-type-badge">{{ getCardType() }}</span>
            </div>
            <p v-if="errors.number" class="field-error">{{ errors.number }}</p>
          </div>

          <div class="field">
            <label>Имя держателя карты</label>
            <input
              type="text"
              v-model="card.name"
              @input="errors.name = ''"
              placeholder="IVAN IVANOV"
              :class="{ 'input--error': errors.name }"
              style="text-transform: uppercase"
            />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>

          <div class="fields-row">
            <div class="field">
              <label>Срок действия</label>
              <input
                type="text"
                :value="card.expiry"
                @input="formatExpiry"
                placeholder="MM/YY"
                :class="{ 'input--error': errors.expiry }"
                maxlength="5"
              />
              <p v-if="errors.expiry" class="field-error">{{ errors.expiry }}</p>
            </div>
            <div class="field">
              <label>CVV</label>
              <input
                type="password"
                :value="card.cvv"
                @input="formatCVV"
                placeholder="•••"
                :class="{ 'input--error': errors.cvv }"
                maxlength="3"
              />
              <p v-if="errors.cvv" class="field-error">{{ errors.cvv }}</p>
            </div>
          </div>

          <div class="security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Данные защищены. Это учебный проект — настоящая оплата не производится.
          </div>

          <button class="btn-pay" @click="pay" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Оплатить 790 ₽</span>
          </button>
        </div>
      </div>

      <!-- Шаг 2 — успех -->
      <div v-if="step === 2" class="step step--success">
        <div class="success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p class="page-label">Оплата прошла</p>
        <h1 class="page-title">Подписка активна!</h1>
        <p class="page-subtitle">
          Подписка FITNESS за 790 ₽/мес оформлена.<br/>
          Следующее списание: {{ nextPaymentDate() }}
        </p>

        <div class="success-btns">
          <button class="btn-submit" @click="router.push('/program')">
            Перейти к программе
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <button class="btn-outline" @click="router.push('/profile')">
            Личный кабинет
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
  background:
    radial-gradient(ellipse 50% 60% at 70% 30%, rgba(25, 70, 150, 0.3) 0%, transparent 65%);
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.container {
  width: 100%;
  max-width: 680px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.7s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.step { animation: fadeUp 0.4s ease both; }

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
  color: rgba(255,255,255,0.35);
  margin-bottom: 40px;
  line-height: 1.7;
}

/* Карточки планов */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 28px;
}

.plan-card {
  background: #06080F;
  padding: 28px 24px;
  cursor: pointer;
  transition: background .2s;
  position: relative;
}

.plan-card:hover { background: #0A0D1A; }
.plan-card--active {
  background: #0D1228;
  outline: 1px solid rgba(255,255,255,0.2);
}

/* Бейдж популярное */
.plan-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: #FFFFFF;
  color: #06080F;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 0 0 4px 4px;
}

.plan-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 8px;
  margin-top: 12px;
}

.plan-card--active .plan-name { color: #FFFFFF; }

.plan-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 20px;
}

.plan-price {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 40px;
  color: #FFFFFF;
}

.plan-currency {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  line-height: 1.4;
}

.plan-features li svg { flex-shrink: 0; margin-top: 1px; }
.plan-card--active .plan-features li { color: rgba(255,255,255,0.7); }

/* Итог заказа */
.order-summary {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 20px 24px;
  margin-bottom: 28px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.order-label {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255,255,255,0.35);
}

.order-value {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}

.order-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 8px 0;
}

.order-label--total {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
}

.order-value--total {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
}

/* Форма карты */
.card-form { display: flex; flex-direction: column; gap: 18px; }

/* Визуальная карта */
.card-visual {
  background: linear-gradient(135deg, #1a1f35 0%, #0d1228 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 8px;
}

.card-visual-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-visual-bank {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.5);
}

.card-visual-type {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.1em;
}

.card-visual-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.2em;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.card-visual-bottom {
  display: flex;
  gap: 32px;
}

.card-visual-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin-bottom: 4px;
}

.card-visual-value {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Поля */
.field { display: flex; flex-direction: column; gap: 6px; }

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
}

.input-wrap {
  position: relative;
}

.input-wrap input { width: 100%; }

.card-type-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.05);
  padding: 3px 8px;
  border-radius: 2px;
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
.field-error { font-size: 11px; color: #DC3C3C; }

/* Безопасность */
.security-note {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,0.2);
  line-height: 1.6;
}

.security-note svg { flex-shrink: 0; color: rgba(255,255,255,0.2); }

/* Кнопки */
.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 8px;
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
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity .2s;
}

.btn-submit:hover { opacity: 0.85; }

.btn-pay {
  flex: 1;
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity .2s;
}

.btn-pay:hover { opacity: 0.85; }
.btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }

/* Анимация загрузки */
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #06080F;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-back {
  padding: 14px 24px;
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

/* Страница успеха */
.step--success {
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  color: rgba(255,255,255,0.6);
  animation: fadeUp 0.5s ease both;
}

.success-btns {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 320px;
  margin: 0 auto;
}

.btn-outline {
  width: 100%;
  padding: 14px;
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-outline:hover {
  border-color: rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.8);
}
</style>