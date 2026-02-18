<template>
  <ProjectLayout title="Text to Speech">
    <div class="card">
      <label class="label">Text</label>
      <textarea v-model="text" class="input" style="min-height:120px" placeholder="Type or paste text to speak…" />

      <div class="col" style="gap:12px;margin-top:16px">
        <div>
          <label class="label">Voice</label>
          <select v-model="selectedVoice" class="input">
            <option v-for="v in voices" :key="v.name" :value="v.name">{{ v.name }} ({{ v.lang }})</option>
          </select>
        </div>
        <div>
          <label class="label">Rate — {{ rate }}x</label>
          <input v-model.number="rate" type="range" min="0.5" max="2" step="0.1" class="input" style="padding:4px 0;background:transparent;border:none" />
        </div>
        <div>
          <label class="label">Pitch — {{ pitch }}</label>
          <input v-model.number="pitch" type="range" min="0" max="2" step="0.1" class="input" style="padding:4px 0;background:transparent;border:none" />
        </div>
        <div>
          <label class="label">Volume — {{ Math.round(volume * 100) }}%</label>
          <input v-model.number="volume" type="range" min="0" max="1" step="0.05" class="input" style="padding:4px 0;background:transparent;border:none" />
        </div>
      </div>

      <div class="row" style="gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" :disabled="speaking || !text.trim()" @click="speak">▶ Speak</button>
        <button class="btn btn-warn" :disabled="!speaking" @click="pause">{{ paused ? '▶ Resume' : '⏸ Pause' }}</button>
        <button class="btn btn-danger" :disabled="!speaking" @click="stop">⏹ Stop</button>
      </div>

      <div v-if="speaking" class="msg msg-info mt2">
        🔊 {{ paused ? 'Paused' : 'Speaking…' }}
      </div>
      <div v-if="!supported" class="msg msg-error mt2">
        Web Speech API is not supported in this browser.
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const text          = ref('Hello! Welcome to the Text to Speech project. This uses the Web Speech API built into your browser. You can adjust the voice, rate, pitch, and volume.')
const voices        = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref('')
const rate          = ref(1)
const pitch         = ref(1)
const volume        = ref(1)
const speaking      = ref(false)
const paused        = ref(false)
const supported     = ref(typeof speechSynthesis !== 'undefined')

let utterance: SpeechSynthesisUtterance | null = null

function loadVoices() {
  voices.value = speechSynthesis.getVoices()
  if (voices.value.length && !selectedVoice.value) {
    const eng = voices.value.find(v => v.lang.startsWith('en'))
    selectedVoice.value = (eng ?? voices.value[0]).name
  }
}

onMounted(() => {
  if (!supported.value) return
  loadVoices()
  speechSynthesis.addEventListener('voiceschanged', loadVoices)
})

function speak() {
  if (!supported.value || !text.value.trim()) return
  stop()
  utterance = new SpeechSynthesisUtterance(text.value)
  const voice = voices.value.find(v => v.name === selectedVoice.value)
  if (voice) utterance.voice = voice
  utterance.rate   = rate.value
  utterance.pitch  = pitch.value
  utterance.volume = volume.value
  utterance.onstart  = () => { speaking.value = true;  paused.value = false }
  utterance.onend    = () => { speaking.value = false; paused.value = false }
  utterance.onerror  = () => { speaking.value = false; paused.value = false }
  speechSynthesis.speak(utterance)
}

function pause() {
  if (paused.value) { speechSynthesis.resume(); paused.value = false }
  else              { speechSynthesis.pause();  paused.value = true  }
}

function stop() {
  speechSynthesis.cancel()
  speaking.value = false; paused.value = false
}
</script>
