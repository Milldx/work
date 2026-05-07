<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedPlan = ref('')

const plans = [
  {
    id: 'premium',
    name: 'FITNESS Premium',
    price: '790',
    period: 'месяц',
    features: [
      'Личная программа тренировок',
      'База упражнений',
      'Персональный план питания',
      'Расширенный гид по спортпиту',
      'Калькулятор ИМТ',
      'История замеров',
    ],
  },
]

function choosePlan(planId) {
  selectedPlan.value = planId
  localStorage.setItem('selectedPlan', planId)

  // Если залогинен — сразу на оплату
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    router.push('/pay')
  } else {
    // Если нет — сначала регистрация
    router.push('/register')
  }
}

// Анимация при скролле для обычных блоков
onMounted(function() {
  // Обычные анимации
  const elements = document.querySelectorAll('.animate-on-scroll')
  const observer = new IntersectionObserver(function(entries) {
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-visible')
      }
    }
  }, { threshold: 0.15 })

  for (let i = 0; i < elements.length; i++) {
    observer.observe(elements[i])
  }

  // Анимация строк текста при скролле
  const lines = document.querySelectorAll('.hero-line')

  function onScroll() {
    const scrollY = window.scrollY
    const windowH = window.innerHeight

    for (let i = 0; i < lines.length; i++) {
      const rect = lines[i].getBoundingClientRect()
      const center = rect.top + rect.height / 2

      // Расстояние от центра экрана
      const distFromCenter = Math.abs(center - windowH * 0.45)
      const maxDist = windowH * 0.5

      // Чем ближе к центру — тем ярче
      const brightness = 1 - Math.min(distFromCenter / maxDist, 1)

      // opacity от 0.1 до 1
      const opacity = 0.1 + brightness * 0.9

      lines[i].style.opacity = opacity
    }
  }

  window.addEventListener('scroll', onScroll)
  onScroll() // запустить сразу
})
</script>

<template>
  <div class="home">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <p class="hero-label">Персональный фитнес</p>
        <h1 class="hero-title">
          <span class="hero-line">Тренируйся</span>
          <span class="hero-line hero-line--dim">в своём</span>
          <span class="hero-line hero-line--dim">ритме</span>
        </h1>
        <p class="hero-desc">
          Программа под твои цели.<br/>Пройди анкету — получи личный план.
        </p>
        <RouterLink to="/register" class="hero-btn">
          Начать тренироваться
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </RouterLink>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="features">
      <div class="feature-card animate-on-scroll">
        <div class="feature-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3 class="feature-title">Личная программа</h3>
        <p class="feature-text">Подбираем тренировки под твой пол, цель и уровень подготовки</p>
      </div>

      <div class="feature-card animate-on-scroll" style="transition-delay: 0.1s">
        <div class="feature-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6.5 6.5h11"/>
            <path d="M6.5 17.5h11"/>
            <path d="M3 8.5v7"/>
            <path d="M21 8.5v7"/>
            <path d="M1 10v4"/>
            <path d="M23 10v4"/>
            <path d="M3 8.5a2 2 0 0 1 2-2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2"/>
            <path d="M21 8.5a2 2 0 0 0-2-2h-1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2"/>
          </svg>
        </div>
        <h3 class="feature-title">База упражнений</h3>
        <p class="feature-text">Подробные описания упражнений с указанием групп мышц</p>
      </div>

      <div class="feature-card animate-on-scroll" style="transition-delay: 0.2s">
        <div class="feature-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <h3 class="feature-title">Спортивное питание</h3>
        <p class="feature-text">Гид по добавкам — что принимать, сколько и зачем</p>
      </div>
    </section>

    <!-- Статистика -->
