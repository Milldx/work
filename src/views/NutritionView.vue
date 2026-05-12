<template>
 <div class="nutrition-view">
    <div class="hero-section">
      <h1 class="page-title">ПИТАНИЕ</h1>
    </div>
    
    <!-- КАЛЬКУЛЯТОР КАЛОРИЙ -->
    <div class="calculator-section">
      <h2 class="calculator-title">📊 КАЛЬКУЛЯТОР КАЛОРИЙ</h2>
      <div class="calculator-grid">
        <div class="calculator-field">
          <label>РОСТ (СМ)</label>
          <input type="number" v-model.number="userData.height" class="calc-input" @input="autoCalculate">
        </div>
        <div class="calculator-field">
          <label>ВЕС (КГ)</label>
          <input type="number" v-model.number="userData.weight" class="calc-input" @input="autoCalculate">
        </div>
        <div class="calculator-field">
          <label>ВОЗРАСТ</label>
          <input type="number" v-model.number="userData.age" class="calc-input" @input="autoCalculate">
        </div>
        <div class="calculator-field">
          <label>ПОЛ</label>
          <select v-model="userData.gender" class="calc-select" @change="autoCalculate">
            <option value="male">МУЖСКОЙ</option>
            <option value="female">ЖЕНСКИЙ</option>
          </select>
        </div>
        <div class="calculator-field">
          <label>АКТИВНОСТЬ</label>
          <select v-model="userData.activity" class="calc-select" @change="autoCalculate">
            <option value="low">НИЗКАЯ (СИДЯЧАЯ РАБОТА)</option>
            <option value="medium">СРЕДНЯЯ (3-4 ТРЕНИРОВКИ)</option>
            <option value="high">ВЫСОКАЯ (5-6 ТРЕНИРОВОК)</option>
          </select>
        </div>
        <div class="calculator-field">
          <label>ЦЕЛЬ</label>
          <select v-model="userData.goal" class="calc-select" @change="autoCalculate">
            <option value="cut">СУШКА</option>
            <option value="bulk">МАССАНАБОР</option>
            <option value="maintain">ПОДДЕРЖАНИЕ</option>
            <option value="recomp">РЕКОМПОЗИЦИЯ</option>
          </select>
        </div>
    </div>
  </div>
    
    <!-- КАРТОЧКИ С НОРМАМИ -->
    <div class="macro-row">
      <div class="macro-card">
        <h3>БЕЛКИ</h3>
        <div class="macro-value">{{ totalProtein }} <span>Г</span></div>
        <div class="macro-target">НОРМА: {{ targetProtein }} Г</div>
        <div class="macro-diff" :class="{ over: remainingProtein < 0 }">
          {{ remainingProtein >= 0 ? 'Осталось: +' + remainingProtein : 'Перебор: ' + Math.abs(remainingProtein) }} Г
        </div>
      </div>
      <div class="macro-card">
        <h3>ЖИРЫ</h3>
        <div class="macro-value">{{ totalFat }} <span>Г</span></div>
        <div class="macro-target">НОРМА: {{ targetFat }} Г</div>
        <div class="macro-diff" :class="{ over: remainingFat < 0 }">
          {{ remainingFat >= 0 ? 'Осталось: +' + remainingFat : 'Перебор: ' + Math.abs(remainingFat) }} Г
        </div>
      </div>
      <div class="macro-card">
        <h3>УГЛЕВОДЫ</h3>
        <div class="macro-value">{{ totalCarbs }} <span>Г</span></div>
        <div class="macro-target">НОРМА: {{ targetCarbs }} Г</div>
        <div class="macro-diff" :class="{ over: remainingCarbs < 0 }">
          {{ remainingCarbs >= 0 ? 'Осталось: +' + remainingCarbs : 'Перебор: ' + Math.abs(remainingCarbs) }} Г
        </div>
      </div>
      <div class="macro-card">
        <h3>КАЛОРИИ</h3>
        <div class="macro-value">{{ totalCalories }} <span>ККАЛ</span></div>
        <div class="macro-target">НОРМА: {{ dailyNorm }} ККАЛ</div>
        <div class="macro-diff" :class="{ over: remainingCalories < 0 }">
          {{ remainingCalories >= 0 ? 'Осталось: +' + remainingCalories : 'Перебор: ' + Math.abs(remainingCalories) }} ККАЛ
        </div>
      </div>
    </div>

    <div class="meals-grid">
      <div v-for="(meal, mealName) in meals" :key="mealName" class="meal-card">
        <div class="meal-header">
          <h3>{{ getMealTitle(mealName) }}</h3>
          <button class="add-btn" @click="openFoodDatabase(mealName)">+ ДОБАВИТЬ</button>
        </div>
        <div v-if="!meal || meal.length === 0" class="empty-meal">НЕТ БЛЮД</div>
        <div v-for="(item, idx) in meal" :key="idx" class="food-item">
          <div class="food-info">
            <span class="food-name">{{ item.name }}</span>
            <div class="food-gramm-control">
              <input type="number" class="gramm-input" v-model.number="item.gramm" @input="updateGramm(mealName, idx)" min="1">
              <span class="gramm-unit">Г</span>
            </div>
          </div>
          <div class="food-stats">
            <span>🥩 {{ item.protein }}Г</span>
            <span>🧈 {{ item.fat }}Г</span>
            <span>🍚 {{ item.carbs }}Г</span>
          </div>
          <span class="food-cal">{{ item.calories }} ККАЛ</span>
          <button class="remove-btn" @click="removeFood(mealName, idx)">✖</button>
        </div>
      </div>
    </div>

    <div class="totals">
      <span>ИТОГО ЗА ДЕНЬ</span>
      <span>Б:{{ totalProtein }}Г | Ж:{{ totalFat }}Г | У:{{ totalCarbs }}Г | К:{{ totalCalories }}ККАЛ</span>
    </div>

    <!-- Модальное окно выбора продукта -->
    <div v-if="showFoodModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>ВЫБЕРИ ПРОДУКТ</h3>
        <input type="text" v-model="searchQuery" placeholder="🔍 ПОИСК..." class="search-input">
        
        <button class="custom-food-btn" @click="openCustomFoodModal">+ СОЗДАТЬ СВОЕ БЛЮДО</button>
        
        <div class="category-tabs">
          <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id" 
                  :class="['category-btn', { active: activeCategory === cat.id }]">
            {{ cat.name }}
          </button>
          <button class="category-btn" :class="{ active: activeCategory === 'custom' }" @click="activeCategory = 'custom'">
            ⭐ МОИ БЛЮДА
          </button>
        </div>
        
        <div class="food-list-modal">
          <div v-for="food in filteredFoods" :key="food.name" class="food-item-modal" @click="selectFood(food)">
            <div class="food-info">
              <span class="food-name-modal">{{ food.name }}</span>
              <span class="food-macros">Б:{{ food.protein }}Г Ж:{{ food.fat }}Г У:{{ food.carbs }}Г</span>
            </div>
            <span class="food-cal-modal">{{ food.calories }} ККАЛ/100Г</span>
          </div>
          <div v-if="filteredFoods.length === 0 && activeCategory === 'custom'" class="empty-custom">
            У вас пока нет своих блюд. Нажмите "СОЗДАТЬ СВОЕ БЛЮДО"
          </div>
        </div>
        
        <div class="modal-buttons">
          <button @click="closeModal" class="cancel-btn">ЗАКРЫТЬ</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания своего блюда -->
    <div v-if="showCustomModal" class="modal" @click.self="closeCustomModal">
      <div class="modal-content custom-modal">
        <h3>🍽️ СОЗДАТЬ СВОЕ БЛЮДО</h3>
        
        <div class="form-group-custom">
          <label>Название блюда</label>
          <input type="text" v-model="customFood.name" placeholder="Например: Мой фирменный салат">
        </div>
        
        <div class="form-group-custom">
          <label>Белки на 100 г (г)</label>
          <input type="number" v-model.number="customFood.protein" step="0.1" placeholder="0">
        </div>
        
        <div class="form-group-custom">
          <label>Жиры на 100 г (г)</label>
          <input type="number" v-model.number="customFood.fat" step="0.1" placeholder="0">
        </div>
        
        <div class="form-group-custom">
          <label>Углеводы на 100 г (г)</label>
          <input type="number" v-model.number="customFood.carbs" step="0.1" placeholder="0">
        </div>
        
        <div class="form-group-custom calories-info">
          <label>Калорийность (рассчитается автоматически)</label>
          <div class="calculated-calories">{{ calculatedCustomCalories }} ккал / 100 г</div>
        </div>
        
        <div class="modal-buttons">
          <button @click="saveCustomFood" class="save-btn">💾 СОХРАНИТЬ БЛЮДО</button>
          <button @click="closeCustomModal" class="cancel-btn">ОТМЕНА</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// БАЗА ПРОДУКТОВ
