<template>
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
      </div>
    </nav>
    
    <main>
      <section id="nutrition" class="section">
        <NutritionView />
      </section>
      
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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