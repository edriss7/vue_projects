<template>
  <ProjectLayout title="Minesweeper">
    <div class="card" style="text-align:center">
      <!-- Config -->
      <div class="row" style="justify-content:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button v-for="d in diffs" :key="d.label" class="btn btn-sm"
          :class="cfg === d ? 'btn-primary' : 'btn-secondary'"
          @click="cfg = d; init()">{{ d.label }}</button>
      </div>

      <div class="row" style="justify-content:center;gap:24px;margin-bottom:12px">
        <div><span style="font-size:1.4rem">💣</span> {{ minesLeft }}</div>
        <button class="btn btn-secondary btn-sm" @click="init">{{ status === 'lost' ? '😵' : status === 'won' ? '😎' : '🙂' }} New</button>
        <div><span style="font-size:1.4rem">⏱</span> {{ elapsed }}s</div>
      </div>

      <div v-if="status === 'won'" class="msg msg-success" style="margin-bottom:8px">You win! 🎉</div>
      <div v-if="status === 'lost'" class="msg msg-error" style="margin-bottom:8px">Boom! 💥 Try again.</div>

      <div style="display:inline-block;border:2px solid var(--bg3);border-radius:8px;overflow:hidden"
        @contextmenu.prevent>
        <div v-for="(row, r) in board" :key="r" style="display:flex">
          <div v-for="(cell, c) in row" :key="c"
            @click="reveal(r,c)"
            @contextmenu.prevent="flag(r,c)"
            :style="{
              width: cellSize+'px', height: cellSize+'px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: cellSize*0.45+'px', fontWeight:'700', cursor:'pointer',
              background: cell.open ? (cell.mine && status==='lost' ? '#ef444444' : 'var(--bg)') : (cell.flagged ? 'var(--bg3)' : 'var(--bg3)'),
              borderRight: '1px solid var(--bg2)', borderBottom: '1px solid var(--bg2)',
              color: numColor(cell.count),
              userSelect: 'none',
            }"
          >
            <span v-if="cell.open && cell.mine">💣</span>
            <span v-else-if="!cell.open && cell.flagged">🚩</span>
            <span v-else-if="cell.open && cell.count > 0">{{ cell.count }}</span>
          </div>
        </div>
      </div>

      <div style="font-size:0.78rem;color:var(--text2);margin-top:8px">Left click: reveal · Right click: flag</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Cell { mine: boolean; open: boolean; flagged: boolean; count: number }

const diffs = [
  { label: '😊 Easy',   rows: 9,  cols: 9,  mines: 10, size: 34 },
  { label: '🤔 Medium', rows: 16, cols: 16, mines: 40, size: 28 },
]
const cfg    = ref(diffs[0])
const board  = ref<Cell[][]>([])
const status = ref<'idle'|'playing'|'won'|'lost'>('idle')
const elapsed= ref(0)
const cellSize = computed(() => cfg.value.size)

let timer: ReturnType<typeof setInterval> | null = null
let firstClick = true

const minesLeft = computed(() => {
  let flags = 0
  board.value.forEach(r => r.forEach(c => { if (c.flagged) flags++ }))
  return cfg.value.mines - flags
})

function init() {
  clearInterval(timer!); elapsed.value = 0; firstClick = true; status.value = 'idle'
  const { rows, cols } = cfg.value
  board.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, open: false, flagged: false, count: 0 }))
  )
}

function plantMines(sr: number, sc: number) {
  const { rows, cols, mines } = cfg.value
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!board.value[r][c].mine && !(r === sr && c === sc)) {
      board.value[r][c].mine = true; placed++
    }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!board.value[r][c].mine)
        board.value[r][c].count = neighbors(r, c).filter(([nr,nc]) => board.value[nr][nc].mine).length
}

function neighbors(r: number, c: number) {
  const { rows, cols } = cfg.value
  const res: [number,number][] = []
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r+dr, nc = c+dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) res.push([nr,nc])
    }
  return res
}

function flood(r: number, c: number) {
  const cell = board.value[r][c]
  if (cell.open || cell.flagged || cell.mine) return
  cell.open = true
  if (cell.count === 0) neighbors(r,c).forEach(([nr,nc]) => flood(nr,nc))
}

function reveal(r: number, c: number) {
  if (status.value === 'won' || status.value === 'lost') return
  const cell = board.value[r][c]
  if (cell.open || cell.flagged) return
  if (firstClick) {
    firstClick = false
    plantMines(r, c)
    timer = setInterval(() => elapsed.value++, 1000)
    status.value = 'playing'
  }
  if (cell.mine) {
    cell.open = true; clearInterval(timer!); status.value = 'lost'
    board.value.forEach(row => row.forEach(cl => { if (cl.mine) cl.open = true }))
    return
  }
  flood(r, c)
  checkWin()
}

function flag(r: number, c: number) {
  if (status.value === 'won' || status.value === 'lost') return
  const cell = board.value[r][c]
  if (!cell.open) cell.flagged = !cell.flagged
}

function checkWin() {
  const { rows, cols, mines } = cfg.value
  let opened = 0
  board.value.forEach(row => row.forEach(c => { if (c.open) opened++ }))
  if (opened === rows * cols - mines) {
    status.value = 'won'; clearInterval(timer!)
  }
}

const colors = ['','#3b82f6','#22c55e','#ef4444','#7c3aed','#b91c1c','#0891b2','#000','#6b7280']
function numColor(n: number) { return colors[n] || 'var(--text)' }

init()
onUnmounted(() => clearInterval(timer!))
</script>