const foodDatabase = {
  grains: [
    { name: "Гречневая крупа", protein: 13, fat: 3.5, carbs: 68, calories: 343 },
    { name: "Рис белый", protein: 7, fat: 0.7, carbs: 78, calories: 345 },
    { name: "Овсяные хлопья", protein: 12, fat: 6.3, carbs: 65, calories: 350 },
    { name: "Киноа", protein: 14, fat: 6, carbs: 64, calories: 368 },
    { name: "Булгур", protein: 12.3, fat: 1.3, carbs: 76, calories: 342 }
  ],
  meat: [
    { name: "Куриная грудка", protein: 31, fat: 3.6, carbs: 0, calories: 165 },
    { name: "Говядина", protein: 26, fat: 15, carbs: 0, calories: 250 },
    { name: "Индейка", protein: 29, fat: 7, carbs: 0, calories: 189 },
    { name: "Лосось", protein: 25, fat: 14, carbs: 0, calories: 230 },
    { name: "Тунец", protein: 29, fat: 1.5, carbs: 0, calories: 130 }
  ],
  vegetables: [
    { name: "Брокколи", protein: 2.8, fat: 0.4, carbs: 7, calories: 34 },
    { name: "Морковь", protein: 0.9, fat: 0.1, carbs: 9.6, calories: 41 },
    { name: "Огурец", protein: 0.7, fat: 0.1, carbs: 3.6, calories: 15 },
    { name: "Помидор", protein: 0.9, fat: 0.2, carbs: 3.9, calories: 18 },
    { name: "Шпинат", protein: 2.9, fat: 0.4, carbs: 3.6, calories: 23 }
  ],
  fruits: [
    { name: "Яблоко", protein: 0.3, fat: 0.4, carbs: 13.8, calories: 52 },
    { name: "Банан", protein: 1.1, fat: 0.3, carbs: 22.8, calories: 89 },
    { name: "Апельсин",蛋白: 0.9, fat: 0.2, carbs: 11.8, calories: 47 },
    { name: "Киви", protein: 1.1, fat: 0.5, carbs: 14.7, calories: 61 }
  ],
  nuts: [
    { name: "Грецкий орех", protein: 15, fat: 65, carbs: 14, calories: 654 },
    { name: "Миндаль", protein: 21, fat: 51, carbs: 22, calories: 579 },
    { name: "Кешью", protein: 18, fat: 44, carbs: 30, calories: 553 }
  ],
  dairy: [
    { name: "Творог 5%", protein: 17, fat: 5, carbs: 3, calories: 121 },
    { name: "Творог 0%", protein: 18, fat: 0, carbs: 3.3, calories: 88 },
    { name: "Молоко 2.5%", protein: 2.8, fat: 2.5, carbs: 4.7, calories: 52 }
  ],
  eggs: [
    { name: "Яйцо куриное", protein: 13, fat: 11, carbs: 0.7, calories: 157 }
  ]
}

