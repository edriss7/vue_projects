<template>
  <ProjectLayout title="Tic-Tac-Toe">
    <div class="card" style="max-width:400px;margin:0 auto;text-align:center">
      <div class="row" style="justify-content:center;gap:8px;margin-bottom:16px">
        <button class="btn btn-sm" :class="mode==='pvp' ? 'btn-primary' : 'btn-secondary'" @click="mode='pvp';reset()">👤 vs 👤</button>
        <button class="btn btn-sm" :class="mode==='ai'  ? 'btn-primary' : 'btn-secondary'" @click="mode='ai';reset()">👤 vs 🤖</button>
      </div>

      <div style="font-weight:700;margin-bottom:16px;min-height:24px;font-size:1.05rem">
        {{ status }}
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:240px;margin:0 auto">
        <button
          v-for="(cell, i) in board"
          :key="i"
          @click="play(i)"
          :disabled="!!cell || !!winner || (mode === 'ai' && current === 'O')"
          style="aspect-ratio:1;font-size:2.5rem;border-radius:12px;border:none;cursor:pointer;transition:all 0.15s;font-weight:800"
          :style="{
            background: winLine.includes(i) ? 'rgba(99,102,241,0.25)' : 'var(--bg3)',
            color: cell === 'X' ? 'var(--accent2)' : 'var(--red)',
            border: winLine.includes(i) ? '2px solid var(--accent)' : '2px solid transparent',
          }"
        >{{ cell }}</button>
      </div>

      <div class="stat-grid" style="max-width:240px;margin:16px auto 0">
        <div class="stat-box">
          <div class="val" style="color:var(--accent2)">{{ scores.X }}</div>
          <div class="lbl">X Wins</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--text2)">{{ scores.draw }}</div>
          <div class="lbl">Draws</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--red)">{{ scores.O }}</div>
          <div class="lbl">O Wins</div>
        </div>
      </div>

      <button class="btn btn-secondary btn-sm mt" @click="reset">New Game</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type Cell = 'X' | 'O' | ''
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

const board   = ref<Cell[]>(Array(9).fill(''))
const current = ref<'X'|'O'>('X')
const winner  = ref<'X'|'O'|'draw'|null>(null)
const winLine = ref<number[]>([])
const mode    = ref<'pvp'|'ai'>('ai')
const scores  = ref({ X: 0, O: 0, draw: 0 })

const status = computed(() => {
  if (winner.value === 'draw') return "It's a draw!"
  if (winner.value)            return `${winner.value} wins! 🎉`
  return mode.value === 'ai' && current.value === 'O'
    ? '🤖 AI is thinking…'
    : `${current.value}'s turn`
})

function checkWin(b: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of LINES) {
    const [a, c, d] = line
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a] as Cell, line }
  }
  return null
}

function play(i: number) {
  if (board.value[i] || winner.value) return
  board.value[i] = current.value
  const w = checkWin(board.value)
  if (w) { const ww = w.winner as 'X'|'O'; winner.value = ww; winLine.value = w.line; scores.value[ww]++; return }
  if (board.value.every(c => c)) { winner.value = 'draw'; scores.value.draw++; return }
  current.value = current.value === 'X' ? 'O' : 'X'
  if (mode.value === 'ai' && current.value === 'O') setTimeout(aiMove, 400)
}

function minimax(b: Cell[], isMax: boolean): number {
  const w = checkWin(b)
  if (w?.winner === 'O') return 10
  if (w?.winner === 'X') return -10
  if (b.every(c => c))  return 0
  const scores = b.map((c, i) => {
    if (c) return isMax ? -Infinity : Infinity
    const nb = [...b]; nb[i] = isMax ? 'O' : 'X'
    return minimax(nb, !isMax)
  })
  return isMax ? Math.max(...scores) : Math.min(...scores)
}

function aiMove() {
  let best = -Infinity, idx = -1
  board.value.forEach((c, i) => {
    if (c) return
    const nb = [...board.value]; nb[i] = 'O'
    const score = minimax(nb, false)
    if (score > best) { best = score; idx = i }
  })
  if (idx !== -1) play(idx)
}

function reset() {
  board.value   = Array(9).fill('')
  current.value = 'X'
  winner.value  = null
  winLine.value = []
}
</script>
