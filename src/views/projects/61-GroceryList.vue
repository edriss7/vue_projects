<template>
  <ProjectLayout title="Grocery List">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <input v-model="newItem" class="input" placeholder="Add item…" @keyup.enter="add" style="flex:1" />
        <select v-model="newCat" class="input" style="width:130px">
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <button class="btn btn-primary" @click="add">Add</button>
      </div>

      <div v-if="!items.length" style="color:var(--text2);text-align:center;padding:24px">List is empty</div>

      <div v-for="cat in usedCategories" :key="cat" class="mt">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">
          {{ cat }}
        </div>
        <div v-for="item in itemsByCategory(cat)" :key="item.id"
          style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg3);border-radius:6px;margin-bottom:4px"
          :style="item.done ? 'opacity:0.5' : ''">
          <input type="checkbox" v-model="item.done" style="width:16px;height:16px;accent-color:var(--accent);cursor:pointer" />
          <span style="flex:1;font-size:0.9rem" :style="item.done ? 'text-decoration:line-through' : ''">{{ item.name }}</span>
          <button class="btn btn-sm btn-danger" @click="remove(item.id)">✕</button>
        </div>
      </div>

      <div v-if="items.length" class="row" style="gap:8px;margin-top:16px;justify-content:space-between;align-items:center">
        <span style="font-size:0.85rem;color:var(--text2)">{{ doneCount }}/{{ items.length }} checked</span>
        <div class="row" style="gap:8px">
          <button class="btn btn-sm btn-secondary" @click="clearDone">Clear done</button>
          <button class="btn btn-sm btn-danger" @click="items=[]">Clear all</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Item { id: number; name: string; cat: string; done: boolean }

const categories = ['Produce','Dairy','Meat','Bakery','Frozen','Beverages','Snacks','Other']
const newItem = ref('')
const newCat  = ref('Produce')
const items   = ref<Item[]>([
  { id: 1, name: 'Apples', cat: 'Produce', done: false },
  { id: 2, name: 'Milk', cat: 'Dairy', done: false },
  { id: 3, name: 'Bread', cat: 'Bakery', done: false },
])
let nextId = 4

const usedCategories = computed(() =>
  categories.filter(c => items.value.some(i => i.cat === c))
)
const doneCount = computed(() => items.value.filter(i => i.done).length)

function itemsByCategory(cat: string) {
  return items.value.filter(i => i.cat === cat)
}

function add() {
  const name = newItem.value.trim()
  if (!name) return
  items.value.push({ id: nextId++, name, cat: newCat.value, done: false })
  newItem.value = ''
}

function remove(id: number) {
  items.value = items.value.filter(i => i.id !== id)
}

function clearDone() {
  items.value = items.value.filter(i => !i.done)
}
</script>
