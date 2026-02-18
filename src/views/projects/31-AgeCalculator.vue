<template>
  <ProjectLayout title="Age Calculator">
    <div class="card">
      <div class="col" style="gap:12px">
        <div>
          <label class="label">Date of Birth</label>
          <input v-model="dob" type="date" class="input" :max="today" />
        </div>
        <button class="btn btn-primary" style="align-self:flex-start" @click="calculate">Calculate Age</button>
      </div>

      <div v-if="result" class="mt">
        <div class="stat-grid">
          <div class="stat-box">
            <div class="val" style="color:var(--accent2)">{{ result.years }}</div>
            <div class="lbl">Years</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ result.months }}</div>
            <div class="lbl">Months</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ result.days }}</div>
            <div class="lbl">Days</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ result.totalDays.toLocaleString() }}</div>
            <div class="lbl">Total Days</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ result.totalHours.toLocaleString() }}</div>
            <div class="lbl">Total Hours</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ result.totalMinutes.toLocaleString() }}</div>
            <div class="lbl">Total Minutes</div>
          </div>
        </div>

        <div class="result-box mt" style="text-align:center">
          <div style="color:var(--text2);font-size:0.85rem;margin-bottom:4px">Next Birthday</div>
          <div style="font-size:1.3rem;font-weight:700">{{ result.nextBirthday }}</div>
          <div style="color:var(--text2);font-size:0.9rem;margin-top:4px">{{ result.daysUntil }} days away</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const today = new Date().toISOString().split('T')[0]
const dob   = ref('1990-06-15')

interface Result {
  years: number; months: number; days: number
  totalDays: number; totalHours: number; totalMinutes: number
  nextBirthday: string; daysUntil: number
}
const result = ref<Result | null>(null)

function calculate() {
  const birth = new Date(dob.value)
  const now   = new Date()
  if (birth >= now) return

  let y = now.getFullYear() - birth.getFullYear()
  let m = now.getMonth()    - birth.getMonth()
  let d = now.getDate()     - birth.getDate()
  if (d < 0)  { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (m < 0)  { y--; m += 12 }

  const totalDays    = Math.floor((now.getTime() - birth.getTime()) / 86400000)
  const totalHours   = totalDays * 24
  const totalMinutes = totalHours * 60

  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (next <= now) next.setFullYear(now.getFullYear() + 1)
  const daysUntil = Math.ceil((next.getTime() - now.getTime()) / 86400000)

  result.value = {
    years: y, months: m, days: d,
    totalDays, totalHours, totalMinutes,
    nextBirthday: next.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    daysUntil,
  }
}
calculate()
</script>
