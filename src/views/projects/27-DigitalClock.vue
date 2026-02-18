<template>
  <ProjectLayout title="Digital Clock">
    <div class="card" style="text-align:center">
      <div class="clock-face" :style="{ color: hourAngle > 360/2 ? 'var(--accent2)' : 'var(--text)' }">
        {{ timeStr }}
      </div>
      <div class="clock-date">{{ dateStr }}</div>
      <div style="color:var(--text2);font-size:0.85rem;margin-top:6px">{{ tzStr }}</div>

      <div class="row" style="justify-content:center;gap:10px;margin-top:20px">
        <button class="btn btn-sm" :class="is24 ? 'btn-primary' : 'btn-secondary'" @click="is24 = true">24h</button>
        <button class="btn btn-sm" :class="!is24 ? 'btn-primary' : 'btn-secondary'" @click="is24 = false">12h</button>
      </div>

      <!-- Analog clock -->
      <div style="position:relative;width:180px;height:180px;margin:24px auto">
        <svg viewBox="0 0 180 180" width="180" height="180">
          <circle cx="90" cy="90" r="85" fill="var(--bg2)" stroke="var(--bg3)" stroke-width="4"/>
          <!-- Hour marks -->
          <line v-for="n in 12" :key="n"
            :x1="90 + 70 * Math.cos((n * 30 - 90) * Math.PI/180)"
            :y1="90 + 70 * Math.sin((n * 30 - 90) * Math.PI/180)"
            :x2="90 + 80 * Math.cos((n * 30 - 90) * Math.PI/180)"
            :y2="90 + 80 * Math.sin((n * 30 - 90) * Math.PI/180)"
            stroke="var(--bg3)" stroke-width="3" stroke-linecap="round"
          />
          <!-- Hour hand -->
          <line
            x1="90" y1="90"
            :x2="90 + 48 * Math.cos((hourAngle - 90) * Math.PI/180)"
            :y2="90 + 48 * Math.sin((hourAngle - 90) * Math.PI/180)"
            stroke="var(--text)" stroke-width="4" stroke-linecap="round"
          />
          <!-- Minute hand -->
          <line
            x1="90" y1="90"
            :x2="90 + 65 * Math.cos((minAngle - 90) * Math.PI/180)"
            :y2="90 + 65 * Math.sin((minAngle - 90) * Math.PI/180)"
            stroke="var(--accent2)" stroke-width="3" stroke-linecap="round"
          />
          <!-- Second hand -->
          <line
            x1="90" y1="90"
            :x2="90 + 70 * Math.cos((secAngle - 90) * Math.PI/180)"
            :y2="90 + 70 * Math.sin((secAngle - 90) * Math.PI/180)"
            stroke="var(--red)" stroke-width="1.5" stroke-linecap="round"
          />
          <circle cx="90" cy="90" r="4" fill="var(--red)" />
        </svg>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const now  = ref(new Date())
const is24 = ref(true)
let timer: ReturnType<typeof setInterval>

const pad = (n: number) => String(n).padStart(2, '0')

const timeStr = computed(() => {
  const h = now.value.getHours()
  const m = now.value.getMinutes()
  const s = now.value.getSeconds()
  if (is24.value) return `${pad(h)}:${pad(m)}:${pad(s)}`
  const h12 = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`
})

const dateStr = computed(() =>
  now.value.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
)
const tzStr = computed(() =>
  Intl.DateTimeFormat().resolvedOptions().timeZone
)

const secAngle  = computed(() => now.value.getSeconds() * 6)
const minAngle  = computed(() => now.value.getMinutes() * 6 + now.value.getSeconds() * 0.1)
const hourAngle = computed(() => (now.value.getHours() % 12) * 30 + now.value.getMinutes() * 0.5)

onMounted(() => { timer = setInterval(() => now.value = new Date(), 1000) })
onUnmounted(() => clearInterval(timer))
</script>