<section class="stats">
  <div class="stat-item animate-on-scroll">
    <p class="stat-num">12+</p>
    <p class="stat-label">Программ тренировок</p>
  </div>
  <div class="stat-item animate-on-scroll" style="transition-delay:0.1s">
    <p class="stat-num">50+</p>
    <p class="stat-label">Упражнений в базе</p>
  </div>
  <div class="stat-item animate-on-scroll" style="transition-delay:0.2s">
    <p class="stat-num">3</p>
    <p class="stat-label">Уровня подготовки</p>
  </div>
  <div class="stat-item animate-on-scroll" style="transition-delay:0.3s">
    <p class="stat-num">10+</p>
    <p class="stat-label">Видов спортпита</p>
  </div>
</section>

<!-- Как это работает -->
<section class="how">
  <div class="how-header animate-on-scroll">
    <p class="plans-label">Процесс</p>
    <h2 class="plans-title">Как это работает</h2>
    <p class="plans-subtitle">Три шага до персональной программы</p>
  </div>

  <div class="how-steps">
    <div class="how-step animate-on-scroll">
      <div class="how-step-num">01</div>
      <div class="how-step-line"></div>
      <div class="how-step-content">
        <div class="how-step-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h3 class="how-step-title">Регистрация</h3>
        <p class="how-step-text">Создай аккаунт — это займёт меньше минуты</p>
      </div>
    </div>

    <div class="how-step animate-on-scroll" style="transition-delay:0.1s">
      <div class="how-step-num">02</div>
      <div class="how-step-line"></div>
      <div class="how-step-content">
        <div class="how-step-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <h3 class="how-step-title">Анкета</h3>
        <p class="how-step-text">Укажи цель, уровень подготовки и параметры тела</p>
      </div>
    </div>

    <div class="how-step animate-on-scroll" style="transition-delay:0.2s">
      <div class="how-step-num">03</div>
      <div class="how-step-line how-step-line--last"></div>
      <div class="how-step-content">
        <div class="how-step-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3 class="how-step-title">Твоя программа</h3>
        <p class="how-step-text">Получи личный план тренировок и начни заниматься</p>
      </div>
    </div>
  </div>
</section>

<!-- Мотивационный баннер -->
<section class="banner animate-on-scroll">
  <div class="banner-glow"></div>
  <div class="banner-content">
    <p class="banner-label">Начни сегодня</p>
    <h2 class="banner-title">Твоё тело — твой проект</h2>
    <p class="banner-desc">Пройди анкету за 2 минуты и получи персональную программу бесплатно</p>
    <RouterLink to="/register" class="banner-btn">
      Попробовать бесплатно
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </RouterLink>
  </div>
</section>

  <!-- Подписка -->
  <section class="plans">
    <div class="plans-header animate-on-scroll">
      <p class="plans-label">Подписка</p>
      <h2 class="plans-title">Один план — всё включено</h2>
      <p class="plans-subtitle">Ежемесячная оплата. Отмена в любое время.</p>
    </div>

    <div class="plan-single animate-on-scroll">
      <div class="plan-single-left">
        <p class="plan-name">FITNESS Premium</p>
        <div class="plan-price-wrap">
          <span class="plan-amount">790</span>
          <span class="plan-currency">₽ / мес</span>
        </div>
        <ul class="plan-features">
          <li v-for="feature in plans[0].features" :key="feature" class="plan-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ feature }}
          </li>
        </ul>
      </div>

      <div class="plan-single-right">
        <p class="plan-single-desc">
          Полный доступ ко всем функциям приложения.<br/>
          Персональная программа под твои цели.
        </p>
        <button class="plan-btn" @click="choosePlan('premium')">
          Оформить за 790 ₽/мес
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <p class="plan-note">Отмена в любое время</p>
      </div>
    </div>
  </section>

  </div>
</template>

<style scoped>
.home {
  background: #06080F;
  min-height: 100vh;
}

