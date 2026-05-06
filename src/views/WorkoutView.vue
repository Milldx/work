<script setup>
import { ref, computed } from 'vue'
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
</script>

<template>
  <div class="workout">
    <h1>Тренировки</h1>

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
          @change="toggleMuscle(muscle)"
        />
        {{ muscle }}
      </label>
    </div>

    <!-- список -->
    <div class="list">
      <div
        v-for="e in filteredExercises"
        :key="e.id"
        class="card"
        @click="goToExercise(e.id)"
      >
        <div class="image">
          <img :src="e.image" alt="">
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

    <p v-if="filteredExercises.length === 0">
      Ничего не найдено
    </p>
  </div>
</template>

<style scoped>
.workout {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
}

.search {
  width: 50%;
  margin-left: 25%;
  padding: 10px;
  margin-bottom: 15px;
}

.types {
  margin-left: 35%;
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.types button {
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  background: #eee;
  border-radius: 6px;
}

.types button.active {
  background: #333;
  color: white;
}

.muscles {
  margin-left: 20%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.list {
  display: grid;
  grid-template-columns: 500px 500px;
  gap: 12px;
}

.card {
  display: flex;
  gap: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}

.card:hover {
  background: #333;
}

img{
  width: 200px;
  height: 150px;
}

.info h2 {
  margin: 0;
}

.meta {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 10px;
}
</style>