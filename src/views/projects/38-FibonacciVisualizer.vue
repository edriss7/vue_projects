<template>
  <ProjectLayout title="Fibonacci Visualizer">
    <div class="card">
      <div class="row" style="gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
        <div>
          <label class="label">Terms</label>
          <input v-model.number="n" type="number" min="2" max="20" class="input" style="width:80px" />
        </div>
        <button class="btn btn-primary" @click="animate">▶ Animate</button>
        <button class="btn btn-secondary" @click="reset">↺ Reset</button>
        <span style="color:var(--text2);font-size:0.85rem">Showing {{ visible.length }} of {{ n }} terms</span>
      </div>

      <!-- Number sequence -->
      <div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:20px">
        <div
          v-for="(num, i) in visible"
          :key="i"
          class="stat-box"
          style="min-width:60px;animation:fadein 0.3s ease"
        >
          <div class="val" style="font-size:1rem;color:var(--accent2)">{{ num }}</div>
          <div class="lbl">F{{ i }}</div>
        </div>
      </div>

      <!-- Bar chart -->
      <label class="label">Relative scale</label>
      <div style="display:flex;flex-direction:column;gap:4px">
        <div v-for="(num, i) in visible" :key="i" class="row" style="gap:8px;align-items:center">
          <span style="width:28px;font-size:0.78rem;color:var(--text2);text-align:right">F{{ i }}</span>
          <div style="flex:1;height:22px;background:var(--bg3);border-radius:4px;overflow:hidden">
            <div
              style="height:100%;background:var(--accent);border-radius:4px;transition:width 0.4s"
              :style="{ width: maxVal > 0 ? (num / maxVal * 100) + '%' : '0%' }"
            />
          </div>
          <span style="width:80px;font-size:0.82rem;text-align:right;font-variant-numeric:tabular-nums">{{ num.toLocaleString() }}</span>
        </div>
      </div>

      <div class="divider" />
      <label class="label">Golden Ratio convergence</label>
      <div class="row" style="flex-wrap:wrap;gap:8px">
        <div v-for="(ratio, i) in ratios" :key="i" class="stat-box" style="min-width:80px">
          <div class="val" style="font-size:0.9rem">{{ ratio }}</div>
          <div class="lbl">F{{ i+1 }}/F{{ i }}</div>
        </div>
      </div>
      <div style="color:var(--text2);font-size:0.82rem;margin-top:8px">φ = 1.6180339887…</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const n       = ref(12)
const visible = ref<number[]>([])
let animTimer: ReturnType<typeof setInterval> | null = null

function fib(count: number) {
  const seq = [0, 1]
  for (let i = 2; i < count; i++) seq.push(seq[i-1] + seq[i-2])
  return seq.slice(0, count)
}

const allSeq = computed(() => fib(n.value))
const maxVal = computed(() => Math.max(...visible.value, 1))
const ratios = computed(() =>
  visible.value.slice(1).map((v, i) =>
    visible.value[i] > 0 ? (v / visible.value[i]).toFixed(6) : '—'
  ).slice(-8)
)

function animate() {
  if (animTimer) clearInterval(animTimer)
  visible.value = []
  let idx = 0
  animTimer = setInterval(() => {
    if (idx >= allSeq.value.length) { clearInterval(animTimer!); return }
    visible.value.push(allSeq.value[idx++])
  }, 250)
}

function reset() {
  if (animTimer) clearInterval(animTimer)
  visible.value = allSeq.value
}

reset()
</script>

<style>
@keyframes fadein { from { opacity:0; transform:scale(0.8) } to { opacity:1; transform:scale(1) } }
</style>
