<template>
  <ProjectLayout title="ASCII Art Generator">
    <div class="card">
      <label class="label">Text</label>
      <input v-model="text" class="input" placeholder="Hello" maxlength="12" @input="generate" />

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:12px">
        <div>
          <label class="label">Font</label>
          <select v-model="font" class="input" @change="generate">
            <option v-for="f in fonts" :key="f.key" :value="f.key">{{ f.label }}</option>
          </select>
        </div>
        <div>
          <label class="label">Width multiplier</label>
          <input v-model.number="scale" type="range" min="1" max="3" step="1"
            style="width:100%;accent-color:var(--accent);margin-top:6px" @input="generate" />
          <div style="font-size:0.78rem;color:var(--text2)">×{{ scale }}</div>
        </div>
        <div>
          <label class="label">Character</label>
          <input v-model="fillChar" class="input" maxlength="1" @input="generate" />
        </div>
      </div>

      <div style="margin-top:12px;background:var(--bg);border-radius:8px;padding:14px;overflow-x:auto">
        <pre style="font-family:monospace;font-size:0.7rem;line-height:1.15;color:var(--accent);margin:0;white-space:pre">{{ output }}</pre>
      </div>

      <div class="row" style="gap:8px;margin-top:8px">
        <button class="btn btn-secondary btn-sm" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        <button class="btn btn-secondary btn-sm" @click="download">Download .txt</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const text     = ref('VUE')
const font     = ref('block')
const scale    = ref(1)
const fillChar = ref('#')
const output   = ref('')
const copied   = ref(false)

// Simple bitmap fonts (5×5 pixels per char)
const FONT_5x5: Record<string, number[]> = {
  ' ': [0b00000,0b00000,0b00000,0b00000,0b00000],
  'A': [0b01110,0b10001,0b11111,0b10001,0b10001],
  'B': [0b11110,0b10001,0b11110,0b10001,0b11110],
  'C': [0b01111,0b10000,0b10000,0b10000,0b01111],
  'D': [0b11110,0b10001,0b10001,0b10001,0b11110],
  'E': [0b11111,0b10000,0b11110,0b10000,0b11111],
  'F': [0b11111,0b10000,0b11110,0b10000,0b10000],
  'G': [0b01111,0b10000,0b10011,0b10001,0b01111],
  'H': [0b10001,0b10001,0b11111,0b10001,0b10001],
  'I': [0b11111,0b00100,0b00100,0b00100,0b11111],
  'J': [0b11111,0b00010,0b00010,0b10010,0b01100],
  'K': [0b10001,0b10010,0b11100,0b10010,0b10001],
  'L': [0b10000,0b10000,0b10000,0b10000,0b11111],
  'M': [0b10001,0b11011,0b10101,0b10001,0b10001],
  'N': [0b10001,0b11001,0b10101,0b10011,0b10001],
  'O': [0b01110,0b10001,0b10001,0b10001,0b01110],
  'P': [0b11110,0b10001,0b11110,0b10000,0b10000],
  'Q': [0b01110,0b10001,0b10001,0b10011,0b01111],
  'R': [0b11110,0b10001,0b11110,0b10010,0b10001],
  'S': [0b01111,0b10000,0b01110,0b00001,0b11110],
  'T': [0b11111,0b00100,0b00100,0b00100,0b00100],
  'U': [0b10001,0b10001,0b10001,0b10001,0b01110],
  'V': [0b10001,0b10001,0b10001,0b01010,0b00100],
  'W': [0b10001,0b10001,0b10101,0b11011,0b10001],
  'X': [0b10001,0b01010,0b00100,0b01010,0b10001],
  'Y': [0b10001,0b01010,0b00100,0b00100,0b00100],
  'Z': [0b11111,0b00010,0b00100,0b01000,0b11111],
  '0': [0b01110,0b10011,0b10101,0b11001,0b01110],
  '1': [0b00100,0b01100,0b00100,0b00100,0b01110],
  '2': [0b01110,0b10001,0b00110,0b01000,0b11111],
  '3': [0b01110,0b00001,0b00110,0b00001,0b01110],
  '!': [0b00100,0b00100,0b00100,0b00000,0b00100],
  '?': [0b01110,0b00001,0b00110,0b00000,0b00100],
}

const fonts = [
  { key: 'block',    label: 'Block' },
  { key: 'outline',  label: 'Outline' },
  { key: 'shadow',   label: 'Shadow' },
]

function generate() {
  const chars = text.value.toUpperCase().split('')
  const rows: string[][] = Array.from({length:5}, () => [])
  const fill = fillChar.value || '#'

  for (const ch of chars) {
    const bits = FONT_5x5[ch] ?? FONT_5x5[' ']
    for (let r = 0; r < 5; r++) {
      let row = ''
      for (let c = 4; c >= 0; c--) {
        const on = (bits[r] >> c) & 1
        const cell = on
          ? (font.value === 'outline' && isInner(bits, r, c) ? '░' : fill.repeat(scale.value))
          : ' '.repeat(scale.value)
        row += cell
      }
      rows[r].push(row + ' ')
    }
  }

  if (font.value === 'shadow') {
    output.value = rows.map((r, ri) => r.join('') + (ri < 4 ? '\n' + ' '.repeat(2) : '')).join('\n')
  } else {
    output.value = rows.map(r => r.join('')).join('\n')
  }
}

function isInner(bits: number[], r: number, c: number) {
  if (!((bits[r] >> c) & 1)) return false
  const adj = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]
  return adj.every(([ar,ac]) => ar >= 0 && ar < 5 && ac >= 0 && ac < 5 && ((bits[ar] >> ac) & 1))
}

function copy() {
  navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

function download() {
  const blob = new Blob([output.value], { type: 'text/plain' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = 'ascii-art.txt'; a.click()
}

generate()
</script>