const categories = [
  { id: 'grains', name: 'КРУПЫ' },
  { id: 'meat', name: 'МЯСО/РЫБА' },
  { id: 'vegetables', name: 'ОВОЩИ' },
  { id: 'fruits', name: 'ФРУКТЫ' },
  { id: 'nuts', name: 'ОРЕХИ' },
  { id: 'dairy', name: 'МОЛОКО' },
  { id: 'eggs', name: 'ЯЙЦА' }
]
export default { 
  name: 'NutritionView',
  data() {
    return {
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      },
      userData: {
        height: 180,
        weight: 75,
        age: 25,
        gender: 'male',
        activity: 'medium',
        goal: 'maintain'
      },
      dailyNorm: 2200,
      targetProtein: 150,
      targetFat: 70,
      targetCarbs: 250,
      showFoodModal: false,
      showCustomModal: false,
      currentMeal: '',
      searchQuery: '',
      activeCategory: 'grains',
      foodDatabase: foodDatabase,
      categories: categories,
      customFoods: [],
      customFood: {
        name: '',
        protein: 0,
        fat: 0,
        carbs: 0,
        calories: 0
      }
    }
  },
  computed: {
    totalProtein() {
      let total = 0
      for (let meal in this.meals) {
        if (this.meals[meal]) {
          for (let food of this.meals[meal]) {
            total += food.protein || 0
          }
        }
      }
      return Math.round(total)
    },
    totalFat() {
      let total = 0
      for (let meal in this.meals) {
        if (this.meals[meal]) {
          for (let food of this.meals[meal]) {
            total += food.fat || 0
          }
        }
      }
      return Math.round(total)
    },
    totalCarbs() {
      let total = 0
      for (let meal in this.meals) {
        if (this.meals[meal]) {
          for (let food of this.meals[meal]) {
            total += food.carbs || 0
          }
        }
      }
      return Math.round(total)
    },
    totalCalories() {
      let total = 0
      for (let meal in this.meals) {
        if (this.meals[meal]) {
          for (let food of this.meals[meal]) {
            total += food.calories || 0
          }
        }
      }
      return Math.round(total)
    },
    remainingCalories() {
      return this.dailyNorm - this.totalCalories
    },
    remainingProtein() {
      return this.targetProtein - this.totalProtein
    },
    remainingFat() {
      return this.targetFat - this.totalFat
    },
    remainingCarbs() {
      return this.targetCarbs - this.totalCarbs
    },
    calculatedCustomCalories() {
      const calc = (this.customFood.protein * 4) + (this.customFood.fat * 9) + (this.customFood.carbs * 4)
      return Math.round(calc)
    },
    filteredFoods() {
      if (this.activeCategory === 'custom') {
        return [...this.customFoods]
      }
      let foods = this.foodDatabase[this.activeCategory] || []
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        foods = foods.filter(f => f.name.toLowerCase().includes(query))
        const customFiltered = this.customFoods.filter(f => f.name.toLowerCase().includes(query))
        foods = [...foods, ...customFiltered]
      }
      return foods
    }
  },
  mounted() {
    this.loadFromLocal()
    this.loadCustomFoods()
    this.loadUserData()
    if (!this.meals.breakfast || this.meals.breakfast.length === 0) {
      this.initDefaultMeals()
    }
  },
  methods: {
    autoCalculate() {
      // Пересчитываем все при изменении любого параметра
      this.calculateTDEE()
      this.saveUserData()
    },
    calculateTDEE() {
      // Защита от пустых значений
      if (!this.userData.height || this.userData.height <= 0) this.userData.height = 170
      if (!this.userData.weight || this.userData.weight <= 0) this.userData.weight = 70
      if (!this.userData.age || this.userData.age <= 0) this.userData.age = 25
      
      // 1. Расчет базового метаболизма (BMR)
      let bmr
      if (this.userData.gender === 'male') {
        bmr = 88.36 + (13.4 * this.userData.weight) + (4.8 * this.userData.height) - (5.7 * this.userData.age)
      } else {
        bmr = 447.6 + (9.2 * this.userData.weight) + (3.1 * this.userData.height) - (4.3 * this.userData.age)
      }
      
      // 2. Умножаем на активность
      const activityMap = { low: 1.2, medium: 1.55, high: 1.725 }
      let tdee = bmr * (activityMap[this.userData.activity] || 1.55)
      
      // 3. Корректируем под цель
      if (this.userData.goal === 'cut') {
        tdee -= 500
      } else if (this.userData.goal === 'bulk') {
        tdee += 300
      } else if (this.userData.goal === 'recomp') {
        tdee -= 200
      }
      
      // 4. Устанавливаем норму калорий
      this.dailyNorm = Math.round(tdee)
      
      // 5. РАСЧЕТ БЕЛКОВ И ЖИРОВ (ЗАВИСЯТ ОТ ВЕСА!)
      this.targetProtein = Math.round(this.userData.weight * 2)      // Белки = вес × 2
      this.targetFat = Math.round(this.userData.weight * 0.9)        // Жиры = вес × 0.9
      
      // 6. РАСЧЕТ УГЛЕВОДОВ (оставшиеся калории)
      let carbsFromCal = (this.dailyNorm - (this.targetProtein * 4) - (this.targetFat * 9)) / 4
      this.targetCarbs = Math.max(Math.round(carbsFromCal), 80)      // Минимум 80г углеводов
      
      console.log('=== ПЕРЕСЧЕТ НОРМЫ ===')
      console.log('Вес:', this.userData.weight, 'кг')
      console.log('Белки:', this.targetProtein, 'г (вес × 2)')
      console.log('Жиры:', this.targetFat, 'г (вес × 0.9)')
      console.log('Калории:', this.dailyNorm, 'ккал')
      console.log('Углеводы:', this.targetCarbs, 'г')
    },
    calculateAndSave() {
      this.calculateTDEE()
      this.saveUserData()
    },
    saveUserData() {
      const dataToSave = {
        height: this.userData.height,
        weight: this.userData.weight,
        age: this.userData.age,
        gender: this.userData.gender,
        activity: this.userData.activity,
        goal: this.userData.goal,
        dailyNorm: this.dailyNorm,
        targetProtein: this.targetProtein,
        targetFat: this.targetFat,
        targetCarbs: this.targetCarbs
      }
      localStorage.setItem('userNutritionData', JSON.stringify(dataToSave))
    },
    loadUserData() {
      const saved = localStorage.getItem('userNutritionData')
      if (saved) {
        const data = JSON.parse(saved)
        this.userData.height = data.height
        this.userData.weight = data.weight
        this.userData.age = data.age
        this.userData.gender = data.gender
        this.userData.activity = data.activity
        this.userData.goal = data.goal
        this.dailyNorm = data.dailyNorm
        this.targetProtein = data.targetProtein
        this.targetFat = data.targetFat
        this.targetCarbs = data.targetCarbs
      } else {
        this.calculateTDEE()
      }
    },
    initDefaultMeals() {
      this.meals = {
        breakfast: [{ name: "Овсяные хлопья", protein: 12, fat: 6.3, carbs: 65, calories: 350, originalProtein: 12, originalFat: 6.3, originalCarbs: 65, originalCalories: 350, gramm: 100 }],
        lunch: [{ name: "Куриная грудка", protein: 31, fat: 3.6, carbs: 0, calories: 165, originalProtein: 31, originalFat: 3.6, originalCarbs: 0, originalCalories: 165, gramm: 100 }],
        dinner: [{ name: "Гречневая крупа", protein: 13, fat: 3.5, carbs: 68, calories: 343, originalProtein: 13, originalFat: 3.5, originalCarbs: 68, originalCalories: 343, gramm: 100 }],
        snacks: [{ name: "Банан", protein: 1.1, fat: 0.3, carbs: 22.8, calories: 89, originalProtein: 1.1, originalFat: 0.3, originalCarbs: 22.8, originalCalories: 89, gramm: 100 }]
      }
      this.saveToLocal()
    },
    getMealTitle(meal) {
      const titles = { breakfast: 'ЗАВТРАК', lunch: 'ОБЕД', dinner: 'УЖИН', snacks: 'ПЕРЕКУСЫ' }
      return titles[meal]
    },
    openFoodDatabase(mealName) {
      this.currentMeal = mealName
      this.searchQuery = ''
      this.activeCategory = 'grains'
      this.showFoodModal = true
    },
    openCustomFoodModal() {
      this.showCustomModal = true
      this.customFood = { name: '', protein: 0, fat: 0, carbs: 0, calories: 0 }
    },
    closeCustomModal() {
      this.showCustomModal = false
    },
    saveCustomFood() {
      if (!this.customFood.name.trim()) return
      const calories = this.calculatedCustomCalories
      const newFood = {
        name: this.customFood.name,
        protein: this.customFood.protein,
        fat: this.customFood.fat,
        carbs: this.customFood.carbs,
        calories: calories,
        originalProtein: this.customFood.protein,
        originalFat: this.customFood.fat,
        originalCarbs: this.customFood.carbs,
        originalCalories: calories,
        isCustom: true
      }
      this.customFoods.push(newFood)
      this.saveCustomFoods()
      this.closeCustomModal()
    },
    selectFood(food) {
      const newFood = {
        name: food.name,
        originalProtein: food.protein,
        originalFat: food.fat,
        originalCarbs: food.carbs,
        originalCalories: food.calories,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        calories: food.calories,
        gramm: 100,
        isCustom: food.isCustom || false
      }
      this.meals[this.currentMeal].push({ ...newFood })
      this.closeModal()
      this.saveToLocal()
    },
    updateGramm(mealName, index) {
      const food = this.meals[mealName][index]
      let newGramm = food.gramm
      if (newGramm < 1 || isNaN(newGramm)) newGramm = 1
      const ratio = newGramm / 100
      food.gramm = newGramm
      food.protein = Math.round(food.originalProtein * ratio)
      food.fat = Math.round(food.originalFat * ratio)
      food.carbs = Math.round(food.originalCarbs * ratio)
      food.calories = Math.round(food.originalCalories * ratio)
      this.saveToLocal()
    },
    removeFood(mealName, index) {
      this.meals[mealName].splice(index, 1)
      this.saveToLocal()
    },
    closeModal() {
      this.showFoodModal = false
    },
    saveToLocal() {
      localStorage.setItem('nutritionMeals', JSON.stringify(this.meals))
    },
    loadFromLocal() {
      const saved = localStorage.getItem('nutritionMeals')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.breakfast) {
          this.meals = parsed
        }
      }
    },
    saveCustomFoods() {
      localStorage.setItem('customFoods', JSON.stringify(this.customFoods))
    },
    loadCustomFoods() {
      const saved = localStorage.getItem('customFoods')
      if (saved) {
        this.customFoods = JSON.parse(saved)
      }
    }
  }
}
</script>

