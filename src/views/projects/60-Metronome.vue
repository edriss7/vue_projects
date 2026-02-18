<template>
  <ProjectLayout title="Metronome">
    <div class="card" style="text-align:center">
      <div style="font-size:5rem;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums;margin-bottom:4px">
        {{ bpm }}
      </div>
      <div style="color:var(--text2);margin-bottom:20px">BPM</div>

      <input v-model.number="bpm" type="range" min="40" max="240" step="1"
        style="width:100%;max-width:320px;accent-color:var(--accent);margin-bottom:16px" />

      <div class="row" style="justify-content:center;gap:8px;margin-bottom:20px">
        <button class="btn btn-secondary btn-sm" @click="bpm = Math.max(40, bpm - 10)">-10</button>
        <button class="btn btn-secondary btn-sm" @click="bpm = Math.max(40, bpm - 1)">-1</button>
        <button class="btn btn-secondary btn-sm" @click="bpm = Math.min(240, bpm + 1)">+1</button>
        <button class="btn btn-secondary btn-sm" @click="bpm = Math.min(240, bpm + 10)">+10</button>
      </div>

      <!-- Beat indicator -->
      <div style="display:flex;justify-content:center;gap:10px;margin-bottom:24px">
        <div v-for="b in beatsPerBar" :key="b"
          :style="{
            width: '28px', height: '28px', borderRadius: '50%',
            background: activeBeat === b ? (b === 1 ? 'var(--accent2)' : 'var(--accent)') : 'var(--bg3)',
            transition: 'background 0.05s',
            border: '2px solid ' + (b === 1 ? 'var(--accent2)' : 'var(--bg3)'),
          }"
        />
      </div>

      <div class="row" style="justify-content:center;gap:8px;margin-bottom:20px">
        <span style="color:var(--text2);font-size:0.85rem">Beats per bar:</span>
        <button v-for="n in [2,3,4,6,8]" :key="n" class="btn btn-sm"
          :class="beatsPerBar === n ? 'btn-primary' : 'btn-secondary'"
          @click="beatsPerBar = n; beat = 0">{{ n }}</button>
      </div>

      <button class="btn btn-primary" style="font-size:1.1rem;padding:14px 48px" @click="toggle">
        {{ running ? '⏸ Stop' : '▶ Start' }}
      </button>

      <div style="margin-top:16px;color:var(--text2);font-size:0.85rem">{{ tempoName }}</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const bpm        = ref(120)
const running    = ref(false)
const beatsPerBar= ref(4)
const activeBeat = ref(0)
let beat         = 0
let ctx: AudioContext | null = null
let nextBeatTime  = 0
let scheduleId: number | null = null

const tempoName = computed(() => {
  const b = bpm.value
  if (b < 60)  return 'Largo'
  if (b < 66)  return 'Larghetto'
  if (b < 76)  return 'Adagio'
  if (b < 108) return 'Andante'
  if (b < 120) return 'Moderato'
  if (b < 156) return 'Allegro'
  if (b < 176) return 'Vivace'
  if (b < 200) return 'Presto'
  return 'Prestissimo'
})

function beep(time: number, isAccent: boolean) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.connect(g); g.connect(ctx.destination)
  o.frequency.value = isAccent ? 1000 : 800
  g.gain.setValueAtTime(isAccent ? 0.4 : 0.25, time)
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
  o.start(time); o.stop(time + 0.06)
}

function schedule() {
  if (!ctx) return
  while (nextBeatTime < ctx.currentTime + 0.1) {
    const isAccent = beat === 0
    beep(nextBeatTime, isAccent)
    const displayBeat = beat + 1
    const delay = (nextBeatTime - ctx.currentTime) * 1000
    setTimeout(() => { activeBeat.value = displayBeat }, Math.max(0, delay))
    nextBeatTime += 60 / bpm.value
    beat = (beat + 1) % beatsPerBar.value
  }
  scheduleId = requestAnimationFrame(schedule)
}

function toggle() {
  if (running.value) {
    running.value = false
    if (scheduleId !== null) cancelAnimationFrame(scheduleId)
    activeBeat.value = 0
    beat = 0
  } else {
    ctx = new AudioContext()
    nextBeatTime = ctx.currentTime
    beat = 0
    running.value = true
    schedule()
  }
}

watch(beatsPerBar, () => { beat = 0 })
onUnmounted(() => { if (scheduleId !== null) cancelAnimationFrame(scheduleId); ctx?.close() })
</script>
