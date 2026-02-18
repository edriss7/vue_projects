<template>
  <ProjectLayout title="Kanban Board">
    <div class="card">
      <!-- Add task -->
      <div class="row" style="gap:10px;margin-bottom:20px;flex-wrap:wrap">
        <input v-model="newTask" class="input" style="flex:1;min-width:200px" placeholder="New task…" @keyup.enter="addTask" />
        <select v-model="newCol" class="input" style="width:160px">
          <option v-for="c in cols" :key="c.key" :value="c.key">{{ c.label }}</option>
        </select>
        <button class="btn btn-primary" @click="addTask">Add</button>
      </div>

      <div class="kanban">
        <div v-for="col in cols" :key="col.key" class="kanban-col">
          <h3 :style="{ color: col.color }">
            {{ col.icon }} {{ col.label }}
            <span class="badge" :style="{ background: col.color + '22', color: col.color, marginLeft:'6px' }">
              {{ tasks.filter(t => t.col === col.key).length }}
            </span>
          </h3>

          <div
            v-for="task in tasks.filter(t => t.col === col.key)"
            :key="task.id"
            class="kanban-card"
          >
            <span>{{ task.text }}</span>
            <div style="display:flex;gap:4px;flex-shrink:0">
              <button class="k-move-btn" v-if="col.key !== 'todo'"        title="Move left"  @click="move(task.id, -1)">←</button>
              <button class="k-move-btn" v-if="col.key !== 'done'"        title="Move right" @click="move(task.id, +1)">→</button>
              <button class="k-move-btn" style="color:var(--red)"         title="Delete"     @click="remove(task.id)">✕</button>
            </div>
          </div>

          <div v-if="tasks.filter(t => t.col === col.key).length === 0"
            style="color:var(--text2);font-size:0.85rem;text-align:center;padding:16px 0">
            Drop tasks here
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type ColKey = 'todo' | 'progress' | 'done'

interface Task { id: number; text: string; col: ColKey }

const cols = [
  { key: 'todo'     as ColKey, label: 'To Do',       icon: '📋', color: 'var(--text2)'  },
  { key: 'progress' as ColKey, label: 'In Progress',  icon: '⚙️',  color: 'var(--yellow)' },
  { key: 'done'     as ColKey, label: 'Done',         icon: '✅',  color: 'var(--green)'  },
]

const colOrder: ColKey[] = ['todo', 'progress', 'done']

const tasks = ref<Task[]>([
  { id: 1, text: 'Design wireframes',            col: 'done'     },
  { id: 2, text: 'Set up Vue project',           col: 'done'     },
  { id: 3, text: 'Implement routing',            col: 'progress' },
  { id: 4, text: 'Build component library',      col: 'progress' },
  { id: 5, text: 'Write unit tests',             col: 'todo'     },
  { id: 6, text: 'Deploy to production',         col: 'todo'     },
  { id: 7, text: 'Write documentation',          col: 'todo'     },
])

const newTask = ref('')
const newCol  = ref<ColKey>('todo')

function addTask() {
  const text = newTask.value.trim()
  if (!text) return
  tasks.value.push({ id: Date.now(), text, col: newCol.value })
  newTask.value = ''
}

function remove(id: number) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function move(id: number, dir: 1 | -1) {
  const task = tasks.value.find(t => t.id === id)
  if (!task) return
  const idx = colOrder.indexOf(task.col)
  const next = idx + dir
  if (next >= 0 && next < colOrder.length) task.col = colOrder[next]
}
</script>
