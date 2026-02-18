<template>
  <ProjectLayout title="Currency Converter">
    <div class="card">
      <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap">
        <div class="col" style="flex:1;min-width:100px">
          <label class="label">Amount</label>
          <input v-model.number="amount" type="number" min="0" class="input" />
        </div>
        <div class="col" style="flex:1;min-width:120px">
          <label class="label">From</label>
          <select v-model="from" class="input">
            <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
          </select>
        </div>
        <button class="btn btn-secondary" style="margin-bottom:2px" @click="swap" title="Swap currencies">⇄</button>
        <div class="col" style="flex:1;min-width:120px">
          <label class="label">To</label>
          <select v-model="to" class="input">
            <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
          </select>
        </div>
      </div>

      <div class="result-box mt">
        <div style="color:var(--text2);font-size:0.85rem;margin-bottom:4px">Result</div>
        <div style="font-size:2rem;font-weight:800">{{ result }}</div>
        <div style="color:var(--text2);font-size:0.85rem;margin-top:6px">1 {{ from }} = {{ rate.toFixed(4) }} {{ to }}</div>
      </div>

      <div class="divider" />
      <h4 style="margin-bottom:12px">All conversions from {{ amount }} {{ from }}</h4>
      <div class="stat-grid">
        <div v-for="c in currencies.filter(c => c.code !== from)" :key="c.code" class="stat-box">
          <div class="val" style="font-size:1.1rem">{{ convert(from, c.code).toFixed(2) }}</div>
          <div class="lbl">{{ c.flag }} {{ c.code }}</div>
        </div>
      </div>

      <p style="color:var(--text2);font-size:0.78rem;margin-top:16px">* Rates are approximate and static for demo purposes.</p>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

// Static rates relative to USD
const rates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36,
  AUD: 1.53, CHF: 0.88, CNY: 7.24, INR: 83.1, BRL: 4.97,
}

const currencies = [
  { code: 'USD', flag: '🇺🇸' }, { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' }, { code: 'JPY', flag: '🇯🇵' },
  { code: 'CAD', flag: '🇨🇦' }, { code: 'AUD', flag: '🇦🇺' },
  { code: 'CHF', flag: '🇨🇭' }, { code: 'CNY', flag: '🇨🇳' },
  { code: 'INR', flag: '🇮🇳' }, { code: 'BRL', flag: '🇧🇷' },
]

const amount = ref(100)
const from   = ref('USD')
const to     = ref('EUR')

function convert(f: string, t: string) {
  return (amount.value / rates[f]) * rates[t]
}

const rate   = computed(() => convert(from.value, to.value) / amount.value)
const result = computed(() => {
  const v = convert(from.value, to.value)
  return isFinite(v) ? v.toFixed(2) + ' ' + to.value : '—'
})

function swap() { [from.value, to.value] = [to.value, from.value] }
</script>