<style scoped>
.nutrition-view {
  width: 100%;
}

.hero-section {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.calculator-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 24px;
  margin-bottom: 32px;
}

.calculator-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
  text-align: center;
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.calculator-field label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 8px;
}

.calc-input, .calc-select {
  width: 100%;
  padding: 12px;
  background: #06080F;
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  border-radius: 2px;
}

.goal-select {
  color: #000000 !important;
  background: rgba(255,255,255,0.9) !important;
  font-weight: 700 !important;
}

.macro-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.macro-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 20px;
  text-align: center;
}

.macro-card h3 {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
}

.macro-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  letter-spacing: 0.05em;
  color: #FFFFFF;
}

.macro-value span {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
}

.macro-target {
  font-size: 0.75rem;
  color: #ffffff;
  margin-top: 6px;
}

.macro-diff {
  font-size: 0.7rem;
  margin-top: 4px;
  color: rgba(255,255,255,0.4);
}

.macro-diff.over {
  color: #DC3C3C;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.meal-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  overflow: hidden;
}

.meal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.meal-header h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  color: #FFFFFF;
}

.add-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.8);
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 2px;
  cursor: pointer;
}

.add-btn:hover {
  background: rgba(255,255,255,0.1);
}

.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  flex-wrap: wrap;
  gap: 10px;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
}

