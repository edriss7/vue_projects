<template>
  <ProjectLayout title="Gradient Generator">
    <div class="card">
      <div
        style="width:100%;height:160px;border-radius:12px;margin-bottom:20px;transition:background 0.15s"
        :style="{ background: css }"
      />

      <!-- Type & angle -->
      <div class="row" style="gap:10px;margin-bottom:16px;flex-wrap:wrap">
        <div>
          <label class="label">Type</label>
          <div class="row" style="gap:6px">
            <button v-for="t in ['linear','radial','conic']" :key="t"
              class="btn btn-sm" :class="type === t ? 'btn-primary' : 'btn-secondary'"
              @click="type = t as GType">{{ t }}</button>
          </div>
        </div>
        <div v-if="type === 'linear'" style="flex:1;min-width:160px">
          <label class="label">Angle — {{ angle }}°</label>
          <input v-model.number="angle" type="range" min="0" max="360" class="input" style="padding:4px 0;background:transparent;border:none" />
        </div>
      </div>

      <!-- Color stops -->
      <div>
        <label class="label">Color Stops</label>
        <div v-for="(stop, i) in stops" :key="i" class="row" style="gap:10px;margin-bottom:8px;align-items:center">
          <input type="color" v-model="stop.color" style="width:40px;height:36px;border:none;background:transparent;cursor:pointer;border-radius:6px;padding:0" />
          <span style="font-family:monospace;font-size:0.9rem;width:72px">{{ stop.color }}</span>
          <input v-model.number="stop.pos" type="range" min="0" max="100" class="input" style="flex:1;padding:4px 0;background:transparent;border:none" />
          <span style="width:36px;font-size:0.85rem;text-align:right">{{ stop.pos }}%</span>
          <button v-if="stops.length > 2" class="btn btn-sm btn-danger" @click="stops.splice(i,1)">✕</button>
        </div>
        <button class="btn btn-secondary btn-sm" @click="addStop">+ Stop</button>
      </div>

      <div class="divider" />
      <label class="label">CSS Output</label>
      <div style="font-family:monospace;font-size:0.88rem;background:var(--bg);padding:14px 16px;border-radius:8px;word-break:break-all">
        background: {{ css }};
      </div>
      <button class="btn btn-secondary btn-sm mt2" @click="copy">{{ copied ? '✓ Copied!' : 'Copy CSS' }}</button>

      <!-- Presets -->
      <div class="mt">
        <label class="label">Presets</label>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          <div
            v-for="p in presets"
            :key="p.name"
            :title="p.name"
            @click="loadPreset(p)"
            style="width:48px;height:48px;border-radius:8px;cursor:pointer;transition:transform 0.1s"
            :style="{ background: p.css }"
            onmouseover="this.style.transform='scale(1.1)'"
            onmouseout="this.style.transform='scale(1)'"
          />
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Stop { color: string; pos: number }
type GType = 'linear' | 'radial' | 'conic'

const type   = ref<GType>('linear')
const angle  = ref(135)
const stops  = ref<Stop[]>([{ color: '#6366f1', pos: 0 }, { color: '#ec4899', pos: 100 }])
const copied = ref(false)

const stopsStr = computed(() =>
  [...stops.value].sort((a, b) => a.pos - b.pos)
    .map(s => `${s.color} ${s.pos}%`).join(', ')
)

const css = computed(() => {
  if (type.value === 'radial') return `radial-gradient(circle, ${stopsStr.value})`
  if (type.value === 'conic')  return `conic-gradient(from ${angle.value}deg, ${stopsStr.value})`
  return `linear-gradient(${angle.value}deg, ${stopsStr.value})`
})

function addStop() {
  const mid = Math.round((stops.value[0].pos + stops.value[stops.value.length - 1].pos) / 2)
  stops.value.push({ color: '#10b981', pos: mid })
}

function copy() {
  navigator.clipboard.writeText(`background: ${css.value};`)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

const presets = [
  { name: 'Ocean',    css: 'linear-gradient(135deg,#667eea,#764ba2)', stops: [{ color:'#667eea',pos:0 }, { color:'#764ba2',pos:100 }], angle: 135 },
  { name: 'Sunset',   css: 'linear-gradient(135deg,#f093fb,#f5576c)', stops: [{ color:'#f093fb',pos:0 }, { color:'#f5576c',pos:100 }], angle: 135 },
  { name: 'Forest',   css: 'linear-gradient(135deg,#11998e,#38ef7d)', stops: [{ color:'#11998e',pos:0 }, { color:'#38ef7d',pos:100 }], angle: 135 },
  { name: 'Fire',     css: 'linear-gradient(135deg,#f7971e,#ffd200)', stops: [{ color:'#f7971e',pos:0 }, { color:'#ffd200',pos:100 }], angle: 135 },
  { name: 'Night',    css: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', stops: [{ color:'#0f0c29',pos:0 }, { color:'#302b63',pos:50 }, { color:'#24243e',pos:100 }], angle: 135 },
  { name: 'Peach',    css: 'linear-gradient(135deg,#ffecd2,#fcb69f)', stops: [{ color:'#ffecd2',pos:0 }, { color:'#fcb69f',pos:100 }], angle: 135 },
]

function loadPreset(p: typeof presets[0]) {
  stops.value = p.stops.map(s => ({ ...s }))
  angle.value = p.angle
  type.value  = 'linear'
}
</script>
