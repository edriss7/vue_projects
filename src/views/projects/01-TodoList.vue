<template>
  <ProjectLayout title="Todo List">
    <div class="card">
      <div class="row">
        <input
          v-model="newText"
          class="input"
          placeholder="Add a new task…"
          @keyup.enter="addTodo"
        />
        <button class="btn btn-primary" style="white-space:nowrap" @click="addTodo">Add</button>
      </div>

      <div class="row mt2" style="gap:8px">
        <button
          v-for="f in filters"
          :key="f"
          class="btn btn-sm"
          :class="filter === f ? 'btn-primary' : 'btn-secondary'"
          @click="filter = f"
        >{{ f }}</button>
        <span style="margin-left:auto;color:var(--text2);font-size:0.85rem">
          {{ remaining }} remaining
        </span>
      </div>

      <ul class="todo-list">
        <li
          v-for="todo in filtered"
          :key="todo.id"
          class="todo-item"
          :class="{ done: todo.done }"
        >
          <input type="checkbox" v-model="todo.done" @change="save" />
          <span>{{ todo.text }}</span>
          <button class="btn btn-sm btn-danger" @click="remove(todo.id)">✕</button>
        </li>
        <li v-if="filtered.length === 0" style="color:var(--text2);padding:12px 0;text-align:center">
          No tasks here.
        </li>
      </ul>

      <div class="divider" />
      <button class="btn btn-secondary btn-sm" @click="clearDone">Clear completed</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Todo { id: number; text: string; done: boolean }

const STORAGE_KEY = 'vue-todo-list'
const saved = localStorage.getItem(STORAGE_KEY)
const todos = ref<Todo[]>(saved ? JSON.parse(saved) : [
  { id: 1, text: 'Build a Vue project', done: true },
  { id: 2, text: 'Learn TypeScript', done: false },
  { id: 3, text: 'Ship something awesome', done: false },
])

const newText = ref('')
type Filter = 'All' | 'Active' | 'Done'
const filter = ref<Filter>('All')
const filters: Filter[] = ['All', 'Active', 'Done']

const filtered = computed(() => {
  if (filter.value === 'Active') return todos.value.filter(t => !t.done)
  if (filter.value === 'Done')   return todos.value.filter(t => t.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter(t => !t.done).length)

function addTodo() {
  const text = newText.value.trim()
  if (!text) return
  todos.value.push({ id: Date.now(), text, done: false })
  newText.value = ''
  save()
}

function remove(id: number) {
  todos.value = todos.value.filter(t => t.id !== id)
  save()
}

function clearDone() {
  todos.value = todos.value.filter(t => !t.done)
  save()
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

watch(todos, save, { deep: true })
</script>
