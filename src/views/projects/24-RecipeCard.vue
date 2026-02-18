<template>
  <ProjectLayout title="Recipe Card">
    <div class="card">
      <div class="row" style="gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <button
          v-for="r in recipes"
          :key="r.name"
          class="btn btn-sm"
          :class="selected.name === r.name ? 'btn-primary' : 'btn-secondary'"
          @click="selected = r"
        >{{ r.emoji }} {{ r.name }}</button>
      </div>

      <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px;flex-wrap:wrap">
        <div style="font-size:4rem">{{ selected.emoji }}</div>
        <div>
          <h2 style="font-size:1.5rem;font-weight:800">{{ selected.name }}</h2>
          <div style="color:var(--text2);font-size:0.9rem;margin-top:4px">{{ selected.description }}</div>
          <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
            <span class="badge badge-blue">⏱ {{ selected.time }}</span>
            <span class="badge badge-green">🔥 {{ selected.cal }} kcal / serving</span>
            <span class="badge badge-yellow">👨‍🍳 {{ selected.difficulty }}</span>
          </div>
        </div>
      </div>

      <!-- Servings scaler -->
      <div class="row" style="gap:12px;align-items:center;margin-bottom:20px">
        <span class="label" style="margin:0">Servings:</span>
        <button class="qty-btn" @click="servings = Math.max(1, servings - 1)">−</button>
        <strong style="font-size:1.2rem;width:24px;text-align:center">{{ servings }}</strong>
        <button class="qty-btn" @click="servings++">+</button>
        <span style="color:var(--text2);font-size:0.85rem">(base: {{ selected.baseServings }})</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div>
          <label class="label">Ingredients</label>
          <ul style="list-style:none;padding:0">
            <li
              v-for="ing in scaledIngredients"
              :key="ing.name"
              style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bg3);font-size:0.9rem"
            >
              <span>{{ ing.name }}</span>
              <strong style="color:var(--accent2)">{{ ing.amount }}</strong>
            </li>
          </ul>
        </div>
        <div>
          <label class="label">Steps</label>
          <ol style="padding-left:1.4em">
            <li
              v-for="(step, i) in selected.steps"
              :key="i"
              style="margin-bottom:10px;font-size:0.9rem;line-height:1.5;cursor:pointer;opacity:1;transition:opacity 0.2s"
              :style="{ opacity: doneSteps.has(i) ? 0.4 : 1, textDecoration: doneSteps.has(i) ? 'line-through' : 'none' }"
              @click="toggleStep(i)"
            >{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Ingredient { name: string; amount: number; unit: string }
interface Recipe {
  name: string; emoji: string; description: string
  time: string; cal: number; difficulty: string
  baseServings: number; ingredients: Ingredient[]; steps: string[]
}

const recipes: Recipe[] = [
  {
    name: 'Pasta Carbonara', emoji: '🍝', description: 'Classic Roman pasta with egg, cheese, guanciale, and black pepper.',
    time: '20 min', cal: 520, difficulty: 'Medium', baseServings: 2,
    ingredients: [
      { name: 'Spaghetti',        amount: 200, unit: 'g'   },
      { name: 'Guanciale / bacon', amount: 100, unit: 'g'  },
      { name: 'Eggs (yolks)',     amount: 4,   unit: 'pcs' },
      { name: 'Pecorino Romano',  amount: 60,  unit: 'g'   },
      { name: 'Black pepper',     amount: 2,   unit: 'tsp' },
      { name: 'Salt',             amount: 1,   unit: 'tsp' },
    ],
    steps: [
      'Boil salted water and cook spaghetti al dente.',
      'Fry guanciale in a pan until crispy; set aside.',
      'Whisk yolks with grated Pecorino and plenty of black pepper.',
      'Reserve a cup of pasta water before draining.',
      'Toss hot pasta with guanciale off the heat.',
      'Add egg mixture, splash pasta water, toss vigorously to emulsify. Serve immediately.',
    ],
  },
  {
    name: 'Avocado Toast', emoji: '🥑', description: 'Quick and nutritious breakfast toast topped with creamy avocado.',
    time: '5 min', cal: 280, difficulty: 'Easy', baseServings: 1,
    ingredients: [
      { name: 'Bread slices',  amount: 2,   unit: 'pcs' },
      { name: 'Avocado',       amount: 1,   unit: 'pcs' },
      { name: 'Lemon juice',   amount: 1,   unit: 'tsp' },
      { name: 'Red chilli',    amount: 0.5, unit: 'pcs' },
      { name: 'Salt & pepper', amount: 1,   unit: 'pinch' },
    ],
    steps: [
      'Toast the bread to your liking.',
      'Mash avocado with lemon juice, salt and pepper.',
      'Spread avocado mixture on toast.',
      'Top with sliced chilli and optional toppings like eggs or seeds.',
    ],
  },
  {
    name: 'Chocolate Chip Cookies', emoji: '🍪', description: 'Soft, chewy homemade cookies loaded with chocolate chips.',
    time: '30 min', cal: 180, difficulty: 'Easy', baseServings: 24,
    ingredients: [
      { name: 'Flour',          amount: 280, unit: 'g'   },
      { name: 'Butter',         amount: 225, unit: 'g'   },
      { name: 'Brown sugar',    amount: 200, unit: 'g'   },
      { name: 'White sugar',    amount: 100, unit: 'g'   },
      { name: 'Eggs',           amount: 2,   unit: 'pcs' },
      { name: 'Vanilla extract',amount: 2,   unit: 'tsp' },
      { name: 'Baking soda',    amount: 1,   unit: 'tsp' },
      { name: 'Chocolate chips',amount: 340, unit: 'g'   },
    ],
    steps: [
      'Preheat oven to 190°C (375°F).',
      'Cream butter with both sugars until fluffy.',
      'Beat in eggs and vanilla.',
      'Mix in flour and baking soda until combined.',
      'Fold in chocolate chips.',
      'Drop rounded tablespoons on a baking sheet and bake 9–11 minutes.',
    ],
  },
]

const selected  = ref<Recipe>(recipes[0])
const servings  = ref(recipes[0].baseServings)
const doneSteps = ref(new Set<number>())

const scaledIngredients = computed(() =>
  selected.value.ingredients.map(ing => {
    const ratio = servings.value / selected.value.baseServings
    const scaled = ing.amount * ratio
    const amount = scaled % 1 === 0 ? String(scaled) : scaled.toFixed(1)
    return { name: ing.name, amount: `${amount} ${ing.unit}` }
  })
)

function toggleStep(i: number) {
  const s = new Set(doneSteps.value)
  s.has(i) ? s.delete(i) : s.add(i)
  doneSteps.value = s
}
</script>
