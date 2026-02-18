<template>
  <ProjectLayout title="Flashcards">
    <div class="card">
      <div class="row" style="justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <div class="row" style="gap:8px">
          <button
            v-for="d in decks"
            :key="d.name"
            class="btn btn-sm"
            :class="deck === d.name ? 'btn-primary' : 'btn-secondary'"
            @click="selectDeck(d.name)"
          >{{ d.name }}</button>
        </div>
        <span style="color:var(--text2);font-size:0.85rem;align-self:center">
          {{ current + 1 }} / {{ cards.length }}
          · {{ mastered.size }} mastered
        </span>
      </div>

      <!-- Card -->
      <div
        class="flashcard"
        :class="{ answer: showAnswer }"
        @click="showAnswer = !showAnswer"
      >
        {{ showAnswer ? cards[current].answer : cards[current].question }}
      </div>
      <div class="fc-counter">
        {{ showAnswer ? 'Answer — click to hide' : 'Question — click to reveal answer' }}
      </div>

      <div class="row" style="justify-content:center;gap:10px;margin-top:16px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" :disabled="current === 0" @click="prev">← Prev</button>
        <button class="btn btn-success btn-sm" @click="markMastered">
          {{ mastered.has(current) ? '★ Mastered' : '☆ Mark mastered' }}
        </button>
        <button class="btn btn-secondary btn-sm" :disabled="current === cards.length - 1" @click="next">Next →</button>
      </div>

      <div class="mt2">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: (mastered.size / cards.length * 100) + '%' }" />
        </div>
        <div style="color:var(--text2);font-size:0.8rem;margin-top:4px">
          Progress: {{ mastered.size }} / {{ cards.length }} ({{ Math.round(mastered.size/cards.length*100) }}%)
        </div>
      </div>

      <button class="btn btn-secondary btn-sm mt2" @click="shuffle">🔀 Shuffle</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Card { question: string; answer: string }
interface Deck { name: string; cards: Card[] }

const decks: Deck[] = [
  {
    name: 'Vue 3',
    cards: [
      { question: 'What is the Composition API?',       answer: 'A set of additive, function-based APIs that allow flexible composition of component logic.' },
      { question: 'What does ref() do?',                answer: 'Creates a reactive reference that wraps a primitive value. Access with .value.' },
      { question: 'What is reactive()?',                answer: 'Creates a deeply reactive proxy of an object.' },
      { question: 'When does onMounted fire?',          answer: 'After the component is inserted into the DOM.' },
      { question: 'What is a computed property?',       answer: 'A cached, derived reactive value that only re-evaluates when its dependencies change.' },
      { question: 'What is defineProps?',               answer: 'A compiler macro to declare the props a component accepts (in <script setup>).' },
      { question: 'What is defineEmits?',               answer: 'A compiler macro to declare the custom events a component can emit (in <script setup>).' },
      { question: 'What is provide/inject?',            answer: 'A dependency-injection mechanism to pass data from an ancestor to deep descendants.' },
    ],
  },
  {
    name: 'TypeScript',
    cards: [
      { question: 'What is a union type?',              answer: 'A type that can be one of several types: string | number | boolean.' },
      { question: 'What is an interface?',              answer: 'A named contract that describes the shape of an object.' },
      { question: 'What is "as const"?',                answer: 'Asserts that a value is a literal, immutable type (deepens type narrowing).' },
      { question: 'What is the "never" type?',          answer: 'Represents values that never occur — used for exhaustive checks and unreachable code.' },
      { question: 'What is keyof?',                     answer: 'An operator that produces a union of all property keys of a type.' },
      { question: 'What is a generic type?',            answer: 'A type parameter that makes components/functions reusable across different types.' },
    ],
  },
]

const deck       = ref('Vue 3')
const cards      = ref<Card[]>(decks[0].cards)
const current    = ref(0)
const showAnswer = ref(false)
const mastered   = ref(new Set<number>())

function selectDeck(name: string) {
  const d = decks.find(d => d.name === name)!
  deck.value = name; cards.value = d.cards; current.value = 0; showAnswer.value = false; mastered.value = new Set()
}

function next() { if (current.value < cards.value.length - 1) { current.value++; showAnswer.value = false } }
function prev() { if (current.value > 0) { current.value--; showAnswer.value = false } }

function markMastered() {
  const set = new Set(mastered.value)
  set.has(current.value) ? set.delete(current.value) : set.add(current.value)
  mastered.value = set
}

function shuffle() {
  const arr = [...cards.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  cards.value = arr; current.value = 0; showAnswer.value = false; mastered.value = new Set()
}
</script>
