<template>
  <ProjectLayout title="Morse Code Translator">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <button class="btn" :class="mode==='encode' ? 'btn-primary' : 'btn-secondary'" @click="mode='encode'">Text → Morse</button>
        <button class="btn" :class="mode==='decode' ? 'btn-primary' : 'btn-secondary'" @click="mode='decode'">Morse → Text</button>
      </div>

      <div v-if="mode === 'encode'">
        <label class="label">Text</label>
        <textarea v-model="textInput" class="input" style="min-height:80px" placeholder="Type text here…" @input="encode" />
        <label class="label mt2">Morse Code</label>
        <div style="background:var(--bg);border-radius:8px;padding:14px;font-family:monospace;letter-spacing:3px;min-height:60px;word-break:break-all;line-height:1.8">
          {{ morseOutput || '—' }}
        </div>
        <div class="row" style="gap:8px;margin-top:12px">
          <button class="btn btn-secondary btn-sm" @click="copyMorse">{{ copied ? '✓ Copied' : 'Copy Morse' }}</button>
          <button class="btn btn-secondary btn-sm" @click="playMorse" :disabled="playing || !morseOutput">
            {{ playing ? '🔊 Playing…' : '🔊 Play Audio' }}
          </button>
        </div>
      </div>

      <div v-else>
        <label class="label">Morse Code (use · or . for dit, — or - for dah, space between letters, / between words)</label>
        <textarea v-model="morseInput" class="input" style="min-height:80px;font-family:monospace;letter-spacing:2px" placeholder="... --- ..." @input="decode" />
        <label class="label mt2">Decoded Text</label>
        <div style="background:var(--bg);border-radius:8px;padding:14px;font-size:1.2rem;min-height:60px">
          {{ textOutput || '—' }}
        </div>
      </div>

      <!-- Reference table -->
      <div class="divider" />
      <label class="label">Reference</label>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px">
        <div v-for="[char, code] in Object.entries(MORSE).slice(0,36)" :key="char"
          style="background:var(--bg3);border-radius:6px;padding:6px 8px;text-align:center">
          <div style="font-weight:700;font-size:1rem">{{ char }}</div>
          <div style="font-family:monospace;font-size:0.8rem;color:var(--text2);letter-spacing:1px">{{ code }}</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const MORSE: Record<string, string> = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',
  M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-',',':'--..--','?':'..--..','/':'-..-.','=':'-...-',
}
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]))

const mode       = ref('encode')
const textInput  = ref('HELLO WORLD')
const morseInput = ref('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')
const morseOutput= ref('')
const textOutput = ref('')
const copied     = ref(false)
const playing    = ref(false)

function encode() {
  morseOutput.value = textInput.value.toUpperCase().split('').map(c => {
    if (c === ' ') return '/'
    return MORSE[c] ?? '?'
  }).join(' ')
}

function decode() {
  textOutput.value = morseInput.value.replace(/·/g,'.').replace(/—/g,'-').trim().split(' / ').map(word =>
    word.split(' ').map(code => REVERSE[code] ?? '?').join('')
  ).join(' ')
}

function copyMorse() {
  navigator.clipboard.writeText(morseOutput.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

async function playMorse() {
  if (!morseOutput.value || playing.value) return
  playing.value = true
  const ctx = new AudioContext()
  const dot = 80, dash = dot * 3, gap = dot, letterGap = dot * 3, wordGap = dot * 7
  let t = ctx.currentTime + 0.05

  function beep(dur: number) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 600
    gain.gain.setValueAtTime(0.3, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur / 1000)
    osc.start(t); osc.stop(t + dur / 1000)
    t += dur / 1000
  }

  for (const token of morseOutput.value.split(' ')) {
    if (token === '/') { t += wordGap / 1000; continue }
    if (!token)        { t += letterGap / 1000; continue }
    for (const ch of token) {
      if (ch === '.') { beep(dot);  t += gap / 1000 }
      if (ch === '-') { beep(dash); t += gap / 1000 }
    }
    t += letterGap / 1000
  }

  const totalMs = (t - ctx.currentTime + 0.1) * 1000
  setTimeout(() => { playing.value = false; ctx.close() }, totalMs)
}

encode()
decode()
</script>
