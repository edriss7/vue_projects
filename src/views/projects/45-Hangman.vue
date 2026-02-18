<template>
  <ProjectLayout title="Hangman">
    <div class="card" style="text-align:center">
      <!-- Hangman SVG -->
      <svg width="160" height="160" viewBox="0 0 160 160" style="margin:0 auto 16px;display:block">
        <line x1="20" y1="155" x2="140" y2="155" stroke="var(--text)" stroke-width="3"/>
        <line x1="60" y1="155" x2="60" y2="10"  stroke="var(--text)" stroke-width="3"/>
        <line x1="60" y1="10"  x2="100" y2="10" stroke="var(--text)" stroke-width="3"/>
        <line x1="100" y1="10" x2="100" y2="30" stroke="var(--text)" stroke-width="3"/>
        <!-- Head -->
        <circle v-if="wrong >= 1" cx="100" cy="45" r="15" fill="none" stroke="var(--red)" stroke-width="3"/>
        <!-- Body -->
        <line v-if="wrong >= 2" x1="100" y1="60" x2="100" y2="100" stroke="var(--red)" stroke-width="3"/>
        <!-- Left arm -->
        <line v-if="wrong >= 3" x1="100" y1="70" x2="75"  y2="90"  stroke="var(--red)" stroke-width="3"/>
        <!-- Right arm -->
        <line v-if="wrong >= 4" x1="100" y1="70" x2="125" y2="90"  stroke="var(--red)" stroke-width="3"/>
        <!-- Left leg -->
        <line v-if="wrong >= 5" x1="100" y1="100" x2="75" y2="130" stroke="var(--red)" stroke-width="3"/>
        <!-- Right leg -->
        <line v-if="wrong >= 6" x1="100" y1="100" x2="125" y2="130" stroke="var(--red)" stroke-width="3"/>
      </svg>

      <div style="font-size:0.9rem;color:var(--text2);margin-bottom:8px">{{ category }}</div>

      <!-- Word display -->
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:20px">
        <div
          v-for="(letter, i) in wordLetters"
          :key="i"
          style="width:32px;border-bottom:2px solid var(--text2);text-align:center;font-size:1.3rem;font-weight:700;padding-bottom:2px"
        >
          <span v-if="guessed.has(letter) || gameOver">{{ letter }}</span>
        </div>
      </div>

      <div v-if="won" class="msg msg-success" style="margin-bottom:12px">🎉 You won! The word was "{{ word }}"</div>
      <div v-if="lost" class="msg msg-error" style="margin-bottom:12px">💀 Game over! The word was "{{ word }}"</div>

      <div v-if="!gameOver" style="margin-bottom:16px">
        <div style="color:var(--text2);font-size:0.85rem;margin-bottom:8px">{{ MAX_WRONG - wrong }} guesses remaining</div>
        <!-- Alphabet -->
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px">
          <button
            v-for="letter in ALPHABET"
            :key="letter"
            class="btn btn-sm"
            :class="{
              'btn-danger':   guessed.has(letter) && !wordLetters.includes(letter),
              'btn-success':  guessed.has(letter) &&  wordLetters.includes(letter),
              'btn-secondary':!guessed.has(letter),
            }"
            :disabled="guessed.has(letter)"
            @click="guess(letter)"
            style="width:34px;padding:6px 0"
          >{{ letter }}</button>
        </div>
      </div>

      <button class="btn btn-primary" @click="newGame">{{ gameOver ? '▶ New Game' : '↺ New Word' }}</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const MAX_WRONG = 6
const ALPHABET  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const WORDS = [
  { word: 'JAVASCRIPT', cat: 'Programming' }, { word: 'TYPESCRIPT', cat: 'Programming' },
  { word: 'ALGORITHM',  cat: 'Computer Science' }, { word: 'RECURSION', cat: 'Computer Science' },
  { word: 'COMPONENT',  cat: 'Vue' }, { word: 'DIRECTIVE', cat: 'Vue' },
  { word: 'ELEPHANT',   cat: 'Animals' }, { word: 'PENGUIN',   cat: 'Animals' },
  { word: 'UNIVERSE',   cat: 'Science' }, { word: 'QUANTUM',   cat: 'Science' },
  { word: 'SYMPHONY',   cat: 'Music' }, { word: 'KEYBOARD',   cat: 'Music' },
  { word: 'CHOCOLATE',  cat: 'Food' }, { word: 'SPAGHETTI',  cat: 'Food' },
  { word: 'ADVENTURE',  cat: 'General' }, { word: 'DIAMOND',   cat: 'General' },
  { word: 'HYPNOSIS',   cat: 'General' }, { word: 'JEALOUSY',  cat: 'General' },
]

const word     = ref('')
const category = ref('')
const guessed  = ref(new Set<string>())

const wordLetters = computed(() => word.value.split(''))
const wrong       = computed(() => [...guessed.value].filter(l => !wordLetters.value.includes(l)).length)
const won         = computed(() => wordLetters.value.every(l => guessed.value.has(l)))
const lost        = computed(() => wrong.value >= MAX_WRONG)
const gameOver    = computed(() => won.value || lost.value)

function guess(letter: string) {
  if (!gameOver.value) guessed.value = new Set([...guessed.value, letter])
}

function newGame() {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)]
  word.value     = w.word
  category.value = w.cat
  guessed.value  = new Set()
}

newGame()
</script>
