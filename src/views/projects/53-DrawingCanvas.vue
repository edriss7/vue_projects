<template>
  <ProjectLayout title="Drawing Canvas">
    <div class="card">
      <!-- Toolbar -->
      <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
        <div class="row" style="gap:4px">
          <button v-for="t in tools" :key="t.key"
            class="btn btn-sm" :class="tool === t.key ? 'btn-primary' : 'btn-secondary'"
            @click="tool = t.key; if(t.key==='eraser') color='#0f172a'">{{ t.icon }}</button>
        </div>

        <input type="color" v-model="color" style="width:36px;height:32px;border:none;border-radius:6px;cursor:pointer;background:transparent;padding:0" />

        <div class="row" style="gap:6px;align-items:center">
          <span style="font-size:0.8rem;color:var(--text2)">Size:</span>
          <input v-model.number="brushSize" type="range" min="2" max="40" style="width:80px;accent-color:var(--accent)" />
          <span style="font-size:0.8rem;width:20px">{{ brushSize }}</span>
        </div>

        <div class="row" style="gap:4px">
          <button v-for="c in palette" :key="c"
            @click="color = c; tool = 'pen'"
            style="width:24px;height:24px;border-radius:4px;border:2px solid transparent;cursor:pointer;transition:transform 0.1s"
            :style="{ background: c, borderColor: color === c ? '#fff' : 'transparent' }"
          />
        </div>

        <button class="btn btn-sm btn-danger" @click="clear">Clear</button>
        <button class="btn btn-sm btn-secondary" @click="download">⬇ Save</button>
      </div>

      <!-- Canvas -->
      <canvas
        ref="canvasEl"
        width="680" height="400"
        style="width:100%;border-radius:8px;background:#fff;cursor:crosshair;touch-action:none"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart.prevent="startDrawTouch"
        @touchmove.prevent="drawTouch"
        @touchend="endDraw"
      />
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const canvasEl  = ref<HTMLCanvasElement | null>(null)
const tool      = ref('pen')
const color     = ref('#6366f1')
const brushSize = ref(6)
const painting  = ref(false)

const tools = [
  { key: 'pen', icon: '✏️' }, { key: 'eraser', icon: '◻' },
]

const palette = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#6366f1','#a855f7','#ec4899','#000000','#ffffff']

function getCtx() { return canvasEl.value?.getContext('2d') ?? null }

function pos(e: MouseEvent) {
  const r = canvasEl.value!.getBoundingClientRect()
  const scaleX = canvasEl.value!.width  / r.width
  const scaleY = canvasEl.value!.height / r.height
  return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY }
}

function posTouch(e: TouchEvent) {
  const t = e.touches[0]
  const r = canvasEl.value!.getBoundingClientRect()
  const scaleX = canvasEl.value!.width  / r.width
  const scaleY = canvasEl.value!.height / r.height
  return { x: (t.clientX - r.left) * scaleX, y: (t.clientY - r.top) * scaleY }
}

function startDraw(e: MouseEvent) {
  painting.value = true
  const ctx = getCtx(); if (!ctx) return
  const { x, y } = pos(e)
  ctx.beginPath(); ctx.moveTo(x, y)
}

function draw(e: MouseEvent) {
  if (!painting.value) return
  const ctx = getCtx(); if (!ctx) return
  const { x, y } = pos(e)
  ctx.lineWidth   = brushSize.value
  ctx.lineCap     = 'round'
  ctx.strokeStyle = tool.value === 'eraser' ? '#ffffff' : color.value
  ctx.lineTo(x, y); ctx.stroke(); ctx.moveTo(x, y)
}

function startDrawTouch(e: TouchEvent) { painting.value = true; const { x, y } = posTouch(e); const ctx = getCtx(); ctx?.beginPath(); ctx?.moveTo(x, y) }
function drawTouch(e: TouchEvent) { if (!painting.value) return; const { x, y } = posTouch(e); const ctx = getCtx(); if (!ctx) return; ctx.lineWidth = brushSize.value; ctx.lineCap = 'round'; ctx.strokeStyle = tool.value === 'eraser' ? '#ffffff' : color.value; ctx.lineTo(x, y); ctx.stroke(); ctx.moveTo(x, y) }
function endDraw() { painting.value = false }

function clear() {
  const ctx = getCtx(); if (!ctx || !canvasEl.value) return
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasEl.value.width, canvasEl.value.height)
}

function download() {
  const a = document.createElement('a')
  a.href = canvasEl.value!.toDataURL('image/png')
  a.download = 'drawing.png'; a.click()
}

onMounted(clear)
</script>
