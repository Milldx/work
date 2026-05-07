<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page">
    <div class="glow"></div>

    <div class="box">
      <p class="code">404</p>
      <h1 class="title">Страница не найдена</h1>
      <p class="desc">Возможно, страница была удалена или ты перешёл по неверной ссылке</p>

      <div class="btns">
        <button class="btn-home" @click="router.push('/')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          На главную
        </button>
        <button class="btn-back" @click="router.go(-1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Назад
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #06080F;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 50% 40%, rgba(25, 70, 150, 0.3) 0%, transparent 65%);
  pointer-events: none;
  animation: glowPulse 6s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.box {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 480px;
  animation: fadeUp 0.7s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Большой номер 404 */
.code {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 160px;
  line-height: 1;
  color: rgba(255,255,255,0.06);
  letter-spacing: 0.05em;
  margin-bottom: -20px;
  user-select: none;
}

.title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 42px;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  line-height: 1;
}

.desc {
  font-size: 14px;
  font-weight: 300;
  color: rgba(255,255,255,0.35);
  line-height: 1.8;
  margin-bottom: 40px;
}

.btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #FFFFFF;
  color: #06080F;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: opacity .2s;
}

.btn-home:hover { opacity: 0.85; }

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4);
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 2px;
  transition: all .2s;
}

.btn-back:hover {
  border-color: rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.8);
}
</style>