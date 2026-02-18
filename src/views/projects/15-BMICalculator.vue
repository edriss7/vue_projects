<template>
  <ProjectLayout title="BMI Calculator">
    <div class="card">
      <div class="row" style="gap:12px;margin-bottom:16px">
        <button class="btn" :class="unit === 'metric' ? 'btn-primary' : 'btn-secondary'" @click="unit='metric'">Metric (kg/cm)</button>
        <button class="btn" :class="unit === 'imperial' ? 'btn-primary' : 'btn-secondary'" @click="unit='imperial'">Imperial (lbs/ft)</button>
      </div>

      <div v-if="unit === 'metric'" class="col" style="gap:12px">
        <div>
          <label class="label">Height (cm)</label>
          <input v-model.number="heightCm" type="number" class="input" placeholder="e.g. 175" min="50" max="250" />
        </div>
        <div>
          <label class="label">Weight (kg)</label>
          <input v-model.number="weightKg" type="number" class="input" placeholder="e.g. 70" min="10" max="300" />
        </div>
      </div>

      <div v-else class="col" style="gap:12px">
        <div class="row">
          <div style="flex:1">
            <label class="label">Height (ft)</label>
            <input v-model.number="heightFt" type="number" class="input" placeholder="5" min="1" max="8" />
          </div>
          <div style="flex:1">
            <label class="label">Height (in)</label>
            <input v-model.number="heightIn" type="number" class="input" placeholder="9" min="0" max="11" />
          </div>
        </div>
        <div>
          <label class="label">Weight (lbs)</label>
          <input v-model.number="weightLbs" type="number" class="input" placeholder="e.g. 154" min="20" max="660" />
        </div>
      </div>

      <div v-if="bmi" class="mt">
        <div class="result-box" style="text-align:center">
          <div style="font-size:3.5rem;font-weight:800" :style="{ color: categoryColor }">{{ bmi }}</div>
          <div style="font-size:1.2rem;font-weight:700;margin-top:4px" :style="{ color: categoryColor }">{{ category }}</div>
        </div>

        <!-- BMI scale bar -->
        <div class="mt2">
          <div style="position:relative;height:12px;border-radius:999px;background:linear-gradient(to right,#3b82f6 0%,#10b981 18.5%,#f59e0b 25%,#ef4444 30%,#7f1d1d 100%)">
            <div
              style="position:absolute;top:-4px;width:20px;height:20px;background:white;border-radius:50%;transform:translateX(-50%);transition:left 0.3s;border:3px solid #1e293b"
              :style="{ left: indicatorPct }"
            />
          </div>
          <div class="row" style="justify-content:space-between;margin-top:6px;font-size:0.75rem;color:var(--text2)">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
        </div>

        <div class="stat-grid mt">
          <div class="stat-box">
            <div class="val" style="font-size:1.1rem">{{ idealWeightRange }}</div>
            <div class="lbl">Ideal weight (kg)</div>
          </div>
          <div class="stat-box">
            <div class="val" style="font-size:1.1rem">{{ weightToLose }}</div>
            <div class="lbl">{{ weightDiff > 0 ? 'To lose (kg)' : 'To gain (kg)' }}</div>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const unit      = ref<'metric' | 'imperial'>('metric')
const heightCm  = ref(175)
const weightKg  = ref(70)
const heightFt  = ref(5)
const heightIn  = ref(9)
const weightLbs = ref(154)

const heightM = computed(() => {
  if (unit.value === 'metric') return heightCm.value / 100
  return ((heightFt.value * 12) + heightIn.value) * 0.0254
})
const weightInKg = computed(() => unit.value === 'metric' ? weightKg.value : weightLbs.value * 0.453592)

const bmiRaw = computed(() => {
  const h = heightM.value; const w = weightInKg.value
  if (!h || !w || h < 0.5) return 0
  return w / (h * h)
})

const bmi = computed(() => bmiRaw.value ? bmiRaw.value.toFixed(1) : null)

const category = computed(() => {
  const v = bmiRaw.value
  if (!v) return ''
  if (v < 18.5) return 'Underweight'
  if (v < 25)   return 'Normal weight'
  if (v < 30)   return 'Overweight'
  return 'Obese'
})

const colorMap: Record<string, string> = {
  'Underweight': '#3b82f6', 'Normal weight': 'var(--green)',
  'Overweight': 'var(--yellow)', 'Obese': 'var(--red)',
}
const categoryColor = computed(() => colorMap[category.value] ?? 'var(--text)')

const indicatorPct = computed(() => {
  const v = Math.min(Math.max(bmiRaw.value, 10), 40)
  return ((v - 10) / 30 * 100).toFixed(1) + '%'
})

const idealWeightRange = computed(() => {
  const h = heightM.value
  if (!h) return '—'
  return `${(18.5 * h * h).toFixed(1)} – ${(24.9 * h * h).toFixed(1)}`
})

const weightDiff = computed(() => {
  const h = heightM.value
  if (!h) return 0
  const ideal = 21.7 * h * h
  return weightInKg.value - ideal
})

const weightToLose = computed(() => weightDiff.value ? Math.abs(weightDiff.value).toFixed(1) : '—')
</script>
