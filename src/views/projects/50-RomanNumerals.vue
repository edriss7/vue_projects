<template>
  <ProjectLayout title="Roman Numeral Converter">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:20px">
        <button class="btn" :class="mode==='to' ? 'btn-primary' : 'btn-secondary'" @click="mode='to'">Number → Roman</button>
        <button class="btn" :class="mode==='from' ? 'btn-primary' : 'btn-secondary'" @click="mode='from'">Roman → Number</button>
      </div>

      <div v-if="mode === 'to'">
        <label class="label">Integer (1 – 3999)</label>
        <input v-model.number="num" type="number" min="1" max="3999" class="input" @input="convertToRoman" />
        <div class="result-box mt" style="text-align:center;font-size:2.5rem;font-weight:800;letter-spacing:4px">
          {{ roman || '—' }}
        </div>
      </div>

      <div v-else>
        <label class="label">Roman Numeral</label>
        <input v-model="romanInput" class="input" placeholder="e.g. MMXXIV" style="text-transform:uppercase" @input="convertFromRoman" />
        <div class="result-box mt" style="text-align:center;font-size:2.5rem;font-weight:800">
          {{ numOutput || '—' }}
        </div>
        <div v-if="parseError" class="msg msg-error mt2">{{ parseError }}</div>
      </div>

      <div class="divider" />
      <!-- Breakdown -->
      <div v-if="mode === 'to' && breakdown.length">
        <label class="label">Breakdown</label>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          <div v-for="b in breakdown" :key="b.r" class="stat-box" style="min-width:80px">
            <div class="val" style="color:var(--accent2);font-size:1.1rem">{{ b.r }}</div>
            <div class="lbl">{{ b.n }}</div>
          </div>
        </div>
      </div>

      <!-- Reference table -->
      <div class="divider" />
      <label class="label">Reference</label>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px">
        <div v-for="[r,n] in REF" :key="r" style="background:var(--bg3);border-radius:6px;padding:8px;text-align:center">
          <div style="font-size:1rem;font-weight:700;color:var(--accent2)">{{ r }}</div>
          <div style="font-size:0.8rem;color:var(--text2)">{{ n }}</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const VALS: [string, number][] = [
  ['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],
  ['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]
]
const REF = VALS

const mode       = ref<'to'|'from'>('to')
const num        = ref(2024)
const roman      = ref('')
const romanInput = ref('MMXXIV')
const numOutput  = ref<number|string>('')
const parseError = ref('')

interface Breakdown { r: string; n: number }
const breakdown = ref<Breakdown[]>([])

function convertToRoman() {
  let n = num.value; roman.value = ''; breakdown.value = []
  if (!n || n < 1 || n > 3999) { roman.value = ''; return }
  for (const [r, v] of VALS) {
    while (n >= v) { roman.value += r; breakdown.value.push({ r, n: v }); n -= v }
  }
}

function convertFromRoman() {
  parseError.value = ''; numOutput.value = ''
  const s = romanInput.value.toUpperCase().trim()
  if (!s) return
  let i = 0, total = 0
  while (i < s.length) {
    const two = VALS.find(([r]) => s.startsWith(r, i) && r.length === 2)
    const one = VALS.find(([r]) => s.startsWith(r, i) && r.length === 1)
    const match = two ?? one
    if (!match) { parseError.value = `Invalid character "${s[i]}"`; return }
    total += match[1]; i += match[0].length
  }
  numOutput.value = total
}

convertToRoman()
convertFromRoman()
</script>
