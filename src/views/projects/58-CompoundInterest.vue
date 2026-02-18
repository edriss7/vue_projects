<template>
  <ProjectLayout title="Compound Interest">
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px">
        <div>
          <label class="label">Initial Investment ($)</label>
          <input v-model.number="principal" type="number" min="0" class="input" />
        </div>
        <div>
          <label class="label">Monthly Contribution ($)</label>
          <input v-model.number="monthly" type="number" min="0" class="input" />
        </div>
        <div>
          <label class="label">Annual Interest Rate (%)</label>
          <input v-model.number="rate" type="number" min="0" max="100" step="0.1" class="input" />
        </div>
        <div>
          <label class="label">Years</label>
          <input v-model.number="years" type="number" min="1" max="50" class="input" />
        </div>
        <div>
          <label class="label">Compounding</label>
          <select v-model="n" class="input">
            <option :value="1">Annually</option>
            <option :value="4">Quarterly</option>
            <option :value="12">Monthly</option>
            <option :value="365">Daily</option>
          </select>
        </div>
      </div>

      <div class="stat-grid mt">
        <div class="stat-box"><div class="val" style="color:var(--green)">${{ fmt(finalBalance) }}</div><div class="lbl">Final Balance</div></div>
        <div class="stat-box"><div class="val">${{ fmt(totalInvested) }}</div><div class="lbl">Total Invested</div></div>
        <div class="stat-box"><div class="val" style="color:var(--accent2)">${{ fmt(totalGain) }}</div><div class="lbl">Interest Earned</div></div>
        <div class="stat-box"><div class="val">{{ gainPct }}%</div><div class="lbl">Total Return</div></div>
      </div>

      <!-- Year-by-year table -->
      <div class="mt">
        <label class="label">Year-by-year growth</label>
        <div style="overflow-x:auto;max-height:240px;overflow-y:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
            <thead style="position:sticky;top:0;background:var(--bg2)">
              <tr style="color:var(--text2)">
                <th style="padding:6px 8px;text-align:left">Year</th>
                <th style="padding:6px 8px;text-align:right">Balance</th>
                <th style="padding:6px 8px;text-align:right">Invested</th>
                <th style="padding:6px 8px;text-align:right">Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in yearRows" :key="row.year" style="border-top:1px solid var(--bg3)">
                <td style="padding:6px 8px">{{ row.year }}</td>
                <td style="padding:6px 8px;text-align:right;color:var(--green)">${{ fmt(row.balance) }}</td>
                <td style="padding:6px 8px;text-align:right">${{ fmt(row.invested) }}</td>
                <td style="padding:6px 8px;text-align:right;color:var(--accent2)">+${{ fmt(row.gain) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const principal = ref(10000)
const monthly   = ref(500)
const rate      = ref(7)
const years     = ref(20)
const n         = ref(12)

const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const yearRows = computed(() => {
  const r = rate.value / 100 / n.value
  const rows = []
  let balance = principal.value
  for (let y = 1; y <= years.value; y++) {
    const periods = n.value
    for (let p = 0; p < periods; p++) {
      balance = balance * (1 + r) + monthly.value
    }
    const invested = principal.value + monthly.value * 12 * y
    rows.push({ year: y, balance, invested, gain: balance - invested })
  }
  return rows
})

const last         = computed(() => yearRows.value[yearRows.value.length - 1])
const finalBalance = computed(() => last.value?.balance ?? principal.value)
const totalInvested= computed(() => principal.value + monthly.value * 12 * years.value)
const totalGain    = computed(() => finalBalance.value - totalInvested.value)
const gainPct      = computed(() => totalInvested.value > 0 ? ((finalBalance.value / totalInvested.value - 1) * 100).toFixed(1) : '0')
</script>
