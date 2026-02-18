<template>
  <ProjectLayout title="Countdown Timer">
    <div class="card" style="text-align:center">
      <div v-if="!running && !finished">
        <h3 style="margin-bottom:20px;color:var(--text2)">Set duration</h3>
        <div class="row" style="justify-content:center;gap:16px">
          <div class="col" style="align-items:center">
            <label class="label">Hours</label>
            <input v-model.number="hInput" type="number" min="0" max="23" class="input" style="width:80px;text-align:center" />
          </div>
          <div style="font-size:2rem;padding-top:28px;color:var(--text2)">:</div>
          <div class="col" style="align-items:center">
            <label class="label">Minutes</label>
            <input v-model.number="mInput" type="number" min="0" max="59" class="input" style="width:80px;text-align:center" />
          </div>
          <div style="font-size:2rem;padding-top:28px;color:var(--text2)">:</div>
          <div class="col" style="align-items:center">
            <label class="label">Seconds</label>
            <input v-model.number="sInput" type="number" min="0" max="59" class="input" style="width:80px;text-align:center" />
          </div>
        </div>
        <button class="btn btn-primary mt" @click="start" :disabled="totalSeconds === 0">Start Timer</button>
      </div>

      <div v-else>
        <div
          class="timer-display"
          :style="{ color: remaining < 10 && !finished ? 'var(--red)' : 'var(--text)' }"
        >{{ formatted }}</div>

        <div class="progress-bar" style="max-width:300px;margin:0 auto 24px">
          <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>

        <div v-if="finished" class="msg msg-success" style="font-size:1.1rem;max-width:300px;margin:0 auto 20px">
          ⏰ Time's up!
        </div>

        <div class="row" style="justify-content:center;gap:12px">
          <button v-if="!finished" class="btn" :class="paused ? 'btn-success' : 'btn-warn'" @click="togglePause">
            {{ paused ? '▶ Resume' : '⏸ Pause' }}
          </button>
          <button class="btn btn-secondary" @click="reset">Reset</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const hInput = ref(0)
const mInput = ref(0)
const sInput = ref(30)

const running   = ref(false)
const paused    = ref(false)
const finished  = ref(false)
const remaining = ref(0)
const total     = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const totalSeconds = computed(() => (hInput.value * 3600) + (mInput.value * 60) + sInput.value)
const progressPct  = computed(() => total.value > 0 ? ((total.value - remaining.value) / total.value) * 100 : 0)

const formatted = computed(() => {
  const h = Math.floor(remaining.value / 3600)
  const m = Math.floor((remaining.value % 3600) / 60)
  const s = remaining.value % 60
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
})

function start() {
  total.value = remaining.value = totalSeconds.value
  running.value = true; paused.value = false; finished.value = false
  tick()
}

function tick() {
  timer = setInterval(() => {
    if (paused.value) return
    if (remaining.value <= 0) { finished.value = true; clearInterval(timer!); return }
    remaining.value--
  }, 1000)
}

function togglePause() { paused.value = !paused.value }

function reset() {
  clearInterval(timer!); running.value = false; paused.value = false
  finished.value = false; remaining.value = 0
}

onUnmounted(() => clearInterval(timer!))
</script>
