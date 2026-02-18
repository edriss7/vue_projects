<template>
  <ProjectLayout title="Snake Game">
    <div class="card" style="text-align:center">
      <div class="row" style="justify-content:center;gap:24px;margin-bottom:12px">
        <div>
          <div style="font-size:2rem;font-weight:800;color:var(--green)">{{ score }}</div>
          <div style="font-size:0.78rem;color:var(--text2)">Score</div>
        </div>
        <div>
          <div style="font-size:2rem;font-weight:800;color:var(--accent)">{{ best }}</div>
          <div style="font-size:0.78rem;color:var(--text2)">Best</div>
        </div>
        <div>
          <div style="font-size:2rem;font-weight:800;color:var(--yellow)">{{ level }}</div>
          <div style="font-size:0.78rem;color:var(--text2)">Level</div>
        </div>
      </div>

      <canvas ref="canvas" :width="COLS*CELL" :height="ROWS*CELL"
        style="border-radius:8px;border:2px solid var(--bg3);display:block;margin:0 auto" />

      <div v-if="!running && !dead" class="mt">
        <button class="btn btn-primary" style="font-size:1.05rem;padding:12px 32px" @click="start">▶ Start</button>
      </div>
      <div v-if="dead" class="mt">
        <div class="msg msg-error" style="margin-bottom:8px">Game Over! Score: {{ score }}</div>
        <button class="btn btn-primary" @click="start">▶ Play Again</button>
      </div>

      <div style="margin-top:10px;font-size:0.78rem;color:var(--text2)">Arrow keys or WASD to move</div>

      <!-- Mobile controls -->
      <div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,44px);gap:4px;justify-content:center;margin-top:12px">
        <div /><button class="btn btn-secondary btn-sm" @click="changeDir(0,-1)">↑</button><div />
        <button class="btn btn-secondary btn-sm" @click="changeDir(-1,0)">←</button>
        <div />
        <button class="btn btn-secondary btn-sm" @click="changeDir(1,0)">→</button>
        <div /><button class="btn btn-secondary btn-sm" @click="changeDir(0,1)">↓</button><div />
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const COLS = 20, ROWS = 20, CELL = 20

const canvas  = ref<HTMLCanvasElement | null>(null)
const score   = ref(0)
const best    = ref(0)
const level   = ref(1)
const running = ref(false)
const dead    = ref(false)

type Dir = [number, number]
let snake: [number,number][] = []
let dir: Dir = [1, 0]
let nextDir: Dir = [1, 0]
let food: [number,number] = [0,0]
let tid: ReturnType<typeof setInterval> | null = null

function rndFood() {
  const set = new Set(snake.map(([x,y]) => `${x},${y}`))
  let fx: number, fy: number
  do { fx = Math.floor(Math.random()*COLS); fy = Math.floor(Math.random()*ROWS) }
  while (set.has(`${fx},${fy}`))
  food = [fx, fy]
}

function start() {
  if (tid) clearInterval(tid)
  snake = [[10,10],[9,10],[8,10]]
  dir = [1,0]; nextDir = [1,0]
  score.value = 0; level.value = 1; dead.value = false; running.value = true
  rndFood()
  draw()
  tid = setInterval(tick, 150)
}

function tick() {
  dir = nextDir
  const [hx, hy] = snake[0]
  const nx = (hx + dir[0] + COLS) % COLS
  const ny = (hy + dir[1] + ROWS) % ROWS

  if (snake.some(([sx,sy]) => sx === nx && sy === ny)) {
    dead.value = true; running.value = false
    if (score.value > best.value) best.value = score.value
    clearInterval(tid!); draw(); return
  }

  snake.unshift([nx, ny])
  if (nx === food[0] && ny === food[1]) {
    score.value++
    level.value = Math.floor(score.value / 5) + 1
    rndFood()
    clearInterval(tid!)
    tid = setInterval(tick, Math.max(60, 150 - (level.value - 1) * 10))
  } else {
    snake.pop()
  }
  draw()
}

function draw() {
  const c = canvas.value; if (!c) return
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, COLS*CELL, ROWS*CELL)

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,ROWS*CELL); ctx.stroke() }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(COLS*CELL,y*CELL); ctx.stroke() }

  // Food
  ctx.fillStyle = '#ef4444'
  ctx.beginPath(); ctx.arc(food[0]*CELL+CELL/2, food[1]*CELL+CELL/2, CELL/2-2, 0, Math.PI*2); ctx.fill()

  // Snake
  snake.forEach(([x,y], i) => {
    const t = 1 - i / snake.length
    ctx.fillStyle = `rgba(${34 + 80*t}, ${197 - 50*t}, ${94 + 30*t}, 1)`
    ctx.beginPath()
    ctx.roundRect(x*CELL+1, y*CELL+1, CELL-2, CELL-2, 4)
    ctx.fill()
  })
}

function changeDir(dx: number, dy: number) {
  if (dx !== 0 && dir[0] !== 0) return
  if (dy !== 0 && dir[1] !== 0) return
  nextDir = [dx, dy]
}

function onKey(e: KeyboardEvent) {
  const map: Record<string, Dir> = {
    ArrowLeft:['left' as any,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1],
    a:[-1,0], d:[1,0], w:[0,-1], s:[0,1],
  }
  const entries: Record<string, Dir> = {
    ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1],
    a:[-1,0], d:[1,0], w:[0,-1], s:[0,1],
  }
  const d = entries[e.key]
  if (d) { e.preventDefault(); changeDir(d[0], d[1]) }
}

onMounted(() => { window.addEventListener('keydown', onKey); draw() })
onUnmounted(() => { window.removeEventListener('keydown', onKey); if (tid) clearInterval(tid) })
</script>
