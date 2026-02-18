<template>
  <ProjectLayout title="Color Guessing Game">
    <div class="card" style="text-align:center">
      <p style="color:var(--text2);margin-bottom:8px">Which swatch matches this color?</p>
      <div
        style="width:120px;height:120px;border-radius:16px;margin:0 auto 24px;transition:background 0.3s"
        :style="{ background: target }"
      />
      <h2 style="font-size:1.4rem;font-weight:800;font-family:monospace;margin-bottom:20px">{{ displayValue }}</h2>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:360px;margin:0 auto">
        <button
          v-for="(opt, i) in options"
          :key="i"
          @click="select(i)"
          :disabled="answered"
          style="aspect-ratio:1;border-radius:12px;border:3px solid transparent;cursor:pointer;transition:all 0.2s;position:relative"
          :style="{
            background: opt,
            borderColor: answered && i === correct ? 'var(--green)' :
                         answered && i === chosen  ? 'var(--red)'   : 'transparent',
            transform: answered && i === correct ? 'scale(1.05)' : 'scale(1)',
          }"
        >
          <span v-if="answered && i === correct" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">✓</span>
          <span v-if="answered && i === chosen && i !== correct" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem">✗</span>
        </button>
      </div>

      <div v-if="answered" class="msg mt" :class="chosen === correct ? 'msg-success' : 'msg-error'">
        {{ chosen === correct ? '🎉 Correct!' : '❌ Wrong! The correct answer was swatch #' + (correct+1) }}
      </div>

      <div class="row" style="justify-content:center;gap:8px;margin-top:16px">
        <button v-if="answered" class="btn btn-primary" @click="newRound">Next Round →</button>
        <span style="color:var(--text2);font-size:0.9rem;align-self:center">Score: {{ score }} / {{ total }}</span>
      </div>

      <div class="row" style="justify-content:center;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button v-for="m in modes" :key="m.key"
          class="btn btn-sm" :class="mode === m.key ? 'btn-primary' : 'btn-secondary'"
          @click="mode = m.key; newRound()">{{ m.label }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type Mode = 'hex' | 'rgb' | 'name'
const modes = [
  { key: 'hex' as Mode, label: 'HEX' },
  { key: 'rgb' as Mode, label: 'RGB' },
  { key: 'name' as Mode, label: 'Named' },
]

const NAMED: Record<string, string> = {
  Tomato:'#ff6347', Coral:'#ff7f50', Gold:'#ffd700', Orchid:'#da70d6',
  SlateBlue:'#6a5acd', MediumSeaGreen:'#3cb371', SteelBlue:'#4682b4',
  Crimson:'#dc143c', DarkOrange:'#ff8c00', MediumPurple:'#9370db',
}

const mode    = ref<Mode>('hex')
const target  = ref('')
const options = ref<string[]>([])
const correct = ref(0)
const chosen  = ref(-1)
const answered= ref(false)
const score   = ref(0)
const total   = ref(0)

function rndHex() {
  return '#' + [...Array(6)].map(() => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase()
}

const displayValue = ref('')

function newRound() {
  answered.value = false; chosen.value = -1
  const opts: string[] = []
  if (mode.value === 'name') {
    const keys = Object.keys(NAMED)
    const shuffled = [...keys].sort(() => Math.random()-0.5).slice(0,6)
    opts.push(...shuffled.map(k => NAMED[k]))
    correct.value = Math.floor(Math.random() * 6)
    target.value = opts[correct.value]
    displayValue.value = shuffled[correct.value]
  } else {
    for (let i = 0; i < 6; i++) opts.push(rndHex())
    correct.value = Math.floor(Math.random() * 6)
    target.value = opts[correct.value]
    if (mode.value === 'rgb') {
      const n = parseInt(target.value.slice(1), 16)
      displayValue.value = `rgb(${(n>>16)&255}, ${(n>>8)&255}, ${n&255})`
    } else {
      displayValue.value = target.value
    }
  }
  options.value = opts
}

function select(i: number) {
  if (answered.value) return
  chosen.value = i; answered.value = true; total.value++
  if (i === correct.value) score.value++
}

newRound()
</script>
