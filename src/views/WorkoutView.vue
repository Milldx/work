<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { exercises } from '../data/exercises'

// роутер
const router = useRouter()

const goToExercise = (id) => {
  router.push(`/exercise/${id}`)
}

// поиск
const searchQuery = ref('')

// выбранные группы мышц
const selectedMuscles = ref([])

// тип тренировки
const selectedType = ref('все')

// список упражнений
const exercisesList = ref(exercises)

// группы мышц
const muscleGroups = computed(() => {
  return [...new Set(exercisesList.value.map(e => e.muscles))]
})

// фильтрация
const filteredExercises = computed(() => {
  return exercisesList.value.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchMuscle =
      selectedMuscles.value.length === 0 ||
      selectedMuscles.value.includes(e.muscles)

    const matchType =
      selectedType.value === 'все' ||
      e.type === selectedType.value

    return matchSearch && matchMuscle && matchType
  })
})

// чекбоксы
const toggleMuscle = (muscle) => {
  if (selectedMuscles.value.includes(muscle)) {
    selectedMuscles.value = selectedMuscles.value.filter(m => m !== muscle)
  } else {
    selectedMuscles.value.push(muscle)
  }
}

// Intersection Observer для анимаций
let observer = null

const observeElements = () => {
  // Отключаем старый observer, если есть
  if (observer) {
    observer.disconnect()
  }
  
  const elements = document.querySelectorAll('.animate-on-scroll')
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  
  elements.forEach(el => observer.observe(el))
}

// Следим за изменениями filteredExercises и перезапускаем анимации
watch(filteredExercises, async () => {
  await nextTick()
  observeElements()
}, { deep: true })

onMounted(() => {
  observeElements()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">ТРЕНИРОВКИ</p>
      <h1 class="page-title">Библиотека упражнений</h1>

      <!-- поиск -->
      <input
        v-model="searchQuery"
        placeholder="Поиск упражнения..."
        class="search"
      />

      <!-- тип тренировки -->
      <div class="types">
        <button @click="selectedType = 'все'" :class="{ active: selectedType === 'все' }">Все</button>
        <button @click="selectedType = 'Жимовые'" :class="{ active: selectedType === 'Жимовые' }">Жимовые</button>
        <button @click="selectedType = 'Тяговые'" :class="{ active: selectedType === 'Тяговые' }">Тяговые</button>
        <button @click="selectedType = 'Ноги'" :class="{ active: selectedType === 'Ноги' }">Ноги</button>
        <button @click="selectedType = 'Корпус'" :class="{ active: selectedType === 'Корпус' }">Корпус</button>
      </div>

      <!-- фильтр по мышцам -->
      <div class="muscles">
        <label v-for="muscle in muscleGroups" :key="muscle">
          <input
            type="checkbox"
            :checked="selectedMuscles.includes(muscle)"
            @change="toggleMuscle(muscle)"
          />
          {{ muscle }}
        </label>
      </div>

      <!-- список -->
      <div class="list">
        <div
          v-for="(e, index) in filteredExercises"
          :key="e.id"
          class="exercise-card animate-on-scroll"
          :style="{ transitionDelay: `${index * 0.05}s` }"
          @click="goToExercise(e.id)"
        >
          <div class="image">
            <img :src="e.image" :alt="e.name">
          </div>

          <div class="info">
            <h2>{{ e.name }}</h2>
            <p>{{ e.description }}</p>

            <div class="meta">
              <span>{{ e.muscles }}</span>
              <span>{{ e.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <p v-if="filteredExercises.length === 0" class="no-results">
        Ничего не найдено
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ----- ОСНОВНЫЕ ПЕРЕМЕННЫЕ (как в примере) ----- */
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

/* поиск */
.search {
  width: 100%;
  max-width: 500px;
  padding: 16px 24px;
  margin-bottom: 32px;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 60px;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  transition: var(--transition);
}

.search:focus {
  outline: none;
  border-color: rgba(59,130,246,0.5);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

.search::placeholder {
  color: rgba(255,255,255,0.35);
}

/* тип тренировки */
.types {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.types button {
  padding: 10px 24px;
  border: none;
  cursor: pointer;
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  border-radius: 60px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
}

.types button:hover {
  background: rgba(59,130,246,0.2);
  color: white;
  transform: translateY(-2px);
}

.types button.active {
  background: var(--accent);
  color: white;
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}

/* фильтр по мышцам */
.muscles {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 48px;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.muscles label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 6px 12px;
  border-radius: 40px;
  background: rgba(255,255,255,0.02);
}

.muscles label:hover {
  color: white;
  background: rgba(59,130,246,0.1);
}

.muscles input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--accent);
}

/* список упражнений */
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.exercise-card {
  display: flex;
  gap: 20px;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  padding: 20px;
  cursor: pointer;
  transition: var(--transition);
  height: 100%;
}

.exercise-card:hover {
  border-color: rgba(59,130,246,0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 35px -15px rgba(0,0,0,0.5);
}

.image {
  flex-shrink: 0;
  width: 160px;
  height: 130px;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(0,0,0,0.3);
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  justify-content: space-between;
}

.info h2 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  line-height: 1.3;
}

.info p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}

.meta {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  gap: 12px;
}

.meta span {
  background: rgba(255,255,255,0.05);
  padding: 5px 14px;
  border-radius: 40px;
  white-space: nowrap;
}

.no-results {
  text-align: center;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  padding: 60px;
  font-size: 16px;
}

/* Анимации при скролле */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Адаптивность */
@media (max-width: 1000px) {
  .page {
    padding: 60px 40px 40px;
  }
  
  .page-title {
    font-size: 44px;
  }
  
  .list {
    grid-template-columns: 1fr;
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
  
  .exercise-card {
    flex-direction: column;
  }
  
  .image {
    width: 100%;
    height: 200px;
  }
  
  .types button {
    padding: 8px 18px;
    font-size: 13px;
  }
  
  .info p {
    font-size: 13px;
  }
  
  .meta span {
    padding: 4px 12px;
    font-size: 11px;
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
</style>