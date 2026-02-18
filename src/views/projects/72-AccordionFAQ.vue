<template>
  <ProjectLayout title="Accordion FAQ">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <input v-model="search" class="input" placeholder="Search questions…" style="flex:1" />
        <button class="btn btn-secondary btn-sm" @click="expandAll = !expandAll; openAll(expandAll)">
          {{ expandAll ? 'Collapse All' : 'Expand All' }}
        </button>
      </div>

      <div v-if="!filtered.length" style="color:var(--text2);text-align:center;padding:24px">No results found</div>

      <div v-for="(item, i) in filtered" :key="item.q"
        style="border:1px solid var(--bg3);border-radius:8px;overflow:hidden;margin-bottom:8px">
        <button
          @click="toggle(item.q)"
          style="width:100%;text-align:left;padding:14px 16px;background:var(--bg3);border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px;color:var(--text)">
          <span style="font-weight:600;font-size:0.9rem">{{ item.q }}</span>
          <span style="transition:transform 0.25s;font-size:0.75rem;flex-shrink:0"
            :style="open.has(item.q) ? { transform: 'rotate(180deg)' } : {}">▼</span>
        </button>
        <div v-show="open.has(item.q)"
          style="padding:14px 16px;font-size:0.88rem;line-height:1.7;color:var(--text2);background:var(--bg)">
          {{ item.a }}
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const search    = ref('')
const expandAll = ref(false)
const open      = ref(new Set<string>())

const faqs = [
  { q: 'What is Vue.js?',            a: 'Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable and focuses on the view layer.' },
  { q: 'What is the Composition API?', a: 'The Composition API is a set of additive, function-based APIs that allow flexible composition of component logic using reactive primitives like ref, computed, and watch.' },
  { q: 'What is reactivity in Vue?',  a: 'Reactivity means Vue tracks which data properties a component uses and automatically re-renders when those properties change, keeping the UI in sync with data.' },
  { q: 'How does Vue Router work?',   a: 'Vue Router maps URLs to components. When the URL changes, the matched component renders inside a <RouterView>. It supports nested routes, lazy loading, and navigation guards.' },
  { q: 'What is Pinia?',              a: 'Pinia is the official state management library for Vue 3. It provides a simple store with full TypeScript support and devtools integration, replacing Vuex.' },
  { q: 'What is Vite?',               a: 'Vite is a next-generation front-end tooling system that leverages native ES modules. It provides instant server start, lightning-fast HMR, and optimized production builds.' },
  { q: 'How do I pass data to a child component?', a: 'Use props. Define props in the child with defineProps() and pass them from the parent using :propName="value" in the template.' },
  { q: 'How do I emit events from a child?', a: 'Use defineEmits() to declare events, then call emit("event-name", payload) in the child. The parent listens with @event-name="handler".' },
  { q: 'What is v-model?',            a: 'v-model is a two-way binding directive. On inputs it binds value + listens to input events. On components it is shorthand for :modelValue + @update:modelValue.' },
  { q: 'When should I use ref vs reactive?', a: 'Use ref for primitive values and single objects you may reassign. Use reactive for nested objects when you want automatic deep reactivity without .value.' },
]

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
})

function toggle(q: string) {
  if (open.value.has(q)) open.value.delete(q)
  else open.value.add(q)
  open.value = new Set(open.value)
}

function openAll(all: boolean) {
  open.value = all ? new Set(faqs.map(f => f.q)) : new Set()
}
</script>
