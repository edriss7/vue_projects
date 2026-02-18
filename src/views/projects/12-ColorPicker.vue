<template>
  <ProjectLayout title="Color Picker">
    <div class="card">
      <div class="color-preview" :style="{ background: rgbStr }" />

      <div class="slider-row">
        <span style="color:var(--red)">R</span>
        <input type="range" v-model.number="r" min="0" max="255" />
        <span class="val">{{ r }}</span>
      </div>
      <div class="slider-row">
        <span style="color:var(--green)">G</span>
        <input type="range" v-model.number="g" min="0" max="255" />
        <span class="val">{{ g }}</span>
      </div>
      <div class="slider-row">
        <span style="color:var(--accent2)">B</span>
        <input type="range" v-model.number="b" min="0" max="255" />
        <span class="val">{{ b }}</span>
      </div>

      <div class="divider" />

      <div class="row" style="gap:16px;flex-wrap:wrap">
        <div class="result-box" style="flex:1;min-width:140px">
          <span class="label">HEX</span>
          <span style="font-family:monospace;font-size:1.1rem">{{ hex }}</span>
        </div>
        <div class="result-box" style="flex:1;min-width:140px">
          <span class="label">RGB</span>
          <span style="font-family:monospace;font-size:0.95rem">{{ rgbStr }}</span>
        </div>
        <div class="result-box" style="flex:1;min-width:140px">
          <span class="label">HSL</span>
          <span style="font-family:monospace;font-size:0.95rem">{{ hslStr }}</span>
        </div>
      </div>

      <div class="mt">
        <label class="label">Presets</label>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          <button
            v-for="preset in presets"
            :key="preset.hex"
            :title="preset.name"
            :style="{ background: preset.hex, width:'32px', height:'32px', border:'2px solid transparent', borderRadius:'6px', cursor:'pointer', transition:'transform 0.1s' }"
            @click="setPreset(preset)"
          />
        </div>
      </div>

      <div class="mt2">
        <button class="btn btn-secondary" @click="copyHex">{{ copiedHex ? '✓ Copied!' : 'Copy HEX' }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const r = ref(99)
const g = ref(102)
const b = ref(241)
const copiedHex = ref(false)

const toHex = (n: number) => n.toString(16).padStart(2, '0')
const hex    = computed(() => '#' + toHex(r.value) + toHex(g.value) + toHex(b.value))
const rgbStr = computed(() => `rgb(${r.value}, ${g.value}, ${b.value})`)

const hslStr = computed(() => {
  const rr = r.value / 255, gg = g.value / 255, bb = b.value / 255
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break
      case gg: h = ((bb - rr) / d + 2) / 6; break
      case bb: h = ((rr - gg) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})

const presets = [
  { name: 'Indigo',  hex: '#6366f1' }, { name: 'Rose',   hex: '#f43f5e' },
  { name: 'Emerald', hex: '#10b981' }, { name: 'Amber',  hex: '#f59e0b' },
  { name: 'Sky',     hex: '#0ea5e9' }, { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Pink',    hex: '#ec4899' }, { name: 'Teal',   hex: '#14b8a6' },
  { name: 'White',   hex: '#f1f5f9' }, { name: 'Black',  hex: '#0f172a' },
]

function setPreset(p: { hex: string }) {
  const n = parseInt(p.hex.slice(1), 16)
  r.value = (n >> 16) & 255
  g.value = (n >> 8)  & 255
  b.value = n & 255
}

function copyHex() {
  navigator.clipboard.writeText(hex.value)
  copiedHex.value = true
  setTimeout(() => copiedHex.value = false, 2000)
}
</script>
