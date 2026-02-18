<template>
  <ProjectLayout title="Memory Game">
    <div class="card">
      <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:16px">
        <div class="row" style="gap:16px">
          <span>Moves: <strong>{{ moves }}</strong></span>
          <span>Pairs: <strong style="color:var(--green)">{{ matched }}/{{ pairs }}</strong></span>
        </div>
        <button class="btn btn-secondary btn-sm" @click="init">New Game</button>
      </div>

      <div
        class="memory-grid"
        :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          class="memory-card"
          :class="{
            flipped:  card.flipped || card.matched,
            matched:  card.matched,
          }"
          @click="flip(card)"
        >
          <span v-if="card.flipped || card.matched">{{ card.emoji }}</span>
          <span v-else style="font-size:1.5rem;color:var(--bg3)">?</span>
        </div>
      </div>

      <div v-if="won" class="msg msg-success mt" style="font-size:1.1rem;text-align:center">
        🎉 You won in {{ moves }} moves! <button class="btn btn-sm btn-primary" style="margin-left:12px" @click="init">Play again</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean }

const EMOJIS = ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🦁']
const pairs  = EMOJIS.length
const cols   = 4

const cards   = ref<Card[]>([])
const moves   = ref(0)
const matched = ref(0)
const selected = ref<Card[]>([])
const locked   = ref(false)
const won      = computed(() => matched.value === pairs)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function init() {
  const doubled = shuffle([...EMOJIS, ...EMOJIS])
  cards.value = doubled.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
  moves.value = 0; matched.value = 0; selected.value = []; locked.value = false
}

function flip(card: Card) {
  if (locked.value || card.flipped || card.matched) return
  if (selected.value.length === 2) return

  card.flipped = true
  selected.value.push(card)

  if (selected.value.length === 2) {
    moves.value++
    locked.value = true
    const [a, b] = selected.value
    if (a.emoji === b.emoji) {
      a.matched = b.matched = true
      matched.value++
      selected.value = []; locked.value = false
    } else {
      setTimeout(() => {
        a.flipped = b.flipped = false
        selected.value = []; locked.value = false
      }, 900)
    }
  }
}

init()
</script>
