<template>
  <ProjectLayout title="Random Quote Generator">
    <div class="card" style="text-align:center">
      <div
        style="font-size:1.4rem;font-style:italic;line-height:1.6;min-height:100px;display:flex;align-items:center;justify-content:center;padding:20px;transition:opacity 0.3s"
        :style="{ opacity: fading ? 0 : 1 }"
      >
        "{{ current.text }}"
      </div>
      <div style="color:var(--accent2);font-weight:700;margin-top:8px">— {{ current.author }}</div>
      <div style="color:var(--text2);font-size:0.82rem;margin-top:4px">{{ current.category }}</div>

      <div class="row" style="justify-content:center;gap:12px;margin-top:24px">
        <button class="btn btn-primary" @click="next">New Quote</button>
        <button class="btn btn-secondary" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        <button class="btn btn-secondary" @click="toggleFav">{{ isFav ? '★ Saved' : '☆ Save' }}</button>
      </div>

      <div v-if="favorites.length" class="mt">
        <div class="divider" />
        <label class="label" style="text-align:left">Saved Quotes ({{ favorites.length }})</label>
        <div
          v-for="q in favorites"
          :key="q.text"
          style="background:var(--bg3);border-radius:8px;padding:12px 16px;margin-bottom:8px;text-align:left;font-size:0.9rem"
        >
          <em>"{{ q.text }}"</em>
          <div style="color:var(--accent2);font-size:0.82rem;margin-top:4px">— {{ q.author }}</div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Quote { text: string; author: string; category: string }

const QUOTES: Quote[] = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'Motivation' },
  { text: "In the middle of every difficulty lies opportunity.", author: 'Albert Einstein', category: 'Wisdom' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', category: 'Wisdom' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'Life' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'Motivation' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', category: 'Design' },
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', author: 'Arthur C. Clarke', category: 'Technology' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson', category: 'Programming' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson', category: 'Programming' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds', category: 'Programming' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb', category: 'Wisdom' },
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde', category: 'Life' },
  { text: 'Two roads diverged in a wood, and I took the one less traveled by.', author: 'Robert Frost', category: 'Life' },
  { text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison', category: 'Motivation' },
  { text: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford', category: 'Motivation' },
]

const idx       = ref(Math.floor(Math.random() * QUOTES.length))
const fading    = ref(false)
const copied    = ref(false)
const favorites = ref<Quote[]>([])

const current = computed(() => QUOTES[idx.value])
const isFav   = computed(() => favorites.value.some(q => q.text === current.value.text))

function next() {
  fading.value = true
  setTimeout(() => {
    let n: number
    do { n = Math.floor(Math.random() * QUOTES.length) } while (n === idx.value)
    idx.value = n
    fading.value = false
  }, 300)
}

function copy() {
  navigator.clipboard.writeText(`"${current.value.text}" — ${current.value.author}`)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

function toggleFav() {
  if (isFav.value) favorites.value = favorites.value.filter(q => q.text !== current.value.text)
  else favorites.value.unshift(current.value)
}
</script>
