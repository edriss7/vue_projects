<template>
  <ProjectLayout title="Quiz App">
    <div class="card">
      <!-- Results -->
      <div v-if="done" style="text-align:center">
        <div style="font-size:4rem">{{ scoreEmoji }}</div>
        <h2 style="font-size:2rem;margin:16px 0">{{ score }} / {{ questions.length }}</h2>
        <p style="color:var(--text2);margin-bottom:24px">{{ scoreMessage }}</p>
        <div class="progress-bar" style="margin-bottom:24px">
          <div class="progress-fill" :style="{width: (score/questions.length*100)+'%'}"></div>
        </div>
        <button class="btn btn-primary" @click="restart">Play Again</button>
      </div>

      <!-- Quiz -->
      <div v-else>
        <div class="quiz-progress">
          <div
            v-for="(_, i) in questions"
            :key="i"
            class="quiz-dot"
            :class="{ done: i < current, active: i === current }"
          />
        </div>

        <p style="color:var(--text2);font-size:0.88rem;margin-bottom:8px">
          Question {{ current + 1 }} of {{ questions.length }}
        </p>
        <h3 style="font-size:1.2rem;margin-bottom:20px">{{ q.question }}</h3>

        <button
          v-for="(opt, i) in q.options"
          :key="i"
          class="quiz-option"
          :class="{
            correct: answered && i === q.correct,
            wrong:   answered && i === selected && i !== q.correct,
          }"
          :disabled="answered"
          @click="answer(i)"
        >{{ opt }}</button>

        <div v-if="answered" class="mt2">
          <button class="btn btn-primary" @click="next">
            {{ current < questions.length - 1 ? 'Next Question →' : 'See Results' }}
          </button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Question { question: string; options: string[]; correct: number }

const questions: Question[] = [
  { question: 'What does "ref" do in Vue 3?', options: ['Creates a reactive reference', 'Registers a component', 'Defines a route', 'Sets a prop'], correct: 0 },
  { question: 'Which directive binds an attribute dynamically?', options: ['v-model', 'v-bind', 'v-on', 'v-if'], correct: 1 },
  { question: 'What does v-model create?', options: ['One-way data binding', 'Two-way data binding', 'Event emitter', 'Component slot'], correct: 1 },
  { question: 'Which lifecycle hook runs after mount?', options: ['beforeCreate', 'created', 'onMounted', 'beforeMount'], correct: 2 },
  { question: 'What is the Composition API entry point?', options: ['created()', 'setup()', 'mounted()', 'data()'], correct: 1 },
  { question: 'What does "computed" return?', options: ['A ref', 'A reactive object', 'A read-only ref', 'A watcher'], correct: 2 },
  { question: 'Which Vue 3 function watches reactive state?', options: ['watch()', 'observe()', 'subscribe()', 'listen()'], correct: 0 },
  { question: 'How do you emit a custom event in <script setup>?', options: ['this.$emit()', 'defineEmits()', 'emitEvent()', 'useEmit()'], correct: 1 },
  { question: 'What is Pinia used for?', options: ['Routing', 'State management', 'HTTP requests', 'Form validation'], correct: 1 },
  { question: 'What does <Teleport> do?', options: ['Animates components', 'Renders content outside the current DOM subtree', 'Lazy-loads a component', 'Creates a portal route'], correct: 1 },
]

const current  = ref(0)
const selected = ref(-1)
const answered = ref(false)
const score    = ref(0)
const done     = ref(false)

const q = computed(() => questions[current.value])

const scoreEmoji   = computed(() => score.value >= 8 ? '🏆' : score.value >= 5 ? '👍' : '📚')
const scoreMessage = computed(() => score.value >= 8 ? 'Excellent! You\'re a Vue expert!' : score.value >= 5 ? 'Good job! Keep learning.' : 'Keep practising — you\'ll get there!')

function answer(i: number) {
  if (answered.value) return
  selected.value = i
  answered.value = true
  if (i === q.value.correct) score.value++
}

function next() {
  if (current.value < questions.length - 1) {
    current.value++
    selected.value = -1
    answered.value = false
  } else {
    done.value = true
  }
}

function restart() {
  current.value = 0; selected.value = -1; answered.value = false
  score.value = 0; done.value = false
}
</script>
