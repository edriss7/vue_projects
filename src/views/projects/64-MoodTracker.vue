<template>
  <ProjectLayout title="Mood Tracker">
    <div class="card">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:0.85rem;color:var(--text2);margin-bottom:8px">How are you feeling today?</div>
        <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
          <button v-for="m in moods" :key="m.label"
            @click="selectedMood = m"
            style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;border-radius:10px;border:2px solid transparent;cursor:pointer;background:var(--bg3);transition:all 0.15s"
            :style="selectedMood?.label === m.label ? { borderColor: m.color, background: m.color + '22' } : {}"
          >
            <span style="font-size:1.8rem">{{ m.emoji }}</span>
            <span style="font-size:0.75rem;color:var(--text2)">{{ m.label }}</span>
          </button>
        </div>
      </div>

      <label class="label">Note (optional)</label>
      <input v-model="note" class="input" placeholder="What's on your mind?" />

      <button class="btn btn-primary mt2" style="width:100%" @click="log" :disabled="!selectedMood">
        Log Mood
      </button>

      <!-- History -->
      <div v-if="entries.length" class="mt">
        <div class="divider" />
        <label class="label">History (last 30 days)</label>

        <!-- Mood chart -->
        <div style="display:flex;align-items:flex-end;gap:3px;height:60px;margin-bottom:12px">
          <div v-for="e in entries.slice().reverse().slice(0,30).reverse()" :key="e.id"
            style="flex:1;border-radius:3px 3px 0 0;min-width:6px;transition:height 0.3s"
            :style="{ height: (e.score * 20) + '%', background: e.color }"
            :title="e.label + ' — ' + e.date"
          />
        </div>

        <div v-for="e in [...entries].reverse()" :key="e.id"
          style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg3);border-radius:6px;margin-bottom:4px">
          <span style="font-size:1.4rem">{{ e.emoji }}</span>
          <div style="flex:1">
            <div style="font-size:0.85rem;font-weight:600">{{ e.label }}</div>
            <div v-if="e.note" style="font-size:0.78rem;color:var(--text2)">{{ e.note }}</div>
          </div>
          <span style="font-size:0.75rem;color:var(--text2)">{{ e.date }}</span>
          <button class="btn btn-sm btn-danger" @click="entries = entries.filter(x=>x.id!==e.id)">✕</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Mood  { emoji: string; label: string; color: string; score: number }
interface Entry { id: number; emoji: string; label: string; color: string; score: number; note: string; date: string }

const moods: Mood[] = [
  { emoji: '😢', label: 'Awful',   color: '#ef4444', score: 1 },
  { emoji: '😞', label: 'Bad',     color: '#f97316', score: 2 },
  { emoji: '😐', label: 'Okay',    color: '#eab308', score: 3 },
  { emoji: '😊', label: 'Good',    color: '#22c55e', score: 4 },
  { emoji: '😄', label: 'Great',   color: '#6366f1', score: 5 },
]

const selectedMood = ref<Mood | null>(null)
const note         = ref('')
const entries      = ref<Entry[]>([])
let nextId = 1

function log() {
  if (!selectedMood.value) return
  const now = new Date()
  entries.value.push({
    id: nextId++,
    ...selectedMood.value,
    note: note.value.trim(),
    date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  })
  note.value = ''
  selectedMood.value = null
}
</script>
