<template>
  <ProjectLayout title="Poll Creator">
    <div class="card">
      <div v-if="!voted">
        <h3 style="margin-bottom:16px">{{ question }}</h3>
        <div v-for="opt in options" :key="opt.id" style="margin-bottom:8px">
          <button
            class="quiz-option"
            :class="{ correct: selected === opt.id }"
            @click="selected = opt.id"
          >{{ opt.text }}</button>
        </div>
        <button class="btn btn-primary mt2" :disabled="selected === null" @click="vote">Vote</button>
      </div>

      <div v-else>
        <h3 style="margin-bottom:16px">{{ question }}</h3>
        <div v-for="opt in options" :key="opt.id" style="margin-bottom:12px">
          <div class="row" style="justify-content:space-between;margin-bottom:4px">
            <span :style="{ fontWeight: opt.id === selected ? 700 : 400 }">
              {{ opt.id === selected ? '✓ ' : '' }}{{ opt.text }}
            </span>
            <span style="color:var(--text2);font-size:0.85rem">{{ opt.votes }} vote{{ opt.votes !== 1 ? 's' : '' }} ({{ pct(opt.id) }}%)</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: pct(opt.id) + '%', background: opt.id === selected ? 'var(--green)' : 'var(--accent)' }" />
          </div>
        </div>
        <div style="color:var(--text2);font-size:0.85rem;margin-top:12px">{{ totalVotes }} total vote{{ totalVotes !== 1 ? 's' : '' }}</div>
        <button class="btn btn-secondary btn-sm mt" @click="reset">Reset Poll</button>
      </div>

      <div class="divider" />
      <h4 style="margin-bottom:12px">Create Your Own Poll</h4>
      <div class="col" style="gap:10px">
        <input v-model="newQ" class="input" placeholder="Question…" />
        <div v-for="(opt, i) in newOpts" :key="i" class="row" style="gap:8px">
          <input v-model="newOpts[i]" class="input" :placeholder="`Option ${i+1}`" />
          <button v-if="newOpts.length > 2" class="btn btn-sm btn-danger" @click="newOpts.splice(i,1)">✕</button>
        </div>
        <button class="btn btn-secondary btn-sm" style="align-self:flex-start" @click="newOpts.push('')">+ Add Option</button>
        <button class="btn btn-primary" style="align-self:flex-start" @click="createPoll">Create Poll</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Option { id: number; text: string; votes: number }

const question = ref('What is your favourite JavaScript framework?')
const options  = ref<Option[]>([
  { id: 1, text: 'Vue.js',     votes: 0 },
  { id: 2, text: 'React',      votes: 0 },
  { id: 3, text: 'Angular',    votes: 0 },
  { id: 4, text: 'Svelte',     votes: 0 },
])
const selected   = ref<number | null>(null)
const voted      = ref(false)
const totalVotes = computed(() => options.value.reduce((s, o) => s + o.votes, 0))

const newQ    = ref('')
const newOpts = ref(['', ''])

function pct(id: number) {
  if (!totalVotes.value) return 0
  return Math.round((options.value.find(o => o.id === id)!.votes / totalVotes.value) * 100)
}

function vote() {
  if (selected.value === null) return
  options.value.find(o => o.id === selected.value)!.votes++
  voted.value = true
}

function reset() { options.value.forEach(o => o.votes = 0); voted.value = false; selected.value = null }

function createPoll() {
  const q = newQ.value.trim()
  const opts = newOpts.value.filter(o => o.trim())
  if (!q || opts.length < 2) return
  question.value = q
  options.value  = opts.map((text, i) => ({ id: i + 1, text, votes: 0 }))
  voted.value    = false; selected.value = null
  newQ.value = ''; newOpts.value = ['', '']
}
</script>
