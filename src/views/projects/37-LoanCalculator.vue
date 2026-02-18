<template>
  <ProjectLayout title="Loan Calculator">
    <div class="card">
      <div class="col" style="gap:12px">
        <div>
          <label class="label">Principal ($)</label>
          <input v-model.number="principal" type="number" min="0" class="input" />
        </div>
        <div>
          <label class="label">Annual Interest Rate (%)</label>
          <input v-model.number="rate" type="number" min="0" max="100" step="0.1" class="input" />
        </div>
        <div>
          <label class="label">Loan Term (years)</label>
          <input v-model.number="years" type="number" min="1" max="50" class="input" />
        </div>
      </div>

      <div v-if="monthly > 0" class="mt">
        <div class="stat-grid">
          <div class="stat-box">
            <div class="val" style="color:var(--accent2)">${{ fmt(monthly) }}</div>
            <div class="lbl">Monthly Payment</div>
          </div>
          <div class="stat-box">
            <div class="val">${{ fmt(totalPayment) }}</div>
            <div class="lbl">Total Payment</div>
          </div>
          <div class="stat-box">
            <div class="val" style="color:var(--red)">${{ fmt(totalInterest) }}</div>
            <div class="lbl">Total Interest</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ interestPct }}%</div>
            <div class="lbl">Interest Ratio</div>
          </div>
        </div>

        <!-- Visual split -->
        <div style="margin-top:20px">
          <label class="label">Principal vs Interest</label>
          <div style="height:20px;border-radius:999px;overflow:hidden;display:flex">
            <div :style="{ width: (100-parseFloat(interestPct))+'%', background:'var(--accent)', transition:'width 0.4s' }" />
            <div :style="{ flex:1, background:'var(--red)' }" />
          </div>
          <div class="row" style="justify-content:space-between;font-size:0.8rem;color:var(--text2);margin-top:4px">
            <span>Principal ({{ (100-parseFloat(interestPct)).toFixed(1) }}%)</span>
            <span>Interest ({{ interestPct }}%)</span>
          </div>
        </div>

        <!-- Amortization schedule (first 12 months) -->
        <div class="mt">
          <label class="label">Amortization (first year)</label>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr style="color:var(--text2)">
                  <th style="padding:6px 8px;text-align:left;font-weight:600">#</th>
                  <th style="padding:6px 8px;text-align:right;font-weight:600">Payment</th>
                  <th style="padding:6px 8px;text-align:right;font-weight:600">Principal</th>
                  <th style="padding:6px 8px;text-align:right;font-weight:600">Interest</th>
                  <th style="padding:6px 8px;text-align:right;font-weight:600">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in schedule.slice(0,12)" :key="row.n" style="border-top:1px solid var(--bg3)">
                  <td style="padding:6px 8px">{{ row.n }}</td>
                  <td style="padding:6px 8px;text-align:right">${{ fmt(row.payment) }}</td>
                  <td style="padding:6px 8px;text-align:right;color:var(--accent2)">${{ fmt(row.principalPaid) }}</td>
                  <td style="padding:6px 8px;text-align:right;color:var(--red)">${{ fmt(row.interestPaid) }}</td>
                  <td style="padding:6px 8px;text-align:right">${{ fmt(row.balance) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const principal = ref(200000)
const rate      = ref(5.5)
const years     = ref(30)

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const monthly = computed(() => {
  const r = rate.value / 100 / 12
  const n = years.value * 12
  if (r === 0) return principal.value / n
  return principal.value * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
})

const totalPayment  = computed(() => monthly.value * years.value * 12)
const totalInterest = computed(() => totalPayment.value - principal.value)
const interestPct   = computed(() => (totalInterest.value / totalPayment.value * 100).toFixed(1))

const schedule = computed(() => {
  const r = rate.value / 100 / 12
  const n = years.value * 12
  const rows = []
  let balance = principal.value
  for (let i = 1; i <= Math.min(n, 360); i++) {
    const interest = balance * r
    const princ    = monthly.value - interest
    balance -= princ
    rows.push({ n: i, payment: monthly.value, principalPaid: princ, interestPaid: interest, balance: Math.max(0, balance) })
  }
  return rows
})
</script>
