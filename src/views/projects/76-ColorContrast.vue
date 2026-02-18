<template>
  <ProjectLayout title="Color Contrast Checker">
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div>
          <label class="label">Foreground</label>
          <div class="row" style="gap:8px">
            <input type="color" v-model="fg" style="width:40px;height:36px;border:none;border-radius:6px;cursor:pointer;padding:2px;background:transparent" />
            <input v-model="fg" class="input" style="font-family:monospace;font-size:0.88rem" />
          </div>
        </div>
        <div>
          <label class="label">Background</label>
          <div class="row" style="gap:8px">
            <input type="color" v-model="bg" style="width:40px;height:36px;border:none;border-radius:6px;cursor:pointer;padding:2px;background:transparent" />
            <input v-model="bg" class="input" style="font-family:monospace;font-size:0.88rem" />
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div style="border-radius:10px;overflow:hidden;margin-bottom:16px">
        <div :style="{ background: bg, color: fg, padding:'20px', textAlign:'center' }">
          <div style="font-size:1.4rem;font-weight:700;margin-bottom:6px">The quick brown fox</div>
          <div style="font-size:0.9rem">Aa Bb Cc — 0123456789</div>
          <div style="font-size:0.75rem;margin-top:6px;opacity:0.9">Small text sample (below 18pt)</div>
        </div>
      </div>

      <!-- Contrast ratio -->
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:3rem;font-weight:800" :style="{ color: ratioColor }">{{ ratio.toFixed(2) }}:1</div>
        <div style="color:var(--text2);font-size:0.85rem">Contrast Ratio</div>
      </div>

      <!-- WCAG results -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div v-for="level in wcagLevels" :key="level.label"
          style="padding:12px;border-radius:8px;text-align:center"
          :style="{ background: level.pass ? '#22c55e22' : '#ef444422', border: '1px solid ' + (level.pass ? '#22c55e' : '#ef4444') }">
          <div style="font-size:1.1rem">{{ level.pass ? '✓' : '✗' }}</div>
          <div style="font-weight:700;font-size:0.9rem">{{ level.label }}</div>
          <div style="font-size:0.75rem;color:var(--text2)">{{ level.desc }}</div>
          <div style="font-size:0.75rem;color:var(--text2)">Min {{ level.min }}:1</div>
        </div>
      </div>

      <!-- Swap -->
      <button class="btn btn-secondary btn-sm mt2" @click="[fg, bg] = [bg, fg]">⇄ Swap Colors</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const fg = ref('#ffffff')
const bg = ref('#1e293b')

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return [r, g, b]
}

function luminance(hex: string) {
  const rgb = hexToRgb(hex).map(v => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

const ratio = computed(() => {
  const l1 = luminance(fg.value.padEnd(7, '0'))
  const l2 = luminance(bg.value.padEnd(7, '0'))
  const lighter = Math.max(l1, l2)
  const darker  = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
})

const ratioColor = computed(() => {
  if (ratio.value >= 7)   return '#22c55e'
  if (ratio.value >= 4.5) return '#86efac'
  if (ratio.value >= 3)   return '#eab308'
  return '#ef4444'
})

const wcagLevels = computed(() => [
  { label: 'AA Normal',  desc: 'Normal text',  min: 4.5, pass: ratio.value >= 4.5 },
  { label: 'AA Large',   desc: 'Large text',   min: 3,   pass: ratio.value >= 3   },
  { label: 'AAA Normal', desc: 'Normal text',  min: 7,   pass: ratio.value >= 7   },
  { label: 'AAA Large',  desc: 'Large text',   min: 4.5, pass: ratio.value >= 4.5 },
])
</script>
