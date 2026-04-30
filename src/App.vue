<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.clear()
  router.push('/')
}
</script>

<template>
  <header>
    <nav>
      <router-link to="/">Главная</router-link>
      <router-link to="/workout">Тренировки</router-link>
      <router-link to="/nutrition">Питание</router-link>
      <router-link to="/program">Моя программа</router-link>
      <button @click="logout">Выйти</button>
    </nav>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  background-color: #222;
  padding: 10px 20px;
}

nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  color: #f0a500;
}

button {
  margin-left: auto;
  background: #f0a500;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
}

main {
  padding: 20px;
}
</style>
