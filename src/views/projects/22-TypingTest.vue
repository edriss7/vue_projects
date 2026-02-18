<template>
  <ProjectLayout title="Typing Speed Test">
    <div class="card">
      <div v-if="!started && !finished">
        <p style="color:var(--text2);margin-bottom:20px">Type the text below as fast and accurately as you can. The timer starts on your first keystroke.</p>
        <div class="typing-text-display">{{ sample }}</div>
        <input
          ref="inputEl"
          v-model="typed"
          class="input mt2"
          placeholder="Start typing here…"
          @input="onInput"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <button class="btn btn-primary mt2" @click="focusInput">Start →</button>
      </div>

      <div v-if="started && !finished">
        <!-- Character-by-character display -->
        <div class="typing-text-display">
          <span
            v-for="(ch, i) in sampleChars"
            :key="i"
            :class="{
              correct: i < typed.length && typed[i] === ch,
              wrong:   i < typed.length && typed[i] !== ch,
              pending: i >= typed.length,
            }"
            :style="i === typed.length ? { borderBottom:'2px solid var(--accent2)' } : {}"
          >{{ ch }}</span>
        </div>

        <input
          ref="inputEl"
          v-model="typed"
          class="input mt2"
          @input="onInput"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          placeholder="Keep typing…"
        />

        <div class="stat-grid mt2">
          <div class="stat-box"><div class="val">{{ elapsed }}s</div><div class="lbl">Time</div></div>
          <div class="stat-box"><div class="val">{{ wpmLive }}</div><div class="lbl">WPM</div></div>
          <div class="stat-box"><div class="val">{{ accuracy }}%</div><div class="lbl">Accuracy</div></div>
          <div class="stat-box"><div class="val">{{ errors }}</div><div class="lbl">Errors</div></div>
        </div>

        <button class="btn btn-secondary btn-sm mt2" @click="reset">Reset</button>
      </div>

      <div v-if="finished" style="text-align:center">
        <div style="font-size:4rem">🏁</div>
        <h2 style="font-size:2rem;margin:16px 0">Finished!</h2>
        <div class="stat-grid" style="max-width:400px;margin:0 auto 24px">
          <div class="stat-box"><div class="val" style="color:var(--accent2)">{{ finalWpm }}</div><div class="lbl">WPM</div></div>
          <div class="stat-box"><div class="val" style="color:var(--green)">{{ accuracy }}%</div><div class="lbl">Accuracy</div></div>
          <div class="stat-box"><div class="val">{{ elapsed }}s</div><div class="lbl">Time</div></div>
          <div class="stat-box"><div class="val" style="color:var(--red)">{{ errors }}</div><div class="lbl">Errors</div></div>
        </div>
        <button class="btn btn-primary" @click="reset">Try Again</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const SAMPLE = 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!'

const sample     = ref(SAMPLE)
const sampleChars= computed(() => sample.value.split(''))
const typed      = ref('')
const started    = ref(false)
const finished   = ref(false)
const elapsed    = ref(0)
const inputEl    = ref<HTMLInputElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const errors = computed(() => {
  let e = 0
  for (let i = 0; i < typed.value.length; i++) {
    if (typed.value[i] !== sample.value[i]) e++
  }
  return e
})

const accuracy = computed(() => {
  if (!typed.value.length) return 100
  return Math.round(((typed.value.length - errors.value) / typed.value.length) * 100)
})

const wpmLive = computed(() => {
  if (!elapsed.value) return 0
  return Math.round((typed.value.length / 5) / (elapsed.value / 60))
})

const finalWpm = ref(0)

function onInput() {
  if (!started.value) {
    started.value = true
    timer = setInterval(() => elapsed.value++, 1000)
  }
  if (typed.value.length >= sample.value.length) {
    finished.value = true
    clearInterval(timer!)
    finalWpm.value = wpmLive.value
  }
}

function reset() {
  clearInterval(timer!); typed.value = ''; started.value = false
  finished.value = false; elapsed.value = 0; finalWpm.value = 0
  setTimeout(() => inputEl.value?.focus(), 50)
}

function focusInput() { inputEl.value?.focus(); started.value = false }

onUnmounted(() => clearInterval(timer!))
</script>
