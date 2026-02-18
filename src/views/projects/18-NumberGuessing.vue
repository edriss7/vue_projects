<template>
  <ProjectLayout title="Number Guessing">
    <div class="card" style="text-align:center">
      <div v-if="!gameOver">
        <p style="color:var(--text2);margin-bottom:20px">
          Guess a number between <strong>{{ min }}</strong> and <strong>{{ max }}</strong>
        </p>

        <div class="row" style="justify-content:center;gap:12px;margin-bottom:16px">
          <input
            v-model.number="guess"
            type="number"
            :min="min"
            :max="max"
            class="input"
            style="width:120px;text-align:center;font-size:1.2rem"
            @keyup.enter="submit"
          />
          <button class="btn btn-primary" @click="submit" :disabled="!guess">Guess</button>
        </div>

        <div v-if="hint" class="msg" :class="hintClass">{{ hint }}</div>

        <div style="margin-top:20px">
          <div style="font-size:0.85rem;color:var(--text2);margin-bottom:8px">
            Attempts: {{ attempts }} / {{ maxAttempts }}
          </div>
          <div class="progress-bar" style="max-width:300px;margin:0 auto">
            <div class="progress-fill" :style="{ width: (attempts/maxAttempts*100)+'%', background: attemptsColor }" />
          </div>
        </div>

        <div v-if="history.length" style="margin-top:20px">
          <div style="color:var(--text2);font-size:0.85rem;margin-bottom:8px">Previous guesses:</div>
          <div class="row" style="justify-content:center;flex-wrap:wrap;gap:8px">
            <span
              v-for="(h, i) in history"
              :key="i"
              class="badge"
              :class="h.dir === 'correct' ? 'badge-green' : h.dir === 'hot' ? 'badge-red' : h.dir === 'warm' ? 'badge-yellow' : 'badge-blue'"
            >{{ h.val }}</span>
          </div>
        </div>
      </div>

      <div v-else>
        <div style="font-size:5rem">{{ won ? '🎉' : '😢' }}</div>
        <h2 style="font-size:1.8rem;margin:16px 0">{{ won ? 'Correct!' : 'Game Over' }}</h2>
        <p style="color:var(--text2)">
          {{ won ? `You got it in ${attempts} attempt${attempts===1?'':'s'}!` : `The number was ${secret}.` }}
        </p>
        <button class="btn btn-primary mt" @click="newGame">Play Again</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const min = 1, max = 100, maxAttempts = 10
const secret   = ref(0)
const guess    = ref<number | null>(null)
const attempts = ref(0)
const hint     = ref('')
const gameOver = ref(false)
const won      = ref(false)
const history  = ref<{ val: number; dir: string }[]>([])

function dist() { return Math.abs((guess.value ?? 0) - secret.value) }

const hintClass = computed(() => ({
  'msg-success': hint.value.startsWith('🎉'),
  'msg-error':   hint.value.includes('Too high') || hint.value.includes('Too low'),
  'msg-info':    hint.value.includes('warm') || hint.value.includes('hot'),
}))

const attemptsColor = computed(() => {
  const pct = attempts.value / maxAttempts
  if (pct < 0.4) return 'var(--green)'
  if (pct < 0.7) return 'var(--yellow)'
  return 'var(--red)'
})

function newGame() {
  secret.value = Math.floor(Math.random() * (max - min + 1)) + min
  guess.value = null; attempts.value = 0; hint.value = ''
  gameOver.value = false; won.value = false; history.value = []
}

function submit() {
  if (!guess.value || guess.value < min || guess.value > max) return
  attempts.value++
  const d = dist()

  if (guess.value === secret.value) {
    won.value = true; gameOver.value = true
    history.value.push({ val: guess.value, dir: 'correct' })
    return
  }

  if (attempts.value >= maxAttempts) { gameOver.value = true; return }

  const dir = guess.value < secret.value ? 'Too low' : 'Too high'
  const temp = d <= 5 ? '🔥 Hot' : d <= 15 ? '♨️ Warm' : '🧊 Cold'
  hint.value = `${dir}! ${temp} (${d} away)`
  history.value.push({
    val: guess.value,
    dir: d <= 5 ? 'hot' : d <= 15 ? 'warm' : 'cold',
  })
  guess.value = null
}

newGame()
</script>
