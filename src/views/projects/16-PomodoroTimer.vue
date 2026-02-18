<template>
  <ProjectLayout title="Pomodoro Timer">
    <div class="card" style="text-align:center">
      <!-- Mode tabs -->
      <div class="row" style="justify-content:center;gap:8px;margin-bottom:24px">
        <button
          v-for="m in modes"
          :key="m.key"
          class="btn btn-sm"
          :class="mode === m.key ? 'btn-primary' : 'btn-secondary'"
          @click="setMode(m.key)"
        >{{ m.label }}</button>
      </div>

      <!-- Circle display -->
      <div style="position:relative;width:200px;height:200px;margin:0 auto">
        <svg width="200" height="200" style="position:absolute;top:0;left:0;transform:rotate(-90deg)">
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--bg3)" stroke-width="10"/>
          <circle
            cx="100" cy="100" r="88" fill="none"
            :stroke="modeColor"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            style="transition:stroke-dashoffset 1s linear"
          />
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-size:3rem;font-weight:800;font-variant-numeric:tabular-nums">{{ formatted }}</div>
          <div style="font-size:0.85rem;color:var(--text2);margin-top:4px">{{ modeLabel }}</div>
        </div>
      </div>

      <div class="row" style="justify-content:center;gap:12px;margin-top:24px">
        <button class="btn btn-primary" @click="toggle">{{ running ? '⏸ Pause' : '▶ Start' }}</button>
        <button class="btn btn-secondary" @click="reset">↺ Reset</button>
      </div>

      <div class="stat-grid mt" style="max-width:300px;margin-left:auto;margin-right:auto">
        <div class="stat-box">
          <div class="val">{{ sessions }}</div>
          <div class="lbl">Sessions</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ totalFocusMin }}</div>
          <div class="lbl">Focus min</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type Mode = 'work' | 'short' | 'long'

const modes = [
  { key: 'work'  as Mode, label: 'Focus 25',    secs: 25 * 60 },
  { key: 'short' as Mode, label: 'Short Break',  secs: 5  * 60 },
  { key: 'long'  as Mode, label: 'Long Break',   secs: 15 * 60 },
]

const mode      = ref<Mode>('work')
const running   = ref(false)
const remaining = ref(25 * 60)
const sessions  = ref(0)
const totalFocusMin = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const circumference = 2 * Math.PI * 88
const totalSecs = computed(() => modes.find(m => m.key === mode.value)!.secs)
const dashOffset = computed(() => circumference * (1 - remaining.value / totalSecs.value))

const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const modeLabel = computed(() => modes.find(m => m.key === mode.value)?.label ?? '')
const modeColor = computed(() => ({ work: 'var(--accent)', short: 'var(--green)', long: '#3b82f6' }[mode.value]))

function setMode(m: Mode) {
  mode.value = m
  reset()
}

function toggle() {
  running.value = !running.value
  if (running.value) {
    timer = setInterval(() => {
      if (remaining.value <= 0) {
        clearInterval(timer!); running.value = false
        if (mode.value === 'work') { sessions.value++; totalFocusMin.value += 25 }
        return
      }
      remaining.value--
    }, 1000)
  } else {
    clearInterval(timer!)
  }
}

function reset() {
  clearInterval(timer!); running.value = false
  remaining.value = totalSecs.value
}

onUnmounted(() => clearInterval(timer!))
</script>
