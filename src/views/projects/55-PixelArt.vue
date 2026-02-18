<template>
  <ProjectLayout title="Pixel Art Editor">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
        <input type="color" v-model="color" style="width:36px;height:32px;border:none;border-radius:6px;cursor:pointer;padding:0;background:transparent" />
        <div class="row" style="gap:4px;flex-wrap:wrap">
          <button v-for="c in palette" :key="c"
            @click="color = c"
            style="width:22px;height:22px;border-radius:3px;cursor:pointer;border:2px solid transparent;transition:transform 0.1s"
            :style="{ background:c, borderColor: color===c ? '#fff' : 'transparent' }"
          />
        </div>
        <button class="btn btn-sm btn-secondary" @click="tool='draw'" :class="tool==='draw'?'btn-primary':''">✏️</button>
        <button class="btn btn-sm btn-secondary" @click="tool='fill'" :class="tool==='fill'?'btn-primary':''">🪣</button>
        <button class="btn btn-sm btn-secondary" @click="tool='erase'" :class="tool==='erase'?'btn-primary':''">◻</button>
        <button class="btn btn-sm btn-danger" @click="clearGrid">Clear</button>
        <div>
          <label class="label" style="font-size:0.75rem">Grid: {{ gridSize }}×{{ gridSize }}</label>
          <input v-model.number="gridSize" type="range" min="8" max="32" step="4" style="width:80px;accent-color:var(--accent)" @input="initGrid" />
        </div>
      </div>

      <div
        style="display:grid;border:1px solid var(--bg3);border-radius:8px;overflow:hidden;user-select:none;touch-action:none"
        :style="{ gridTemplateColumns: `repeat(${gridSize},1fr)` }"
        @mouseleave="painting=false"
      >
        <div
          v-for="(cell, i) in grid"
          :key="i"
          :style="{
            aspectRatio:'1',
            background: cell || '#1e293b',
            outline: '0.5px solid rgba(255,255,255,0.05)',
            cursor: 'crosshair',
            transition: 'background 0.05s',
          }"
          @mousedown="startPaint(i)"
          @mouseenter="whilePainting(i)"
          @mouseup="painting=false"
        />
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const color    = ref('#6366f1')
const tool     = ref('draw')
const gridSize = ref(16)
const grid     = ref<string[]>(Array(gridSize.value * gridSize.value).fill(''))
const painting = ref(false)

const palette = [
  '#ef4444','#f97316','#eab308','#22c55e','#10b981','#06b6d4',
  '#3b82f6','#6366f1','#8b5cf6','#ec4899','#ffffff','#0f172a',
  '#334155','#94a3b8','#fbbf24','#f43f5e',
]

function initGrid() {
  grid.value = Array(gridSize.value * gridSize.value).fill('')
}

function paint(i: number) {
  if (tool.value === 'draw')  grid.value[i] = color.value
  if (tool.value === 'erase') grid.value[i] = ''
  if (tool.value === 'fill')  floodFill(i, grid.value[i], color.value)
}

function floodFill(i: number, target: string, fill: string) {
  if (target === fill || grid.value[i] !== target) return
  const queue = [i]
  while (queue.length) {
    const idx = queue.pop()!
    if (idx < 0 || idx >= grid.value.length || grid.value[idx] !== target) continue
    grid.value[idx] = fill
    const row = Math.floor(idx / gridSize.value)
    const col = idx % gridSize.value
    if (col > 0)                  queue.push(idx - 1)
    if (col < gridSize.value - 1) queue.push(idx + 1)
    if (row > 0)                  queue.push(idx - gridSize.value)
    if (row < gridSize.value - 1) queue.push(idx + gridSize.value)
  }
}

function startPaint(i: number) { painting.value = true; paint(i) }
function whilePainting(i: number) { if (painting.value && tool.value !== 'fill') paint(i) }
function clearGrid() { grid.value = Array(gridSize.value * gridSize.value).fill('') }
</script>
