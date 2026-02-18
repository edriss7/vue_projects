<template>
  <ProjectLayout title="Typewriter Effect">
    <div class="card">
      <!-- Settings -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div>
          <label class="label">Type speed (ms/char)</label>
          <input v-model.number="typeSpeed" type="range" min="20" max="300" step="10"
            style="width:100%;accent-color:var(--accent)" />
          <div style="font-size:0.78rem;color:var(--text2)">{{ typeSpeed }}ms</div>
        </div>
        <div>
          <label class="label">Delete speed (ms/char)</label>
          <input v-model.number="deleteSpeed" type="range" min="20" max="300" step="10"
            style="width:100%;accent-color:var(--accent)" />
          <div style="font-size:0.78rem;color:var(--text2)">{{ deleteSpeed }}ms</div>
        </div>
        <div>
          <label class="label">Pause between (ms)</label>
          <input v-model.number="pause" type="range" min="500" max="4000" step="250"
            style="width:100%;accent-color:var(--accent)" />
          <div style="font-size:0.78rem;color:var(--text2)">{{ pause }}ms</div>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:flex-end;gap:8px">
          <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer">
            <input type="checkbox" v-model="loop" style="accent-color:var(--accent)" /> Loop
          </label>
        </div>
      </div>

      <!-- Phrases -->
      <label class="label">Phrases (one per line)</label>
      <textarea v-model="phrasesText" class="input" style="min-height:80px;font-family:monospace;font-size:0.85rem" />

      <button class="btn btn-primary mt2" @click="restart">▶ Restart</button>

      <!-- Display -->
      <div style="margin-top:20px;min-height:80px;display:flex;align-items:center;justify-content:center">
        <div style="font-size:1.8rem;font-weight:700;text-align:center;line-height:1.4">
          {{ displayed }}<span style="border-right:3px solid var(--accent);margin-left:2px;animation:blink 1s step-end infinite" />
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const typeSpeed   = ref(80)
const deleteSpeed = ref(50)
const pause       = ref(2000)
const loop        = ref(true)
const phrasesText = ref('Hello, World!\nWelcome to Vue.js\nTypewriter Effect\nBuilt with TypeScript\nKeep coding every day!')

const displayed = ref('')
let phraseIdx = 0
let charIdx = 0
let deleting = false
let tid: ReturnType<typeof setTimeout> | null = null

function tick() {
  const phrases = phrasesText.value.split('\n').filter(Boolean)
  if (!phrases.length) return
  const current = phrases[phraseIdx % phrases.length]

  if (!deleting) {
    displayed.value = current.slice(0, ++charIdx)
    if (charIdx >= current.length) {
      deleting = true
      tid = setTimeout(tick, pause.value)
      return
    }
    tid = setTimeout(tick, typeSpeed.value)
  } else {
    displayed.value = current.slice(0, --charIdx)
    if (charIdx <= 0) {
      deleting = false
      phraseIdx++
      if (!loop.value && phraseIdx >= phrases.length) return
      phraseIdx = phraseIdx % phrases.length
      tid = setTimeout(tick, 400)
      return
    }
    tid = setTimeout(tick, deleteSpeed.value)
  }
}

function restart() {
  if (tid !== null) clearTimeout(tid)
  displayed.value = ''; phraseIdx = 0; charIdx = 0; deleting = false
  tid = setTimeout(tick, 300)
}

restart()
onUnmounted(() => { if (tid !== null) clearTimeout(tid) })
</script>

<style>
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
</style>
