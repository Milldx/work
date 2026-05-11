<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const route = useRoute()

const currentUser = ref(null)

onMounted(function() {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
})

watch(route, function() {
  currentUser.value = JSON.parse(localStorage.getItem('currentUser') || 'null')
})

function logout() {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/')
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">FITNESS</RouterLink>

    <nav class="nav-links">
      <RouterLink to="/workout" class="nav-link">Тренировки</RouterLink>
      <RouterLink to="/nutrition" class="nav-link">Питание</RouterLink>
      <RouterLink to="/supplements" class="nav-link">Спортпит</RouterLink>
      <RouterLink to="/program" class="nav-link">Моя программа</RouterLink>
      <RouterLink to="/journal" class="nav-link">Прогресс</RouterLink>
    </nav>

    <div class="nav-right">
      <template v-if="currentUser">
        <RouterLink to="/profile" class="btn-profile">
          <img v-if="currentUser.avatar" :src="currentUser.avatar" class="profile-avatar" alt="avatar" />
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </RouterLink>
        <span class="user-name">{{ currentUser.name }}</span>
        <button class="btn-logout" @click="logout">Выйти</button>
      </template>

      <template v-else>
        <RouterLink to="/login" class="btn-login">Войти</RouterLink>
        <RouterLink to="/register" class="btn-register">Начать</RouterLink>
      </template>
    </div>
  </header>

  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #06080F; color: #FFFFFF; }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<style scoped>
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  padding: 0 48px;
  height: 68px;
  background: rgba(6, 8, 15, 0.92);
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
  gap: 14px;
  margin-left: auto;
}

.user-name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.05em;
}

.btn-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  overflow: hidden;
  transition: all .2s;
}

.btn-profile:hover { border-color: rgba(255,255,255,0.5); }

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-login {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  transition: color .2s;
}

.btn-login:hover { color: #FFFFFF; }

.btn-register {
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
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.35);
  padding: 9px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all .2s;
}

.btn-logout:hover {
  border-color: rgba(255,255,255,0.4);
  color: #FFFFFF;
}
</style>