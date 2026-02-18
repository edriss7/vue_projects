<template>
  <ProjectLayout title="Dice Roller">
    <div class="card" style="text-align:center">
      <label class="label">Number of dice</label>
      <div class="row" style="justify-content:center;gap:8px;margin-bottom:20px">
        <button v-for="n in [1,2,3,4,5,6]" :key="n" class="btn btn-sm" :class="count === n ? 'btn-primary' : 'btn-secondary'" @click="count = n">{{ n }}</button>
      </div>

      <div class="row" style="justify-content:center;flex-wrap:wrap;gap:16px">
        <div
          v-for="(die, i) in dice"
          :key="i"
          class="dice"
          :class="{ rolling }"
        >{{ FACES[die - 1] }}</div>
      </div>

      <div v-if="dice.length" style="margin-top:12px">
        <span style="color:var(--text2)">Total: </span>
        <strong style="font-size:1.4rem;color:var(--accent2)">{{ total }}</strong>
      </div>

      <button class="btn btn-primary mt" @click="roll" :disabled="rolling">
        🎲 Roll {{ count === 1 ? 'Die' : 'Dice' }}
      </button>

      <div v-if="history.length" class="mt">
        <div class="divider" />
        <label class="label">Roll history (last 10)</label>
        <div class="col" style="gap:6px;align-items:center">
          <div
            v-for="(entry, i) in history"
            :key="i"
            class="row"
            style="gap:8px;color:var(--text2);font-size:0.9rem"
          >
            <span style="font-variant-numeric:tabular-nums;width:20px;text-align:right;color:var(--text2)">#{{ history.length - i }}</span>
            <span>{{ entry.faces.join(' ') }}</span>
            <span style="margin-left:4px;color:var(--accent2);font-weight:700">= {{ entry.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const FACES = ['⚀','⚁','⚂','⚃','⚄','⚅']

const count   = ref(2)
const dice    = ref<number[]>([])
const rolling = ref(false)
const history = ref<{ faces: string[]; total: number }[]>([])

const total = computed(() => dice.value.reduce((s, d) => s + d, 0))

function roll() {
  rolling.value = true
  // Animate for 500ms with random values
  let ticks = 0
  const anim = setInterval(() => {
    dice.value = Array.from({ length: count.value }, () => Math.ceil(Math.random() * 6))
    if (++ticks >= 8) {
      clearInterval(anim)
      rolling.value = false
      history.value.unshift({ faces: dice.value.map(d => FACES[d-1]), total: total.value })
      if (history.value.length > 10) history.value.pop()
    }
  }, 80)
}
</script>