.food-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: #FFFFFF;
}

.food-gramm-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gramm-input {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFFFFF;
  width: 65px;
  height: 30px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  border-radius: 2px;
}

.gramm-unit {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

.food-stats {
  display: flex;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
}

.food-cal {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  color: #FFFFFF;
  min-width: 65px;
}

.remove-btn {
  background: rgba(220,60,60,0.2);
  border: 1px solid rgba(220,60,60,0.3);
  color: #DC3C3C;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 2px;
  cursor: pointer;
}

.empty-meal {
  text-align: center;
  padding: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
}

.totals {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 2px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(6,8,15,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #06080F;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 2px;
  padding: 28px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
}

.custom-modal {
  max-width: 450px;
}

.modal-content h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  margin: 12px 0;
}

.custom-food-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,193,7,0.15);
  border: 1px solid rgba(255,193,7,0.3);
  color: #FFC107;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 12px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.category-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.18em;
  padding: 6px 10px;
  border-radius: 2px;
  cursor: pointer;
}

.category-btn.active {
  background: #FFFFFF;
  color: #06080F;
}

.food-list-modal {
  max-height: 350px;
  overflow-y: auto;
}

.food-item-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
}

.food-item-modal:hover {
  background: rgba(255,255,255,0.05);
}

.food-name-modal {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
}

.food-macros {
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.5);
}

.food-cal-modal {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  color: #FFFFFF;
}

.empty-custom {
  text-align: center;
  padding: 30px;
  color: rgba(255,255,255,0.4);
  font-size: 0.75rem;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.8);
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
}

.save-btn {
  background: #FFC107;
  border: none;
  color: #06080F;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
}

.form-group-custom {
  margin-bottom: 16px;
}

.form-group-custom label {
  display: block;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}

.form-group-custom input {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  border-radius: 2px;
}

.calories-info {
  background: rgba(255,255,255,0.03);
  padding: 10px;
}

.calculated-calories {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.3rem;
  color: #FFC107;
  margin-top: 6px;
}
</style>