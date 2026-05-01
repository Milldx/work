<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedPlan = ref('')

const plans = [
  {
    id: 'base',
    name: 'Base',
    price: '490',
    features: ['Личная программа', 'База упражнений', 'Гид по питанию'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '890',
    features: ['Всё из Base', 'Программа обновляется каждый месяц', 'Расширенный гид по спортпиту'],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '1490',
    features: ['Всё из Pro', 'Индивидуальные рекомендации', 'Приоритетная поддержка'],
  },
]

function choosePlan(planId) {
  selectedPlan.value = planId
  localStorage.setItem('selectedPlan', planId)
  router.push('/register')
}

// Анимации при скролле
onMounted(function() {
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
          Тренируйся<br />
          <span class="hero-accent">в своём ритме</span>
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
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
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

    <!-- Подписка -->
    <section class="plans">
      <div class="plans-header animate-on-scroll">
        <p class="plans-label">Подписка</p>
        <h2 class="plans-title">Выбери свой план</h2>
        <p class="plans-subtitle">Ежемесячная оплата. Отмена в любое время.</p>
      </div>

      <div class="plans-grid">
        <div
          v-for="(plan, index) in plans"
          :key="plan.id"
          :class="['plan-card animate-on-scroll', { 'plan-card--active': selectedPlan === plan.id }]"
          :style="{ transitionDelay: (index * 0.1) + 's' }"
          @click="selectedPlan = plan.id"
        >
          <p class="plan-name">{{ plan.name }}</p>
          <div class="plan-price">
            <span class="plan-amount">{{ plan.price }}</span>
            <span class="plan-currency">₽ / мес</span>
          </div>
          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature" class="plan-feature">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ feature }}
            </li>
          </ul>
          <button class="plan-btn" @click.stop="choosePlan(plan.id)">
            Выбрать {{ plan.name }}
          </button>
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

/* Plans */
.plans {
  padding: 100px 80px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.plans-header { margin-bottom: 56px; }

.plans-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16px;
}

.plans-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 56px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.plans-subtitle {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
}

.plan-card {
  background: #06080F;
  padding: 44px 36px;
  cursor: pointer;
  transition: background .25s, opacity 0.7s ease, transform 0.7s ease;
}

.plan-card:hover { background: #0A0D1A; }
.plan-card--active { background: #0D1228; outline: 1px solid rgba(255,255,255,0.2); }

.plan-name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 16px;
}

.plan-card--active .plan-name { color: #FFFFFF; }

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 32px;
}

.plan-amount {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 52px;
  color: #FFFFFF;
}

.plan-currency {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 36px;
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
  color: rgba(255,255,255,0.45);
  line-height: 1.5;
}

.plan-feature svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: rgba(255,255,255,0.35);
}

.plan-card--active .plan-feature { color: rgba(255,255,255,0.7); }

.plan-btn {
  width: 100%;
  padding: 13px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.45);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.plan-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.3);
}

.plan-card--active .plan-btn {
  background: #FFFFFF;
  color: #06080F;
  border-color: #FFFFFF;
}
</style>