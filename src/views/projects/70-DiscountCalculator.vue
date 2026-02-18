<template>
  <ProjectLayout title="Discount Calculator">
    <div class="card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="label">Original Price ($)</label>
          <input v-model.number="original" type="number" min="0" step="0.01" class="input" />
        </div>
        <div>
          <label class="label">Discount (%)</label>
          <input v-model.number="discountPct" type="number" min="0" max="100" step="1" class="input" />
        </div>
        <div>
          <label class="label">Tax Rate (%)</label>
          <input v-model.number="taxPct" type="number" min="0" max="50" step="0.5" class="input" />
        </div>
        <div>
          <label class="label">Quantity</label>
          <input v-model.number="qty" type="number" min="1" step="1" class="input" />
        </div>
      </div>

      <div class="stat-grid mt">
        <div class="stat-box">
          <div class="val" style="color:var(--red)">-${{ fmt(savings) }}</div>
          <div class="lbl">You Save</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--accent)">${{ fmt(discounted) }}</div>
          <div class="lbl">After Discount</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--text2)">${{ fmt(taxAmount) }}</div>
          <div class="lbl">Tax</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--green)">${{ fmt(total) }}</div>
          <div class="lbl">Total (×{{ qty }})</div>
        </div>
      </div>

      <div class="divider" />

      <!-- Break-even / multiple discount calculator -->
      <label class="label">Multi-discount breakdown</label>
      <div style="display:flex;flex-direction:column;gap:4px;font-size:0.85rem">
        <div v-for="d in [5,10,15,20,25,30,40,50,60,70,80]" :key="d"
          style="display:flex;justify-content:space-between;padding:6px 10px;background:var(--bg3);border-radius:6px"
          :style="d === discountPct ? { borderLeft: '3px solid var(--accent)', paddingLeft: '7px' } : {}">
          <span>{{ d }}% off</span>
          <span style="color:var(--accent)">${{ fmt(original * (1 - d/100)) }}</span>
          <span style="color:var(--red)">save ${{ fmt(original * d/100) }}</span>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const original    = ref(99.99)
const discountPct = ref(20)
const taxPct      = ref(8.5)
const qty         = ref(1)

const savings    = computed(() => original.value * (discountPct.value / 100))
const discounted = computed(() => original.value - savings.value)
const taxAmount  = computed(() => discounted.value * (taxPct.value / 100) * qty.value)
const total      = computed(() => discounted.value * qty.value + taxAmount.value)

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>
