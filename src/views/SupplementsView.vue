<template>
  <div class="supplements-view">
    <div class="hero-section">
      <h1 class="page-title">СПОРТИВНОЕ ПИТАНИЕ</h1>
      <p class="subtitle">ПОДБЕРИ ДОБАВКИ ПОД СВОИ ЦЕЛИ</p>
    </div>

    <div class="filter-section">
      <div class="filter-buttons">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-btn', { active: activeFilter === filter.value }]"
          @click="setFilter(filter.value)">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="supplements-grid">
      <div v-for="supplement in filteredSupplements" :key="supplement.name" class="supplement-card">
        <div class="card-icon">{{ supplement.icon }}</div>
        <h3>{{ supplement.name }}</h3>
        <p class="description">{{ supplement.description }}</p>
        
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">ЦЕЛЬ</span>
            <span class="detail-value">{{ supplement.goal }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">КОМУ ПОДХОДИТ</span>
            <span class="detail-value">{{ supplement.suitable }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ДОЗИРОВКА</span>
            <span class="detail-value">{{ supplement.dosage }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">КОГДА ПРИНИМАТЬ</span>
            <span class="detail-value">{{ supplement.when }}</span>
          </div>
        </div>
        
        <div class="benefits">
          <strong>ПРЕИМУЩЕСТВА</strong>
          <ul>
            <li v-for="benefit in supplement.benefits" :key="benefit">{{ benefit }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupplementsView',
  data() {
    return {
      activeFilter: 'all',
      filters: [
        { label: 'ВСЕ', value: 'all' },
        { label: 'МАССАНАБОР', value: 'bulk' },
        { label: 'СУШКА', value: 'cut' },
        { label: 'РЕКОМПОЗИЦИЯ', value: 'recomp' },
        { label: 'ПОДДЕРЖАНИЕ', value: 'maintain' }
      ],
      allSupplements: [
        {
          name: 'СЫВОРОТОЧНЫЙ ПРОТЕИН',
          icon: '🥤',
          description: 'Быстрый белок для роста мышц и восстановления',
          goal: 'Массанабор, Сушка, Поддержание, Рекомпозиция',
          suitable: 'Все спортсмены, особенно при недостатке белка в питании',
          dosage: '25-30 г (1 мерная ложка)',
          when: 'После тренировки, утром или между приемами пищи',
          benefits: ['Быстро усваивается (30-60 минут)', 'Содержит полный аминокислотный профиль', 'Помогает восстановиться после тренировки'],
          category: ['bulk', 'cut', 'recomp', 'maintain']
        },
        {
          name: 'КРЕАТИН МОНОГИДРАТ',
          icon: '💪',
          description: 'Повышает силу, выносливость и мышечную массу',
          goal: 'Массанабор, Рекомпозиция',
          suitable: 'Спортсмены силовых видов спорта, бодибилдеры',
          dosage: '3-5 г в день',
          when: 'Ежедневно, лучше после тренировки или утром',
          benefits: ['Увеличивает силу на 10-15%', 'Ускоряет восстановление', 'Увеличивает мышечную массу'],
          category: ['bulk', 'recomp']
        },
        {
          name: 'BCAA',
          icon: '🧬',
          description: 'Аминокислоты для защиты мышц от разрушения',
          goal: 'Сушка, Рекомпозиция',
          suitable: 'На сушке, при интенсивных тренировках, на низкокалорийной диете',
          dosage: '5-10 г',
          when: 'До, во время или после тренировки',
          benefits: ['Предотвращает катаболизм мышц', 'Снижает усталость', 'Ускоряет восстановление'],
          category: ['cut', 'recomp']
        },
        {
          name: 'L-КАРНИТИН',
          icon: '🔥',
          description: 'Сжигает жир и повышает выносливость',
          goal: 'Сушка, Поддержание',
          suitable: 'На сушке, для похудения, при кардио-тренировках',
          dosage: '1000-2000 мг',
          when: 'За 30-40 минут до тренировки или утром натощак',
          benefits: ['Ускоряет жиросжигание', 'Повышает энергию', 'Улучшает работу сердца'],
          category: ['cut', 'maintain']
        },
        {
          name: 'КАЗЕИН',
          icon: '🥛',
          description: 'Медленный белок для ночного восстановления',
          goal: 'Массанабор, Рекомпозиция',
          suitable: 'При наборе массы, на ночь для защиты мышц',
          dosage: '25-30 г',
          when: 'Перед сном или при длительных перерывах в еде',
          benefits: ['Обеспечивает мышцы аминокислотами до 8 часов', 'Отлично подходит перед сном', 'Хорошо утоляет голод'],
          category: ['bulk', 'recomp']
        },
        {
          name: 'ОМЕГА-3',
          icon: '🧠',
          description: 'Жирные кислоты для сердца, мозга и суставов',
          goal: 'Массанабор, Сушка, Поддержание, Рекомпозиция',
          suitable: 'Всем спортсменам и обычным людям',
          dosage: '2000-3000 мг',
          when: 'Во время еды, лучше разделить на 2 приема',
          benefits: ['Уменьшает воспаление', 'Защищает сердце и сосуды', 'Улучшает работу мозга'],
          category: ['bulk', 'cut', 'recomp', 'maintain']
        },
        {
          name: 'ВИТАМИН D3',
          icon: '🔋',
          description: 'Ключевой витамин для иммунитета и костей',
          goal: 'Массанабор, Сушка, Поддержание, Рекомпозиция',
          suitable: 'Всем, особенно в осенне-зимний период',
          dosage: '2000-5000 МЕ',
          when: 'Во время еды, лучше утром',
          benefits: ['Укрепляет иммунитет', 'Улучшает усвоение кальция', 'Поднимает тестостерон'],
          category: ['bulk', 'cut', 'recomp', 'maintain']
        },
        {
          name: 'МАГНИЙ',
          icon: '🌿',
          description: 'Снижает усталость и улучшает сон',
          goal: 'Поддержание, Рекомпозиция',
          suitable: 'При судорогах, бессоннице, стрессе',
          dosage: '300-400 мг',
          when: 'Вечером перед сном',
          benefits: ['Улучшает качество сна', 'Снижает мышечные судороги', 'Уменьшает стресс'],
          category: ['maintain', 'recomp']
        },
        {
          name: 'ГЛЮКОЗАМИН',
          icon: '🦴',
          description: 'Восстанавливает суставы и связки',
          goal: 'Массанабор, Рекомпозиция',
          suitable: 'При болях в суставах, после травм, в возрасте',
          dosage: '1500 мг в день',
          when: 'Во время еды',
          benefits: ['Восстанавливает хрящевую ткань', 'Снимает воспаление', 'Уменьшает боль в суставах'],
          category: ['bulk', 'recomp']
        },
        {
          name: 'МУЛЬТИВИТАМИНЫ',
          icon: '💊',
          description: 'Комплекс витаминов для общего здоровья',
          goal: 'Массанабор, Сушка, Поддержание, Рекомпозиция',
          suitable: 'Всем спортсменам для восполнения дефицита витаминов',
          dosage: '1 таблетка в день',
          when: 'Во время завтрака',
          benefits: ['Восполняет дефицит витаминов', 'Улучшает общее самочувствие', 'Повышает энергию'],
          category: ['bulk', 'cut', 'recomp', 'maintain']
        },
        {
          name: 'ЦИТРУЛЛИН МАЛАТ',
          icon: '🍯',
          description: 'Улучшает пампинг и восстановление',
          goal: 'Массанабор, Рекомпозиция',
          suitable: 'Для улучшения васкуляризации и восстановления',
          dosage: '6-8 г',
          when: 'За 30-60 минут до тренировки',
          benefits: ['Супер пампинг мышц', 'Улучшает восстановление', 'Снижает мышечную боль'],
          category: ['bulk', 'recomp']
        },
        {
          name: 'ZMA',
          icon: '😴',
          description: 'Улучшает сон и повышает тестостерон',
          goal: 'Массанабор, Рекомпозиция',
          suitable: 'При проблемах со сном, для повышения тестостерона',
          dosage: '30 мг цинка + 450 мг магния',
          when: 'За 30 минут до сна натощак',
          benefits: ['Улучшает качество сна', 'Повышает уровень тестостерона', 'Ускоряет восстановление'],
          category: ['bulk', 'recomp']
        }
      ]
    }
  },
  computed: {
    filteredSupplements() {
      if (this.activeFilter === 'all') {
        return this.allSupplements
      }
      return this.allSupplements.filter(supp => {
        return supp.category && supp.category.includes(this.activeFilter)
      })
    }
  },
  methods: {
    setFilter(value) {
      this.activeFilter = value
    }
  }
}
</script>

<style scoped>
.supplements-view {
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 48px;
  margin-top: 20px;
}

.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  margin-bottom: 12px;
  margin-top: 80px;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.filter-section {
  margin-bottom: 48px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.filter-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
}

.filter-btn.active {
  background: #FFFFFF;
  color: #06080F;
}

.filter-btn:hover:not(.active) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.supplements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;
}

.supplement-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 28px 24px;
  transition: all 0.25s;
}

.supplement-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.15);
  transform: translateY(-4px);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.supplement-card h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.description {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 20px;
  line-height: 1.4;
}

.details {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

.detail-value {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.8);
  text-align: right;
  max-width: 55%;
}

.benefits {
  background: rgba(255,255,255,0.02);
  padding: 14px;
}

.benefits strong {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  display: block;
  margin-bottom: 10px;
}

.benefits ul {
  margin: 0;
  padding-left: 18px;
}

.benefits li {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  margin: 6px 0;
}
</style>
