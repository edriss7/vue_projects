<template>
  <ProjectLayout title="Anagram Checker">
    <div class="card">
      <div class="row" style="gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <div class="col" style="flex:1;min-width:140px">
          <label class="label">Word A</label>
          <input v-model="a" class="input" placeholder="e.g. listen" @input="check" />
        </div>
        <div style="align-self:flex-end;padding-bottom:2px;font-size:1.5rem;color:var(--text2)">↔</div>
        <div class="col" style="flex:1;min-width:140px">
          <label class="label">Word B</label>
          <input v-model="b" class="input" placeholder="e.g. silent" @input="check" />
        </div>
      </div>

      <div v-if="a.trim() && b.trim()" class="result-box" style="text-align:center">
        <div style="font-size:2.5rem;margin-bottom:8px">{{ isAnagram ? '✅' : '❌' }}</div>
        <div style="font-size:1.2rem;font-weight:700">
          {{ isAnagram ? '"' + cleanA + '" and "' + cleanB + '" ARE anagrams!' : 'Not anagrams' }}
        </div>
      </div>

      <!-- Letter frequency comparison -->
      <div v-if="a.trim() && b.trim()" class="mt">
        <label class="label">Letter Frequency Comparison</label>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:6px">
          <div
            v-for="letter in allLetters"
            :key="letter"
            style="background:var(--bg3);border-radius:6px;padding:8px;text-align:center"
            :style="{
              borderBottom: '3px solid ' + (freqA[letter] === freqB[letter] ? 'var(--green)' : 'var(--red)')
            }"
          >
            <div style="font-weight:700;font-size:1rem">{{ letter.toUpperCase() }}</div>
            <div style="font-size:0.75rem;color:var(--text2)">
              <span :style="{ color: freqA[letter] ? 'var(--accent2)' : 'var(--text2)' }">{{ freqA[letter] || 0 }}</span>
              /
              <span :style="{ color: freqB[letter] ? 'var(--accent2)' : 'var(--text2)' }">{{ freqB[letter] || 0 }}</span>
            </div>
          </div>
        </div>
        <div style="color:var(--text2);font-size:0.78rem;margin-top:6px">A / B counts per letter</div>
      </div>

      <div class="divider" />
      <label class="label">Famous Anagram Pairs</label>
      <div class="row" style="flex-wrap:wrap;gap:6px">
        <button v-for="pair in PAIRS" :key="pair[0]"
          class="btn btn-sm btn-secondary"
          @click="a = pair[0]; b = pair[1]; check()">{{ pair[0] }} ↔ {{ pair[1] }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const a = ref('listen')
const b = ref('silent')

const cleanA = computed(() => a.value.toLowerCase().replace(/[^a-z]/g,''))
const cleanB = computed(() => b.value.toLowerCase().replace(/[^a-z]/g,''))

function freq(s: string): Record<string,number> {
  const f: Record<string,number> = {}
  for (const c of s) f[c] = (f[c] ?? 0) + 1
  return f
}

const freqA = computed(() => freq(cleanA.value))
const freqB = computed(() => freq(cleanB.value))

const allLetters = computed(() => {
  const s = new Set([...Object.keys(freqA.value), ...Object.keys(freqB.value)])
  return [...s].sort()
})

const isAnagram = computed(() => {
  if (!cleanA.value || !cleanB.value) return false
  if (cleanA.value.length !== cleanB.value.length) return false
  return JSON.stringify(freqA.value) === JSON.stringify(Object.fromEntries(Object.entries(freqB.value)))
    && allLetters.value.every(l => (freqA.value[l]??0) === (freqB.value[l]??0))
})

function check() { /* reactivity handles it */ }

const PAIRS = [
  ['listen','silent'], ['astronomer','moon starer'], ['school master','the classroom'],
  ['conversation','voices rant on'], ['debit card','bad credit'], ['dormitory','dirty room'],
  ['the morse code','here come dots'], ['slot machines','cash lost in me'],
]
</script>
