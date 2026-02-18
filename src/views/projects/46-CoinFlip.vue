<template>
  <ProjectLayout title="Coin Flip">
    <div class="card" style="text-align:center">
      <!-- Coin -->
      <div
        @click="flip"
        :class="{ flipping }"
        style="width:140px;height:140px;border-radius:50%;margin:0 auto 24px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:4rem;user-select:none;transition:box-shadow 0.15s"
        :style="{
          background: side === 'heads' ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : 'linear-gradient(135deg,#94a3b8,#cbd5e1)',
          boxShadow: '0 8px 32px ' + (side === 'heads' ? 'rgba(245,158,11,0.4)' : 'rgba(148,163,184,0.4)'),
        }"
      >{{ side === 'heads' ? '🦅' : '🪙' }}</div>

      <h2 style="font-size:1.8rem;font-weight:800;text-transform:capitalize;margin-bottom:8px">
        {{ flipping ? '…' : side }}
      </h2>
      <p style="color:var(--text2);margin-bottom:20px">{{ flipping ? 'Flipping…' : 'Click the coin or press Flip' }}</p>

      <button class="btn btn-primary" :disabled="flipping" @click="flip">🪙 Flip</button>

      <div v-if="total > 0" class="mt">
        <div class="divider" />
        <div class="stat-grid" style="max-width:300px;margin:0 auto">
          <div class="stat-box">
            <div class="val" style="color:var(--yellow)">{{ headsCount }}</div>
            <div class="lbl">Heads</div>
          </div>
          <div class="stat-box">
            <div class="val" style="color:var(--text2)">{{ tailsCount }}</div>
            <div class="lbl">Tails</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ total }}</div>
            <div class="lbl">Total</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ headsPercent }}%</div>
            <div class="lbl">Heads %</div>
          </div>
        </div>

        <div class="progress-bar mt2" style="max-width:300px;margin:0 auto">
          <div class="progress-fill" :style="{ width: headsPercent + '%', background:'var(--yellow)' }" />
        </div>
        <div style="color:var(--text2);font-size:0.8rem;margin-top:4px">Heads ratio</div>

        <div class="mt2" style="font-size:0.85rem;color:var(--text2)">
          Last 10: <span style="font-family:monospace;letter-spacing:2px">
            {{ history.slice(-10).map(h => h === 'heads' ? 'H' : 'T').join(' ') }}
          </span>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const side     = ref<'heads'|'tails'>('heads')
const flipping = ref(false)
const history  = ref<string[]>([])

const total        = computed(() => history.value.length)
const headsCount   = computed(() => history.value.filter(h => h === 'heads').length)
const tailsCount   = computed(() => total.value - headsCount.value)
const headsPercent = computed(() => total.value ? Math.round(headsCount.value / total.value * 100) : 0)

function flip() {
  if (flipping.value) return
  flipping.value = true
  setTimeout(() => {
    side.value = Math.random() < 0.5 ? 'heads' : 'tails'
    history.value.push(side.value)
    flipping.value = false
  }, 600)
}
</script>

<style>
.flipping { animation: coinflip 0.6s ease; }
@keyframes coinflip {
  0%   { transform: rotateY(0deg) scale(1); }
  50%  { transform: rotateY(90deg) scale(1.1); }
  100% { transform: rotateY(0deg) scale(1); }
}
</style>
