<template>
  <ProjectLayout title="Speed Math Quiz">
    <div class="card" style="text-align:center">
      <div v-if="!started">
        <h3 style="margin-bottom:16px">How fast can you solve math problems?</h3>
        <div class="row" style="justify-content:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
          <button v-for="d in difficulties" :key="d.key"
            class="btn" :class="diff === d.key ? 'btn-primary' : 'btn-secondary'"
            @click="diff = d.key">{{ d.label }}</button>
        </div>
        <div class="row" style="justify-content:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
          <button v-for="op in ['+ - × ÷', '+', '-', '×', '÷']" :key="op"
            class="btn btn-sm" :class="ops === op ? 'btn-primary' : 'btn-secondary'"
            @click="ops = op">{{ op }}</button>
        </div>
        <button class="btn btn-primary" @click="start" style="font-size:1.1rem;padding:14px 36px">▶ Start</button>
      </div>

      <div v-else-if="!finished">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:20px">
          <div>
            <div style="font-size:2rem;font-weight:800;color:var(--yellow);font-variant-numeric:tabular-nums">{{ timeLeft }}s</div>
            <div style="color:var(--text2);font-size:0.8rem">Time left</div>
          </div>
          <div>
            <div style="font-size:2rem;font-weight:800;color:var(--green)">{{ score }}</div>
            <div style="color:var(--text2);font-size:0.8rem">Score</div>
          </div>
          <div>
            <div style="font-size:2rem;font-weight:800;color:var(--red)">{{ wrong }}</div>
            <div style="color:var(--text2);font-size:0.8rem">Wrong</div>
          </div>
        </div>

        <div style="font-size:3rem;font-weight:800;margin:24px 0">{{ question }}</div>

        <input
          ref="answerEl"
          v-model="answer"
          type="number"
          class="input"
          style="font-size:1.5rem;text-align:center;max-width:160px"
          @keyup.enter="submit"
          :class="{ 'input-flash-wrong': flashWrong }"
        />
        <button class="btn btn-primary mt2" @click="submit">Submit</button>

        <div class="progress-bar mt2" style="max-width:300px;margin:0 auto">
          <div class="progress-fill" :style="{ width: (timeLeft / 60 * 100) + '%', background: timeLeft < 10 ? 'var(--red)' : 'var(--accent)' }" />
        </div>
      </div>

      <div v-else>
        <div style="font-size:4rem">{{ score >= 20 ? '🏆' : score >= 10 ? '👍' : '📚' }}</div>
        <h2 style="font-size:2rem;margin:16px 0">Score: {{ score }}</h2>
        <div style="color:var(--text2);margin-bottom:20px">{{ wrong }} wrong · {{ accuracy }}% accuracy</div>
        <button class="btn btn-primary" @click="reset">Play Again</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const diff = ref('medium')
const ops  = ref('+ - × ÷')
const difficulties = [
  { key: 'easy',   label: '😊 Easy'   },
  { key: 'medium', label: '🤔 Medium' },
  { key: 'hard',   label: '🔥 Hard'   },
]

const started   = ref(false)
const finished  = ref(false)
const score     = ref(0)
const wrong     = ref(0)
const timeLeft  = ref(60)
const question  = ref('')
const answer    = ref<string>('')
const answerEl  = ref<HTMLInputElement | null>(null)
const flashWrong= ref(false)
let correctAnswer = 0
let timer: ReturnType<typeof setInterval> | null = null

const accuracy = computed(() => {
  const total = score.value + wrong.value
  return total ? Math.round(score.value / total * 100) : 0
})

function rnd(max: number) { return Math.floor(Math.random() * max) + 1 }

function nextQuestion() {
  const allOps = ['+ - × ÷', '+', '-', '×', '÷']
  const pool = ops.value === '+ - × ÷' ? ['+','-','×','÷'] : [ops.value]
  const op = pool[Math.floor(Math.random() * pool.length)]
  const max = diff.value === 'easy' ? 10 : diff.value === 'medium' ? 20 : 50

  let a = rnd(max), b = rnd(max)
  if (op === '×') { a = rnd(diff.value === 'easy' ? 5 : 12); b = rnd(diff.value === 'easy' ? 5 : 12) }
  if (op === '÷') { correctAnswer = rnd(max/2); b = rnd(max/2); a = correctAnswer * b }
  else if (op === '-') { if (a < b) [a,b] = [b,a]; correctAnswer = a - b }
  else if (op === '+') correctAnswer = a + b
  else if (op === '×') correctAnswer = a * b

  question.value = `${a} ${op} ${b} = ?`
  answer.value   = ''
  setTimeout(() => answerEl.value?.focus(), 50)
}

function submit() {
  if (answer.value === '') return
  if (parseInt(answer.value) === correctAnswer) { score.value++; nextQuestion() }
  else {
    wrong.value++; flashWrong.value = true
    setTimeout(() => flashWrong.value = false, 400)
  }
}

function start() {
  started.value = true; finished.value = false; score.value = 0; wrong.value = 0; timeLeft.value = 60
  nextQuestion()
  timer = setInterval(() => {
    if (timeLeft.value <= 0) { clearInterval(timer!); finished.value = true }
    else timeLeft.value--
  }, 1000)
}

function reset() { clearInterval(timer!); started.value = false; finished.value = false }

onUnmounted(() => clearInterval(timer!))
</script>

<style>
.input-flash-wrong { border-color: var(--red) !important; animation: flashRed 0.4s; }
@keyframes flashRed { 0%,100%{background:var(--bg3)} 50%{background:rgba(239,68,68,0.25)} }
</style>
