<script setup>
import { useRouter } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()

function logout() {
  localStorage.clear()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">FITNESS</RouterLink>

    <nav class="nav-links">
      <RouterLink to="/workout" class="nav-link">Тренировки</RouterLink>
      <RouterLink to="/nutrition" class="nav-link">Питание</RouterLink>
      <RouterLink to="/program" class="nav-link">Моя программа</RouterLink>
    </nav>

    <div class="nav-right">
      <RouterLink to="/register" class="btn-register">Начать</RouterLink>
      <button class="btn-logout" @click="logout">Выйти</button>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <AppFooter />
</template>

<script>
import AppFooter from './components/AppFooter.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #06080F;
  color: #FFFFFF;
}
</style>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 48px;
  height: 68px;
  background: rgba(6, 8, 15, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  z-index: 200;
}

.logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.3em;
  color: #FFFFFF;
  text-decoration: none;
  margin-right: auto;
}

.nav-links {
  display: flex;
  gap: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  transition: color .25s;
}

.nav-link:hover { color: #FFFFFF; }
.nav-link.router-link-active { color: #FFFFFF; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.btn-register {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: #FFFFFF;
  color: #06080F;
  padding: 10px 24px;
  border-radius: 2px;
  text-decoration: none;
  transition: opacity .2s;
}

.btn-register:hover { opacity: 0.85; }

.btn-logout {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.4);
  padding: 9px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all .2s;
}

.btn-logout:hover {
  border-color: rgba(255,255,255,0.5);
  color: #FFFFFF;
}
</style>