<template>
  <ProjectLayout title="Tip Calculator">
    <div class="card">
      <div class="col" style="gap:14px">
        <div>
          <label class="label">Bill Amount ($)</label>
          <input v-model.number="bill" type="number" min="0" class="input" placeholder="0.00" />
        </div>

        <div>
          <label class="label">Tip Percentage — {{ tip }}%</label>
          <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:8px">
            <button v-for="p in [10,15,18,20,25]" :key="p"
              class="btn btn-sm" :class="tip === p ? 'btn-primary' : 'btn-secondary'"
              @click="tip = p">{{ p }}%</button>
          </div>
          <input v-model.number="tip" type="range" min="0" max="50" class="input" style="padding:4px 0;background:transparent;border:none" />
        </div>

        <div>
          <label class="label">Split Between</label>
          <div class="row" style="gap:8px;align-items:center">
            <button class="qty-btn" @click="people = Math.max(1, people - 1)">−</button>
            <strong style="font-size:1.2rem;width:24px;text-align:center">{{ people }}</strong>
            <button class="qty-btn" @click="people++">+</button>
            <span style="color:var(--text2);font-size:0.9rem">people</span>
          </div>
        </div>
      </div>

      <div class="divider" />

      <div class="stat-grid">
        <div class="stat-box">
          <div class="val" style="color:var(--accent2)">${{ tipAmount }}</div>
          <div class="lbl">Tip Total</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--green)">${{ total }}</div>
          <div class="lbl">Bill + Tip</div>
        </div>
        <div class="stat-box">
          <div class="val">${{ tipPerPerson }}</div>
          <div class="lbl">Tip / Person</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--yellow)">${{ totalPerPerson }}</div>
          <div class="lbl">Total / Person</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const bill   = ref(85.50)
const tip    = ref(18)
const people = ref(3)

const fmt = (n: number) => n.toFixed(2)
const tipAmount     = computed(() => fmt(bill.value * tip.value / 100))
const total         = computed(() => fmt(bill.value * (1 + tip.value / 100)))
const tipPerPerson  = computed(() => fmt(parseFloat(tipAmount.value) / people.value))
const totalPerPerson= computed(() => fmt(parseFloat(total.value) / people.value))
</script>
