<template>
  <ProjectLayout title="Password Strength Checker">
    <div class="card">
      <label class="label">Password</label>
      <div style="position:relative">
        <input v-model="password" :type="show ? 'text' : 'password'" class="input" placeholder="Enter a password…"
          style="padding-right:48px" />
        <button @click="show=!show"
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text2);font-size:1rem">
          {{ show ? '🙈' : '👁' }}
        </button>
      </div>

      <!-- Strength bar -->
      <div style="display:flex;gap:4px;margin-top:10px">
        <div v-for="i in 5" :key="i"
          style="flex:1;height:6px;border-radius:3px;transition:background 0.3s"
          :style="{ background: i <= score ? strengthColor : 'var(--bg3)' }"
        />
      </div>
      <div style="font-size:0.85rem;font-weight:700;margin-top:6px" :style="{ color: strengthColor }">
        {{ strengthLabel }}
      </div>

      <!-- Criteria checklist -->
      <div class="mt" style="display:flex;flex-direction:column;gap:6px">
        <div v-for="c in criteria" :key="c.label"
          style="display:flex;align-items:center;gap:8px;font-size:0.85rem">
          <span :style="{ color: c.pass ? 'var(--green)' : 'var(--red)' }">{{ c.pass ? '✓' : '✗' }}</span>
          <span :style="{ color: c.pass ? 'var(--text)' : 'var(--text2)' }">{{ c.label }}</span>
        </div>
      </div>

      <div class="divider" />

      <!-- Entropy -->
      <div style="font-size:0.85rem;color:var(--text2)">
        Entropy: <strong style="color:var(--text)">{{ entropy.toFixed(1) }} bits</strong>
        &nbsp;·&nbsp; Charset size: <strong style="color:var(--text)">{{ charsetSize }}</strong>
      </div>

      <button class="btn btn-secondary mt2" @click="generate">Generate Strong Password</button>
      <div v-if="generated" style="font-family:monospace;font-size:0.88rem;margin-top:8px;word-break:break-all;background:var(--bg);padding:8px;border-radius:6px">
        {{ generated }}
        <button class="btn btn-sm btn-secondary" style="margin-left:8px" @click="copy">{{ copied ? '✓' : 'Copy' }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const password  = ref('')
const show      = ref(false)
const generated = ref('')
const copied    = ref(false)

const criteria = computed(() => [
  { label: 'At least 8 characters',          pass: password.value.length >= 8 },
  { label: 'At least 12 characters',         pass: password.value.length >= 12 },
  { label: 'Uppercase letter (A–Z)',          pass: /[A-Z]/.test(password.value) },
  { label: 'Lowercase letter (a–z)',          pass: /[a-z]/.test(password.value) },
  { label: 'Number (0–9)',                    pass: /\d/.test(password.value) },
  { label: 'Special character (!@#$…)',       pass: /[^a-zA-Z0-9]/.test(password.value) },
  { label: 'No repeated characters (3+ in a row)', pass: !/(.)\1\1/.test(password.value) },
])

const charsetSize = computed(() => {
  let s = 0
  if (/[a-z]/.test(password.value)) s += 26
  if (/[A-Z]/.test(password.value)) s += 26
  if (/\d/.test(password.value))    s += 10
  if (/[^a-zA-Z0-9]/.test(password.value)) s += 32
  return s || 1
})

const entropy = computed(() =>
  password.value.length * Math.log2(charsetSize.value)
)

const score = computed(() => {
  const passed = criteria.value.filter(c => c.pass).length
  if (passed <= 1) return 1
  if (passed <= 2) return 2
  if (passed <= 4) return 3
  if (passed <= 5) return 4
  return 5
})

const strengthLabel = computed(() =>
  ['','Very Weak','Weak','Fair','Strong','Very Strong'][score.value]
)
const strengthColor = computed(() =>
  ['','#ef4444','#f97316','#eab308','#22c55e','#6366f1'][score.value]
)

function generate() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
  const arr = new Uint8Array(20)
  crypto.getRandomValues(arr)
  generated.value = Array.from(arr).map(b => chars[b % chars.length]).join('')
  copied.value = false
}

function copy() {
  navigator.clipboard.writeText(generated.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}
</script>
