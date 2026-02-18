<template>
  <ProjectLayout title="Password Generator">
    <div class="card">
      <div class="pass-display">{{ password || '—' }}</div>

      <div class="row mt2" style="gap:12px">
        <button class="btn btn-primary" @click="generate">Generate</button>
        <button class="btn btn-secondary" @click="copy">{{ copied ? '✓ Copied!' : 'Copy' }}</button>
      </div>

      <div class="divider" />

      <div class="col" style="gap:4px">
        <div class="row" style="justify-content:space-between">
          <label class="label" style="margin:0">Length: {{ length }}</label>
        </div>
        <input v-model.number="length" type="range" min="8" max="64" class="input" style="padding:6px 0;background:transparent;border:none" @input="generate" />
      </div>

      <div class="mt2">
        <label class="checkbox-row">
          <input type="checkbox" v-model="opts.upper" @change="generate" /> Uppercase (A–Z)
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="opts.lower" @change="generate" /> Lowercase (a–z)
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="opts.numbers" @change="generate" /> Numbers (0–9)
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="opts.symbols" @change="generate" /> Symbols (!@#$…)
        </label>
      </div>

      <div class="divider" />
      <div class="row" style="gap:8px;align-items:center">
        <span class="label" style="margin:0">Strength:</span>
        <span class="badge" :class="strengthClass">{{ strength }}</span>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const length  = ref(16)
const password = ref('')
const copied   = ref(false)

const opts = reactive({ upper: true, lower: true, numbers: true, symbols: false })

const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER   = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generate() {
  let charset = ''
  if (opts.upper)   charset += UPPER
  if (opts.lower)   charset += LOWER
  if (opts.numbers) charset += NUMBERS
  if (opts.symbols) charset += SYMBOLS
  if (!charset)     charset = LOWER

  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  password.value = Array.from(arr, n => charset[n % charset.length]).join('')
  copied.value = false
}

function copy() {
  navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const strength = computed(() => {
  const sets = [opts.upper, opts.lower, opts.numbers, opts.symbols].filter(Boolean).length
  if (length.value >= 20 && sets >= 3) return 'Strong'
  if (length.value >= 12 && sets >= 2) return 'Good'
  if (length.value >= 8)               return 'Fair'
  return 'Weak'
})

const strengthClass = computed(() => ({
  'Strong': 'badge-green',
  'Good':   'badge-blue',
  'Fair':   'badge-yellow',
  'Weak':   'badge-red',
}[strength.value] ?? 'badge-red'))

generate()
</script>
