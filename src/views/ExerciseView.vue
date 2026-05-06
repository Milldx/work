<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { exercises } from '../data/exercises'

const route = useRoute()

const exercise = computed(() =>
  exercises.find(e => e.id === Number(route.params.id))
)
</script>

<template>
  <div v-if="exercise" class="page">
    <h1>{{ exercise.name }}</h1>

    <div class="image">
      <img :src="exercise.image" alt="">
    </div>

    <p>{{ exercise.description }}</p>

    <div class="meta">
      <span>Мышцы: {{ exercise.muscles }}</span>
      <span>Тип: {{ exercise.type }}</span>
    </div>
  </div>

  <p v-else>Упражнение не найдено</p>
</template>

<style scoped>
img{
    width: 200px;
    height: 150px;
}
</style>