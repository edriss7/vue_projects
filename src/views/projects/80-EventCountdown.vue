<template>
  <ProjectLayout title="Event Countdown">
    <div class="card">
      <!-- Add event -->
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px;margin-bottom:8px">
        <input v-model="newName" class="input" placeholder="Event name…" @keyup.enter="addEvent" />
        <button class="btn btn-primary" @click="addEvent">Add</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        <input v-model="newDate" class="input" type="date" />
        <input v-model="newTime" class="input" type="time" />
      </div>

      <!-- Events list -->
      <div v-if="!events.length" style="color:var(--text2);text-align:center;padding:24px">No events yet</div>

      <div v-for="ev in sorted" :key="ev.id"
        style="border-radius:10px;padding:16px;margin-bottom:10px;position:relative;overflow:hidden"
        :style="{ background: ev.past ? 'var(--bg3)' : 'linear-gradient(135deg,' + ev.color + '22,' + ev.color + '08)', border: '1px solid ' + ev.color + '44' }">

        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div style="font-weight:700;font-size:1rem">{{ ev.name }}</div>
          <button class="btn btn-sm btn-danger" @click="remove(ev.id)" style="flex-shrink:0">✕</button>
        </div>

        <div style="font-size:0.78rem;color:var(--text2);margin-bottom:10px">
          {{ ev.dateLabel }}
        </div>

        <div v-if="ev.past" style="color:var(--text2);font-style:italic;font-size:0.88rem">Event has passed</div>
        <div v-else style="display:flex;gap:12px;flex-wrap:wrap">
          <div v-for="unit in ev.units" :key="unit.label"
            style="display:flex;flex-direction:column;align-items:center;min-width:48px">
            <div style="font-size:1.8rem;font-weight:800;font-variant-numeric:tabular-nums"
              :style="{ color: ev.color }">{{ unit.value }}</div>
            <div style="font-size:0.7rem;color:var(--text2);text-transform:uppercase">{{ unit.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Event {
  id: number; name: string; target: Date; color: string
  past: boolean; dateLabel: string
  units: { label: string; value: string }[]
}

const COLORS = ['#6366f1','#22c55e','#f97316','#ec4899','#06b6d4','#eab308','#8b5cf6','#ef4444']

const newName = ref('')
const newDate = ref('')
const newTime = ref('12:00')
const events  = ref<Event[]>([])
let nextId = 1
let ticker: ReturnType<typeof setInterval>

function addEvent() {
  const name = newName.value.trim()
  if (!name || !newDate.value) return
  const dt = new Date(`${newDate.value}T${newTime.value || '00:00'}`)
  if (isNaN(dt.getTime())) return
  events.value.push({
    id: nextId++, name, target: dt,
    color: COLORS[(nextId - 2) % COLORS.length],
    past: false, dateLabel: '',
    units: [],
  })
  newName.value = ''; newDate.value = ''
  tick()
}

function remove(id: number) {
  events.value = events.value.filter(e => e.id !== id)
}

function tick() {
  const now = Date.now()
  events.value.forEach(ev => {
    const diff = ev.target.getTime() - now
    ev.dateLabel = ev.target.toLocaleString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
    if (diff <= 0) { ev.past = true; ev.units = []; return }
    ev.past = false
    const d  = Math.floor(diff / 86400000)
    const h  = Math.floor((diff % 86400000) / 3600000)
    const m  = Math.floor((diff % 3600000)  / 60000)
    const s  = Math.floor((diff % 60000)    / 1000)
    ev.units = [
      { label: 'Days',    value: String(d).padStart(2,'0') },
      { label: 'Hours',   value: String(h).padStart(2,'0') },
      { label: 'Minutes', value: String(m).padStart(2,'0') },
      { label: 'Seconds', value: String(s).padStart(2,'0') },
    ]
  })
}

const sorted = computed(() =>
  [...events.value].sort((a, b) => {
    if (a.past !== b.past) return a.past ? 1 : -1
    return a.target.getTime() - b.target.getTime()
  })
)

// Pre-populate with some examples
function prefill() {
  const add = (name: string, offsetDays: number) => {
    const d = new Date(); d.setDate(d.getDate() + offsetDays); d.setHours(12, 0, 0, 0)
    events.value.push({ id: nextId++, name, target: d, color: COLORS[(nextId-2) % COLORS.length], past: false, dateLabel: '', units: [] })
  }
  add('New Year 2027', Math.floor((new Date('2027-01-01').getTime() - Date.now()) / 86400000))
  add('Summer Solstice', Math.floor((new Date('2026-06-21').getTime() - Date.now()) / 86400000))
  add('My Birthday', 30)
  tick()
}

onMounted(() => { prefill(); ticker = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(ticker))
</script>
