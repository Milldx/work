<template>
  <footer class="footer">
    <div class="footer-inner">

      <div class="footer-top">
        <div class="footer-brand">
          <p class="footer-logo">FITNESS</p>
          <p class="footer-desc">Персональные программы тренировок<br/>под твои цели и уровень подготовки</p>
        </div>

        <div class="footer-nav">
          <div class="footer-col">
            <p class="footer-col-title">Разделы</p>
            <RouterLink to="/workout" class="footer-link">Тренировки</RouterLink>
            <RouterLink to="/nutrition" class="footer-link">Питание</RouterLink>
            <RouterLink to="/supplements" class="footer-link">Спортпит</RouterLink>
            <RouterLink to="/program" class="footer-link">Моя программа</RouterLink>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">Аккаунт</p>
            <RouterLink to="/register" class="footer-link">Регистрация</RouterLink>
            <RouterLink to="/login" class="footer-link">Войти</RouterLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© 2025 FITNESS. Учебный проект.</p>
        <p class="footer-copy">Все данные хранятся локально в браузере</p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #06080F;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-family: 'Inter', sans-serif;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 80px 32px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 56px;
}

.footer-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 0.3em;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.footer-desc {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
  line-height: 1.8;
}

.footer-nav {
  display: flex;
  gap: 64px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  margin-bottom: 4px;
}

.footer-link {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255,255,255,0.45);
  text-decoration: none;
  transition: color .2s;
}

.footer-link:hover { color: #FFFFFF; }

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-copy {
  font-size: 11px;
  font-weight: 300;
  color: rgba(255,255,255,0.2);
  letter-spacing: 0.05em;
}
</style>