<template>
  <ProjectLayout title="Notes App">
    <div class="card">
      <div class="col">
        <textarea
          v-model="newNote"
          class="input"
          placeholder="Write a note…"
          style="min-height:80px"
          @keydown.ctrl.enter="add"
        />
        <button class="btn btn-primary" style="align-self:flex-end" @click="add">Add Note</button>
      </div>

      <p style="color:var(--text2);font-size:0.85rem;margin-top:4px">Ctrl+Enter to add quickly</p>

      <div v-if="notes.length === 0" class="mt" style="text-align:center;color:var(--text2);padding:40px 0">
        No notes yet. Write something!
      </div>

      <div class="notes-grid">
        <div v-for="note in notes" :key="note.id" class="note-card">
          <button class="note-del" @click="remove(note.id)">✕</button>
          <p>{{ note.text }}</p>
          <div style="font-size:0.72rem;color:var(--text2);margin-top:8px">{{ note.date }}</div>
        </div>
      </div>

      <div v-if="notes.length > 0" class="divider" />
      <div v-if="notes.length > 0" class="row" style="justify-content:space-between;color:var(--text2);font-size:0.85rem">
        <span>{{ notes.length }} note{{ notes.length === 1 ? '' : 's' }}</span>
        <button class="btn btn-sm btn-danger" @click="clearAll">Clear all</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Note { id: number; text: string; date: string }

const STORAGE_KEY = 'vue-notes'
const saved = localStorage.getItem(STORAGE_KEY)
const notes = ref<Note[]>(saved ? JSON.parse(saved) : [
  { id: 1, text: 'Welcome to Notes App! Press Ctrl+Enter to quickly add notes.', date: new Date().toLocaleDateString() },
])

const newNote = ref('')

function add() {
  const text = newNote.value.trim()
  if (!text) return
  notes.value.unshift({
    id: Date.now(),
    text,
    date: new Date().toLocaleString(),
  })
  newNote.value = ''
}

function remove(id: number) {
  notes.value = notes.value.filter(n => n.id !== id)
}

function clearAll() {
  if (confirm('Delete all notes?')) notes.value = []
}

watch(notes, (v) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true })
</script>
