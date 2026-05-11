<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { exercises } from '../data/exercises'

const route = useRoute()

const exercise = computed(() =>
  exercises.find(e => e.id === Number(route.params.id))
)

// Состояние для переключения между фото и гифкой
const showGif = ref(false)

const toggleMedia = () => {
  showGif.value = !showGif.value
}
</script>

<template>
  <div v-if="exercise" class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">УПРАЖНЕНИЕ</p>
      <h1 class="page-title">{{ exercise.name }}</h1>

      <div class="content-grid">
        <div class="image-section">
          <div class="image-wrapper">
            <img v-if="!showGif" :src="exercise.image" :alt="exercise.name">
            <img v-else-if="showGif && exercise.gif" :src="exercise.gif" :alt="exercise.name + ' - техника выполнения'"
              style="width: 100%; height: 260px; object-fit: cover; border-radius: 20px;">
            <div v-else class="gif-placeholder">
              <div class="gif-content">
                <span class="gif-icon">🎬</span>
                <p>GIF с техникой выполнения</p>
                <span class="gif-note">(скоро появится)</span>
              </div>
            </div>

            <!-- Кнопка переключения -->
            <button class="toggle-media-btn" @click="toggleMedia">
              {{ showGif ? 'Показать фото' : 'Показать GIF' }}
            </button>
          </div>

          <div class="meta-tags">
            <span class="tag muscle-tag">
              <span class="tag-icon">💪</span>
              {{ exercise.muscles }}
            </span>
            <span class="tag type-tag">
              <span class="tag-icon">🏋️</span>
              {{ exercise.type }}
            </span>
          </div>
        </div>

        <div class="info-section">
          <div class="description-card">
            <h3>Описание</h3>
            <p>{{ exercise.description }}</p>
          </div>

          <div class="tips-card">
            <h3>💡 Советы по выполнению</h3>
            <p>{{ exercise.tips }}</p>
          </div>

          <div class="technique-card">
            <h3>📋 Техника выполнения</h3>
            <p>{{ exercise.technique }}</p>
          </div>
        </div>
      </div>

      <div class="back-button">
        <button @click="$router.back()" class="btn-back">
          ← Вернуться к тренировкам
        </button>
      </div>
    </div>
  </div>

  <div v-else class="page">
    <div class="glow"></div>
    <div class="box">
      <p class="page-label">ОШИБКА</p>
      <h1 class="page-title">Упражнение не найдено</h1>
      <div class="back-button">
        <button @click="$router.push('/workout')" class="btn-back">
          ← Вернуться к тренировкам
        </button>
      </div>
    </div>
  </div>
</template>

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
  background: radial-gradient(ellipse 50% 60% at 70% 20%, rgba(59, 130, 246, 0.15), transparent 60%);
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
  0% {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(4px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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

.content-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.image-wrapper {
  position: relative;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 32px;
  padding: 24px;
  transition: var(--transition);
}

.image-wrapper:hover {
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 35px -15px rgba(0, 0, 0, 0.5);
}

.image-wrapper img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 20px;
}

/* Заглушка для GIF */
.gif-placeholder {
  width: 100%;
  height: 260px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(59, 130, 246, 0.3);
}

.gif-content {
  text-align: center;
  color: var(--text-secondary);
}

.gif-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.7;
}

.gif-content p {
  margin: 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.gif-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

/* Кнопка переключения */
.toggle-media-btn {
  position: absolute;
  bottom: 32px;
  right: 32px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 60px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  font-family: 'Inter', sans-serif;
}

.toggle-media-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  transform: scale(1.02);
}

.meta-tags {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 60px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  transition: var(--transition);
}

.tag:hover {
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.tag-icon {
  font-size: 16px;
}

.muscle-tag {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.type-tag {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.description-card,
.tips-card,
.technique-card {
  background: rgba(15, 25, 45, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  padding: 28px 32px;
  transition: var(--transition);
}

.description-card:hover,
.tips-card:hover,
.technique-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 8px 20px -8px rgba(59, 130, 246, 0.2);
}

.description-card h3,
.tips-card h3,
.technique-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  letter-spacing: -0.2px;
}

.description-card p,
.tips-card p,
.technique-card p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.back-button {
  margin-top: 32px;
  text-align: center;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: white;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 60px;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}

.btn-back:hover {
  background: var(--accent);
  border-color: var(--accent);
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

@media (max-width: 1000px) {
  .page {
    padding: 60px 40px 40px;
  }

  .page-title {
    font-size: 44px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .image-wrapper img,
  .gif-placeholder {
    height: 250px;
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

  .description-card,
  .tips-card,
  .technique-card {
    padding: 20px 24px;
  }

  .description-card h3,
  .tips-card h3,
  .technique-card h3 {
    font-size: 18px;
  }

  .description-card p,
  .tips-card p,
  .technique-card p {
    font-size: 14px;
  }

  .image-wrapper img,
  .gif-placeholder {
    height: 200px;
  }

  .tag {
    padding: 8px 16px;
    font-size: 12px;
  }

  .toggle-media-btn {
    bottom: 20px;
    right: 20px;
    padding: 6px 12px;
    font-size: 10px;
  }

  .gif-icon {
    font-size: 32px;
  }

  .gif-content p {
    font-size: 12px;
  }
}

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