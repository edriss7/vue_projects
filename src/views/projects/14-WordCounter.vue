<template>
  <ProjectLayout title="Word Counter">
    <div class="card">
      <label class="label">Enter your text</label>
      <textarea v-model="text" class="input" style="min-height:180px" placeholder="Start typing or paste text here…" />

      <div class="stat-grid mt">
        <div class="stat-box">
          <div class="val">{{ words }}</div>
          <div class="lbl">Words</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ chars }}</div>
          <div class="lbl">Characters</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ charsNoSpace }}</div>
          <div class="lbl">No Spaces</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ sentences }}</div>
          <div class="lbl">Sentences</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ paragraphs }}</div>
          <div class="lbl">Paragraphs</div>
        </div>
        <div class="stat-box">
          <div class="val">{{ readTime }}</div>
          <div class="lbl">Read time</div>
        </div>
      </div>

      <div class="divider" />

      <div v-if="topWords.length">
        <label class="label">Top words</label>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          <span v-for="w in topWords" :key="w.word" class="badge badge-blue">
            {{ w.word }} ({{ w.count }})
          </span>
        </div>
      </div>

      <button class="btn btn-secondary btn-sm mt2" @click="text = ''">Clear</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const text = ref('The quick brown fox jumps over the lazy dog. This is a sample paragraph to demonstrate the word counter. Try editing this text to see the statistics update in real time.')

const words       = computed(() => text.value.trim() ? text.value.trim().split(/\s+/).length : 0)
const chars       = computed(() => text.value.length)
const charsNoSpace= computed(() => text.value.replace(/\s/g, '').length)
const sentences   = computed(() => text.value.trim() ? text.value.split(/[.!?]+/).filter(s => s.trim()).length : 0)
const paragraphs  = computed(() => text.value.trim() ? text.value.split(/\n\n+/).filter(p => p.trim()).length : 0)
const readTime    = computed(() => {
  const mins = Math.ceil(words.value / 200)
  return mins < 1 ? '<1 min' : `${mins} min`
})

const STOPWORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','is','it','this','that','i','you','we','they','he','she','was','are','be'])

const topWords = computed(() => {
  if (!text.value.trim()) return []
  const freq: Record<string, number> = {}
  text.value.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).forEach(w => {
    if (w && !STOPWORDS.has(w)) freq[w] = (freq[w] ?? 0) + 1
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }))
})
</script>
