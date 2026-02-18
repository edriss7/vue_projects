<template>
  <ProjectLayout title="Rock Paper Scissors">
    <div class="card" style="text-align:center">
      <h3 style="margin-bottom:20px;color:var(--text2)">Choose your move</h3>

      <div class="row" style="justify-content:center;gap:16px;margin-bottom:24px">
        <button
          v-for="m in moves"
          :key="m.key"
          @click="play(m.key)"
          :disabled="!!result"
          style="width:90px;height:90px;border-radius:16px;border:3px solid var(--bg3);background:var(--bg2);font-size:3rem;cursor:pointer;transition:all 0.2s"
          :style="{ borderColor: playerMove === m.key ? 'var(--accent)' : 'var(--bg3)', transform: playerMove === m.key ? 'scale(1.1)' : 'scale(1)' }"
        >{{ m.emoji }}</button>
      </div>

      <div v-if="result" style="margin-bottom:20px">
        <div class="row" style="justify-content:center;gap:40px;margin-bottom:12px">
          <div>
            <div style="color:var(--text2);font-size:0.85rem;margin-bottom:4px">You</div>
            <div style="font-size:3.5rem">{{ moves.find(m=>m.key===playerMove)?.emoji }}</div>
          </div>
          <div style="align-self:center;font-size:1.5rem;color:var(--text2)">VS</div>
          <div>
            <div style="color:var(--text2);font-size:0.85rem;margin-bottom:4px">Computer</div>
            <div style="font-size:3.5rem">{{ moves.find(m=>m.key===cpuMove)?.emoji }}</div>
          </div>
        </div>
        <div style="font-size:1.5rem;font-weight:800;margin-bottom:16px" :style="{ color: resultColor }">
          {{ result }}
        </div>
        <button class="btn btn-primary" @click="reset">Play Again</button>
      </div>

      <div class="stat-grid" style="max-width:300px;margin:0 auto">
        <div class="stat-box"><div class="val" style="color:var(--green)">{{ scores.win }}</div><div class="lbl">Wins</div></div>
        <div class="stat-box"><div class="val" style="color:var(--red)">{{ scores.loss }}</div><div class="lbl">Losses</div></div>
        <div class="stat-box"><div class="val" style="color:var(--text2)">{{ scores.draw }}</div><div class="lbl">Draws</div></div>
      </div>
      <button class="btn btn-secondary btn-sm mt" @click="resetScores">Reset Scores</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type Move = 'rock'|'paper'|'scissors'
const moves = [
  { key:'rock'     as Move, emoji:'🪨' },
  { key:'paper'    as Move, emoji:'📄' },
  { key:'scissors' as Move, emoji:'✂️'  },
]

const playerMove = ref<Move|null>(null)
const cpuMove    = ref<Move|null>(null)
const result     = ref('')
const scores     = ref({ win: 0, loss: 0, draw: 0 })

const resultColor = computed(() => result.value === '🎉 You Win!' ? 'var(--green)' : result.value === '😢 You Lose' ? 'var(--red)' : 'var(--text2)')

const BEATS: Record<Move, Move> = { rock:'scissors', scissors:'paper', paper:'rock' }

function play(m: Move) {
  playerMove.value = m
  cpuMove.value    = moves[Math.floor(Math.random() * 3)].key
  if (playerMove.value === cpuMove.value) { result.value = "🤝 It's a Draw!"; scores.value.draw++ }
  else if (BEATS[playerMove.value] === cpuMove.value) { result.value = '🎉 You Win!'; scores.value.win++ }
  else { result.value = '😢 You Lose'; scores.value.loss++ }
}

function reset() { playerMove.value = null; cpuMove.value = null; result.value = '' }
function resetScores() { scores.value = { win:0, loss:0, draw:0 }; reset() }
</script>
