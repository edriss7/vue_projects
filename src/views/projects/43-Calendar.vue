<template>
  <ProjectLayout title="Monthly Calendar">
    <div class="card">
      <!-- Header -->
      <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:20px">
        <button class="btn btn-secondary btn-sm" @click="prevMonth">‹</button>
        <h3 style="font-size:1.2rem;font-weight:700">{{ monthLabel }}</h3>
        <button class="btn btn-secondary btn-sm" @click="nextMonth">›</button>
      </div>

      <!-- Day names -->
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">
        <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d"
          style="text-align:center;font-size:0.75rem;font-weight:700;color:var(--text2);padding:4px">
          {{ d }}
        </div>
      </div>

      <!-- Days -->
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
        <div v-for="cell in cells" :key="cell.key"
          @click="cell.day ? selectDay(cell.key) : null"
          :style="{
            minHeight:'48px', borderRadius:'8px', padding:'6px', cursor: cell.day ? 'pointer' : 'default',
            background: selected === cell.key ? 'var(--accent)' : isToday(cell.key) ? 'rgba(99,102,241,0.15)' : cell.day ? 'var(--bg3)' : 'transparent',
            border: isToday(cell.key) ? '2px solid var(--accent2)' : '2px solid transparent',
            transition:'all 0.15s',
          }"
        >
          <div v-if="cell.day" style="font-size:0.88rem;font-weight:600">{{ cell.day }}</div>
          <div v-if="events[cell.key]?.length">
            <div v-for="ev in events[cell.key]" :key="ev.id"
              style="background:var(--green);border-radius:3px;padding:1px 4px;font-size:0.7rem;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              {{ ev.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Add Event -->
      <div v-if="selected" class="mt">
        <div class="divider" />
        <h4 style="margin-bottom:10px">{{ selectedLabel }}</h4>
        <div v-if="events[selected]?.length" style="margin-bottom:10px">
          <div v-for="ev in events[selected]" :key="ev.id"
            class="row" style="justify-content:space-between;padding:6px 10px;background:var(--bg3);border-radius:6px;margin-bottom:4px">
            <span style="font-size:0.9rem">{{ ev.title }}</span>
            <button class="btn btn-sm btn-danger" @click="removeEvent(ev.id)">✕</button>
          </div>
        </div>
        <div class="row" style="gap:8px">
          <input v-model="newEvent" class="input" placeholder="Add event…" @keyup.enter="addEvent" />
          <button class="btn btn-primary" @click="addEvent">Add</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Event { id: number; title: string }

const now      = new Date()
const year     = ref(now.getFullYear())
const month    = ref(now.getMonth())
const selected = ref('')
const newEvent = ref('')
const events   = ref<Record<string, Event[]>>({})

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const monthLabel   = computed(() => `${MONTHS[month.value]} ${year.value}`)
const selectedLabel= computed(() => {
  if (!selected.value) return ''
  const d = new Date(selected.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
})

const cells = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const last  = new Date(year.value, month.value + 1, 0)
  const out: { key: string; day: number | null }[] = []
  for (let i = 0; i < first.getDay(); i++) out.push({ key: `empty-${i}`, day: null })
  for (let d = 1; d <= last.getDate(); d++) {
    const key = `${year.value}-${String(month.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    out.push({ key, day: d })
  }
  return out
})

function isToday(key: string) {
  return key === now.toISOString().split('T')[0]
}

function selectDay(key: string) { selected.value = key }
function prevMonth() { if (month.value === 0) { month.value = 11; year.value-- } else month.value-- }
function nextMonth() { if (month.value === 11) { month.value = 0; year.value++ } else month.value++ }

function addEvent() {
  const t = newEvent.value.trim()
  if (!t || !selected.value) return
  if (!events.value[selected.value]) events.value[selected.value] = []
  events.value[selected.value].push({ id: Date.now(), title: t })
  newEvent.value = ''
}

function removeEvent(id: number) {
  for (const key of Object.keys(events.value)) {
    events.value[key] = events.value[key].filter(e => e.id !== id)
  }
}

// seed a couple events
const todayKey = now.toISOString().split('T')[0]
events.value[todayKey] = [{ id: 1, title: '🎯 Today!' }]
selected.value = todayKey
</script>
