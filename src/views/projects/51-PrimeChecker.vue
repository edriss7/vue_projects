<template>
  <ProjectLayout title="Prime Number Checker">
    <div class="card">
      <div class="row" style="gap:10px;margin-bottom:16px">
        <input v-model.number="num" type="number" min="1" class="input" placeholder="Enter a number…" @keyup.enter="check" />
        <button class="btn btn-primary" @click="check">Check</button>
      </div>

      <div v-if="result !== null" class="result-box" style="text-align:center">
        <div style="font-size:3rem;margin-bottom:8px">{{ result ? '✅' : '❌' }}</div>
        <div style="font-size:1.3rem;font-weight:700">{{ num }} is {{ result ? '' : 'NOT ' }}a prime number</div>
        <div v-if="!result && num > 1" style="color:var(--text2);font-size:0.9rem;margin-top:8px">
          Factors: {{ factors.join(' × ') }}
        </div>
      </div>

      <div class="divider" />
      <h4 style="margin-bottom:12px">Find Primes in a Range</h4>
      <div class="row" style="gap:8px;align-items:flex-end;flex-wrap:wrap">
        <div>
          <label class="label">From</label>
          <input v-model.number="rangeFrom" type="number" min="1" class="input" style="width:90px" />
        </div>
        <div>
          <label class="label">To</label>
          <input v-model.number="rangeTo" type="number" min="1" class="input" style="width:90px" />
        </div>
        <button class="btn btn-secondary" @click="sieve">Find Primes</button>
      </div>

      <div v-if="rangeResult.length > 0" class="mt">
        <div style="color:var(--text2);font-size:0.85rem;margin-bottom:8px">
          Found {{ rangeResult.length }} prime{{ rangeResult.length !== 1 ? 's' : '' }}
        </div>
        <div class="row" style="flex-wrap:wrap;gap:6px">
          <span v-for="p in rangeResult" :key="p" class="badge badge-blue">{{ p }}</span>
        </div>
      </div>
      <div v-if="rangeEmpty" class="msg msg-error mt2">No primes found in this range.</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const num    = ref<number>(17)
const result = ref<boolean | null>(null)
const factors= ref<number[]>([])

const rangeFrom  = ref(1)
const rangeTo    = ref(50)
const rangeResult= ref<number[]>([])
const rangeEmpty = ref(false)

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false
  return true
}

function getFactors(n: number): number[] {
  const f: number[] = []
  for (let i = 2; i <= n; i++) while (n % i === 0) { f.push(i); n /= i }
  return f
}

function check() {
  if (!num.value || num.value < 1) return
  result.value  = isPrime(num.value)
  factors.value = result.value ? [] : getFactors(num.value)
}

function sieve() {
  rangeEmpty.value = false
  rangeResult.value = []
  const to = Math.min(rangeTo.value, 10000)
  const composite = new Uint8Array(to + 1)
  for (let i = 2; i * i <= to; i++) {
    if (!composite[i]) for (let j = i*i; j <= to; j += i) composite[j] = 1
  }
  for (let i = Math.max(2, rangeFrom.value); i <= to; i++) {
    if (!composite[i]) rangeResult.value.push(i)
  }
  if (!rangeResult.value.length) rangeEmpty.value = true
}

check()
sieve()
</script>
