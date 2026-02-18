<template>
  <ProjectLayout title="Contact Book">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <input v-model="search" class="input" placeholder="Search contacts…" style="flex:1" />
        <button class="btn btn-primary" @click="openNew">+ Add</button>
      </div>

      <div v-if="!filtered.length" style="color:var(--text2);text-align:center;padding:24px">No contacts found</div>

      <div v-for="c in filtered" :key="c.id"
        style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--bg3);border-radius:8px;margin-bottom:6px">
        <div style="width:38px;height:38px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0">
          {{ c.name[0].toUpperCase() }}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:0.9rem">{{ c.name }}</div>
          <div style="font-size:0.8rem;color:var(--text2)">{{ c.phone }}</div>
          <div v-if="c.email" style="font-size:0.78rem;color:var(--text2)">{{ c.email }}</div>
        </div>
        <button class="btn btn-sm btn-secondary" @click="edit(c)">✎</button>
        <button class="btn btn-sm btn-danger" @click="del(c.id)">✕</button>
      </div>

      <!-- Modal -->
      <div v-if="showModal"
        style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100"
        @click.self="showModal=false">
        <div style="background:var(--bg2);border-radius:12px;padding:24px;width:320px;max-width:90vw">
          <h3 style="margin-bottom:16px">{{ form.id ? 'Edit' : 'New' }} Contact</h3>
          <label class="label">Name</label>
          <input v-model="form.name" class="input" placeholder="Full name" />
          <label class="label mt2">Phone</label>
          <input v-model="form.phone" class="input" placeholder="+1 555 000 0000" />
          <label class="label mt2">Email</label>
          <input v-model="form.email" class="input" placeholder="email@example.com" />
          <div class="row" style="gap:8px;margin-top:16px">
            <button class="btn btn-primary" style="flex:1" @click="save">Save</button>
            <button class="btn btn-secondary" @click="showModal=false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Contact { id: number; name: string; phone: string; email: string }

const search    = ref('')
const showModal = ref(false)
const contacts  = ref<Contact[]>([
  { id: 1, name: 'Alice Johnson', phone: '+1 555 010 1234', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith',     phone: '+1 555 020 5678', email: 'bob@example.com' },
  { id: 3, name: 'Carol White',   phone: '+1 555 030 9012', email: '' },
])
const form = ref<Contact>({ id: 0, name: '', phone: '', email: '' })
let nextId = 4

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return contacts.value
    .filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
})

function openNew() {
  form.value = { id: 0, name: '', phone: '', email: '' }
  showModal.value = true
}

function edit(c: Contact) {
  form.value = { ...c }
  showModal.value = true
}

function save() {
  if (!form.value.name.trim()) return
  if (form.value.id) {
    const idx = contacts.value.findIndex(c => c.id === form.value.id)
    if (idx >= 0) contacts.value[idx] = { ...form.value }
  } else {
    contacts.value.push({ ...form.value, id: nextId++ })
  }
  showModal.value = false
}

function del(id: number) {
  contacts.value = contacts.value.filter(c => c.id !== id)
}
</script>
