<template>
  <ProjectLayout title="Number to Words">
    <div class="card">
      <label class="label">Enter a number</label>
      <input v-model="numStr" class="input" style="font-size:1.2rem;font-family:monospace"
        placeholder="e.g. 1234567" @input="convert" />

      <div v-if="error" class="msg msg-error mt2">{{ error }}</div>

      <div v-if="words" class="mt">
        <div style="background:var(--bg);border-radius:8px;padding:16px;font-size:1rem;line-height:1.6;color:var(--text)">
          {{ words }}
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:8px" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
      </div>

      <div class="divider" />

      <!-- Ordinal -->
      <div v-if="ordinal" style="font-size:0.9rem">
        Ordinal: <strong>{{ ordinal }}</strong>
      </div>

      <!-- Quick examples -->
      <label class="label mt2">Examples</label>
      <div class="row" style="flex-wrap:wrap;gap:6px">
        <button v-for="n in examples" :key="n" class="btn btn-sm btn-secondary"
          @click="numStr = n; convert()">{{ n }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const numStr = ref('42')
const words  = ref('')
const ordinal= ref('')
const error  = ref('')
const copied = ref(false)

const ones  = ['','one','two','three','four','five','six','seven','eight','nine',
                'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen',
                'seventeen','eighteen','nineteen']
const tens  = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']

function chunk(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? '-' + ones[n%10] : '')
  return ones[Math.floor(n/100)] + ' hundred' + (n%100 ? ' ' + chunk(n%100) : '')
}

function toWords(n: bigint): string {
  if (n === 0n) return 'zero'
  const neg = n < 0n
  n = neg ? -n : n
  const scales = ['','thousand','million','billion','trillion','quadrillion']
  const parts: string[] = []
  let i = 0
  while (n > 0n) {
    const rem = Number(n % 1000n)
    if (rem !== 0) parts.unshift(chunk(rem) + (scales[i] ? ' ' + scales[i] : ''))
    n /= 1000n; i++
  }
  return (neg ? 'negative ' : '') + parts.join(', ')
}

function ordinalSuffix(n: bigint): string {
  const abs = n < 0n ? -n : n
  const s = abs.toString()
  const last2 = Number(s.slice(-2))
  const last1 = Number(s.slice(-1))
  const suffix = last2 >= 11 && last2 <= 13 ? 'th'
    : last1 === 1 ? 'st' : last1 === 2 ? 'nd' : last1 === 3 ? 'rd' : 'th'
  return n.toString() + suffix
}

function convert() {
  error.value = ''; words.value = ''; ordinal.value = ''
  const s = numStr.value.trim().replace(/,/g, '')
  if (!s) return
  try {
    const n = BigInt(s)
    words.value = toWords(n)
    ordinal.value = ordinalSuffix(n)
  } catch {
    error.value = 'Enter a valid integer'
  }
}

function copy() {
  navigator.clipboard.writeText(words.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

const examples = ['0','42','100','1000','1000000','1234567','9876543210','-7']
convert()
</script>