/* Анимации при скролле */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 80px 80px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 65% at 65% 35%, rgba(25, 70, 150, 0.5) 0%, transparent 65%),
    radial-gradient(ellipse 35% 45% at 25% 65%, rgba(10, 35, 90, 0.35) 0%, transparent 55%);
  animation: glowPulse 6s ease-in-out infinite;
  z-index: 0;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
  animation: fadeUp 0.9s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 96px;
  line-height: 0.95;
  color: #FFFFFF;
  letter-spacing: 0.03em;
  margin-bottom: 28px;
}

.hero-accent { color: rgba(255,255,255,0.25); }

.hero-desc {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  line-height: 1.8;
  margin-bottom: 44px;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: #FFFFFF;
  color: #06080F;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 2px;
  transition: opacity .2s;
}

.hero-btn:hover { opacity: 0.85; }

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid rgba(255,255,255,0.06);
}

.feature-card {
  padding: 52px 44px;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: background .25s, opacity 0.7s ease, transform 0.7s ease;
}

.feature-card:last-child { border-right: none; }
.feature-card:hover { background: rgba(255,255,255,0.02); }

.feature-icon {
  color: rgba(255,255,255,0.25);
  margin-bottom: 20px;
  transition: color .25s;
}

.feature-card:hover .feature-icon { color: rgba(255,255,255,0.7); }

.feature-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.feature-text {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
  line-height: 1.8;
}

/* Один план */
.plan-single {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.plan-single-left {
  padding: 48px 48px;
  border-right: 1px solid rgba(255,255,255,0.06);
}

.plan-single-right {
  padding: 48px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  background: rgba(255,255,255,0.02);
}

.plan-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
}

.plan-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 32px;
}

.plan-amount {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 72px;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}

.plan-currency {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-feature {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
}

.plan-feature svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: rgba(255,255,255,0.35);
}

.plan-single-desc {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
  line-height: 1.8;
}

.plan-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  background: #FFFFFF;
  color: #06080F;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: opacity .2s;
  width: fit-content;
}

.plan-btn:hover { opacity: 0.85; }

.plan-note {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,0.2);
  letter-spacing: 0.05em;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.stat-item {
  padding: 48px 40px;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: background .25s, opacity 0.7s ease, transform 0.7s ease;
}

.stat-item:last-child { border-right: none; }
.stat-item:hover { background: rgba(255,255,255,0.02); }

.stat-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px;
  color: #FFFFFF;
  letter-spacing: 0.03em;
  line-height: 1;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
}

/* Как это работает */
.how {
  padding: 100px 80px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.how-header {
  margin-bottom: 64px;
}

.how-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.how-step {
  display: grid;
  grid-template-columns: 60px 1px 1fr;
  gap: 0 32px;
  align-items: start;
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.how-step-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 13px;
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.2);
  padding-top: 24px;
  text-align: right;
}

.how-step-line {
  width: 1px;
  background: rgba(255,255,255,0.08);
  align-self: stretch;
  min-height: 100px;
}

.how-step-line--last { min-height: 0; }

.how-step-content {
  padding: 20px 0 48px 0;
}

.how-step-icon {
  color: rgba(255,255,255,0.3);
  margin-bottom: 14px;
  transition: color .25s;
}

.how-step:hover .how-step-icon { color: rgba(255,255,255,0.7); }

.how-step-title {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

.how-step-text {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
  line-height: 1.8;
}

/* Баннер */
.banner {
  position: relative;
  padding: 100px 80px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.banner-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 50% 50%, rgba(20, 60, 140, 0.4) 0%, transparent 70%);
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.banner-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16px;
}

.banner-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  line-height: 1;
}

.banner-desc {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.4);
  line-height: 1.8;
  margin-bottom: 36px;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: #FFFFFF;
  color: #06080F;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 2px;
  transition: opacity .2s;
}

.banner-btn:hover { opacity: 0.85; }

.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 96px;
  line-height: 1;
  color: #FFFFFF;
  letter-spacing: 0.03em;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
}

.hero-line {
  display: block;
  transition: opacity 0.1s ease;
  opacity: 1;
}

.hero-line--dim {
  opacity: 0.2;
}
</style>