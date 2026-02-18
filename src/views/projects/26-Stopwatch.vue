<template>
  <ProjectLayout title="Stopwatch">
    <div class="card" style="text-align:center">
      <div class="timer-display">{{ formatted }}</div>

      <div class="row" style="justify-content:center;gap:12px;margin-bottom:24px">
        <button class="btn" :class="running ? 'btn-warn' : 'btn-success'" @click="toggle">
          {{ running ? '⏸ Stop' : '▶ Start' }}
        </button>
        <button class="btn btn-secondary" :disabled="!ms && !laps.length" @click="reset">↺ Reset</button>
        <button class="btn btn-secondary" :disabled="!running" @click="lap">🏁 Lap</button>
      </div>

      <div v-if="laps.length">
        <ul class="laps-list">
          <li
            v-for="(lap, i) in [...laps].reverse()"
            :key="i"
            :style="{ color: i === 0 ? 'var(--accent2)' : 'var(--text)' }"
          >
            <span>Lap {{ laps.length - i }}</span>
            <span>{{ lap.split }}</span>
            <span style="color:var(--text2)">+{{ lap.diff }}</span>
          </li>
        </ul>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const ms      = ref(0)
const running = ref(false)
const laps    = ref<{ split: string; diff: string }[]>([])
let interval: ReturnType<typeof setInterval> | null = null
let lastLapMs = 0

function fmt(n: number) {
  const h   = Math.floor(n / 3600000)
  const m   = Math.floor((n % 3600000) / 60000)
  const s   = Math.floor((n % 60000) / 1000)
  const cs  = Math.floor((n % 1000) / 10)
  const base = `${pad(m)}:${pad(s)}.${pad(cs)}`
  return h ? `${h}:${base}` : base
}

function pad(n: number) { return String(n).padStart(2, '0') }

const formatted = computed(() => fmt(ms.value))

function toggle() {
  if (running.value) {
    clearInterval(interval!); running.value = false
  } else {
    const start = Date.now() - ms.value
    interval = setInterval(() => ms.value = Date.now() - start, 10)
    running.value = true
  }
}

function reset() {
  clearInterval(interval!); running.value = false; ms.value = 0; laps.value = []; lastLapMs = 0
}

function lap() {
  const split = fmt(ms.value)
  const diff  = fmt(ms.value - lastLapMs)
  lastLapMs = ms.value
  laps.value.push({ split, diff })
}

onUnmounted(() => clearInterval(interval!))
</script>
