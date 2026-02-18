<template>
  <ProjectLayout title="Habit Tracker">
    <div class="card">
      <div class="row" style="gap:10px;margin-bottom:20px">
        <input v-model="newHabit" class="input" placeholder="New habit (e.g. Read 30 mins)" @keyup.enter="add" />
        <button class="btn btn-primary" @click="add">Add</button>
      </div>

      <div v-for="habit in habits" :key="habit.id" style="margin-bottom:20px">
        <div class="row" style="justify-content:space-between;margin-bottom:8px">
          <div>
            <span style="font-weight:700">{{ habit.emoji }} {{ habit.name }}</span>
            <span class="badge badge-yellow" style="margin-left:8px">🔥 {{ streak(habit) }} day streak</span>
          </div>
          <button class="btn btn-sm btn-danger" @click="remove(habit.id)">✕</button>
        </div>

        <!-- Last 7 days -->
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <div
            v-for="day in last7()"
            :key="day.key"
            :title="day.label"
            @click="toggle(habit.id, day.key)"
            style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer"
          >
            <div style="font-size:0.7rem;color:var(--text2)">{{ day.short }}</div>
            <div
              style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:all 0.15s"
              :style="{
                background: habit.done.includes(day.key) ? 'var(--green)' : 'var(--bg3)',
                border: day.key === todayKey ? '2px solid var(--accent2)' : '2px solid transparent',
              }"
            >{{ habit.done.includes(day.key) ? '✓' : '' }}</div>
          </div>
        </div>

        <div class="progress-bar mt2">
          <div class="progress-fill" :style="{ width: (weekPct(habit)) + '%' }" />
        </div>
        <div style="color:var(--text2);font-size:0.78rem;margin-top:4px">{{ weekPct(habit) }}% this week</div>
      </div>

      <div v-if="habits.length === 0" style="color:var(--text2);text-align:center;padding:32px 0">
        Add your first habit above!
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Habit { id: number; name: string; emoji: string; done: string[] }

const EMOJIS = ['💪','📚','🏃','🧘','💧','🥗','😴','✍️','🎯','🎸']
const STORAGE = 'vue-habits'
const saved = localStorage.getItem(STORAGE)
const habits = ref<Habit[]>(saved ? JSON.parse(saved) : [
  { id: 1, name: 'Morning run',   emoji: '🏃', done: [] },
  { id: 2, name: 'Read 30 mins',  emoji: '📚', done: [] },
  { id: 3, name: 'Drink 2L water',emoji: '💧', done: [] },
])
const newHabit = ref('')

const todayKey = new Date().toISOString().split('T')[0]

function last7() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return {
      key: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      short: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
    }
  })
}

function toggle(id: number, day: string) {
  const h = habits.value.find(h => h.id === id)!
  if (h.done.includes(day)) h.done = h.done.filter(d => d !== day)
  else h.done.push(day)
}

function streak(h: Habit) {
  let count = 0; const d = new Date()
  while (true) {
    const key = d.toISOString().split('T')[0]
    if (!h.done.includes(key)) break
    count++; d.setDate(d.getDate() - 1)
  }
  return count
}

function weekPct(h: Habit) {
  const keys = last7().map(d => d.key)
  return Math.round(h.done.filter(d => keys.includes(d)).length / 7 * 100)
}

function add() {
  const name = newHabit.value.trim()
  if (!name) return
  habits.value.push({ id: Date.now(), name, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], done: [] })
  newHabit.value = ''
}

function remove(id: number) { habits.value = habits.value.filter(h => h.id !== id) }

watch(habits, v => localStorage.setItem(STORAGE, JSON.stringify(v)), { deep: true })
</script>
