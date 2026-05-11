<template>


  <header class="header">
    <RouterLink to="/" class="logo">FITNESS</RouterLink>

  <nav class="nav-links">
    <RouterLink to="/workout" class="nav-link">Тренировки</RouterLink>
    <RouterLink to="/nutrition" class="nav-link">Питание</RouterLink>
    <RouterLink to="/program" class="nav-link">Моя программа</RouterLink>
    <RouterLink to="/journal" class="nav-link">Прогресс</RouterLink>    <!-- новая ссылка -->
    <RouterLink to="/supplements" class="nav-link">Спортпит</RouterLink>
  </nav>

    <div class="nav-right">
      <!-- Если залогинен — показываем иконку профиля и выйти -->
      <template v-if="currentUser">
        <RouterLink to="/profile" class="btn-profile">
          <!-- Если есть аватарка — показываем её -->
          <img
            v-if="currentUser.avatar"
            :src="currentUser.avatar"
            class="profile-avatar"
            alt="avatar"
          />
          <!-- Иначе иконка пользователя -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </RouterLink>
        <span class="user-name">{{ currentUser.name }}</span>
        <button class="btn-logout" @click="logout">Выйти</button>
      </template>

      <!-- Если НЕ залогинен — показываем кнопку начать -->
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

  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo-section">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="logo-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <h2 class="logo">NUTRIPRO</h2>
        </div>

  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h2 class="logo">NUTRIPRO</h2>

      </div>
    </nav>
    
    <main>


      <!-- Секция ПИТАНИЕ - на первом месте -->

      <section id="nutrition" class="section">
        <NutritionView />
      </section>

      <!-- Секция СПОРТИВНОЕ ПИТАНИЕ - внизу -->

      <section id="supplements" class="section">
        <SupplementsView />
      </section>
    </main>
    
    <footer class="footer">

      <div class="footer-content">
        <div class="footer-icons">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <p>© 2024 NUTRIPRO — ТВОЙ ПЕРСОНАЛЬНЫЙ ТРЕКЕР</p>
      </div>
    </footer>
  </div>



      <p>© 2024 NUTRIPRO — ТВОЙ ПЕРСОНАЛЬНЫЙ ТРЕКЕР</p>
  </footer>
  </div>



</template>

<script>
import NutritionView from './views/NutritionView.vue'
import SupplementsView from './views/SupplementsView.vue'

export default {
  name: 'App',
  components: {
    NutritionView,
    SupplementsView
  }
}
</script>

<style>


@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #06080F; color: #FFFFFF; }
/* Анимация перехода между страницами */
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


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;




}

html {
  scroll-behavior: smooth;


}

body {
  background: #06080F;
  font-family: 'Inter', sans-serif;
  color: #FFFFFF;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: rgba(6,8,15,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}


.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #FFC107;
}


.logo {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.05em;
  font-size: 1.8rem;
  color: white;
}

main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
}

.section {
  scroll-margin-top: 80px;
  padding: 40px 0;
}

.footer {
  background: rgba(255,255,255,0.02);
  border-top: 1px solid rgba(255,255,255,0.07);
  text-align: center;
  padding: 24px;

}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.footer-icons svg {
  color: rgba(255,255,255,0.3);
  transition: color 0.2s;
}

.footer-icons svg:hover {
  color: #FFC107;
}

.footer p {

  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    text-align: center;
  }
  main {
    padding: 0 16px;
  }
}
</style>
