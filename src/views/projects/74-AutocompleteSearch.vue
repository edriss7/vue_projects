<template>
  <ProjectLayout title="Autocomplete Search">
    <div class="card">
      <!-- Search box -->
      <div style="position:relative;margin-bottom:8px" ref="wrapperRef">
        <input
          v-model="query"
          class="input"
          placeholder="Search programming languages…"
          @input="onInput"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter="select(highlighted)"
          @keydown.escape="close"
          @focus="onInput"
          autocomplete="off"
          style="padding-right:36px"
        />
        <span v-if="query" @click="clear"
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--text2)">✕</span>

        <!-- Dropdown -->
        <div v-if="showDropdown && suggestions.length"
          style="position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--bg2);border:1px solid var(--bg3);border-radius:8px;z-index:50;overflow:hidden;max-height:240px;overflow-y:auto">
          <div v-for="(s, i) in suggestions" :key="s.name"
            @mousedown.prevent="select(i)"
            style="padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;font-size:0.88rem"
            :style="{ background: i === highlighted ? 'var(--bg3)' : 'transparent' }">
            <span :style="{ color: s.color, fontSize:'1.1rem' }">{{ s.icon }}</span>
            <div>
              <div v-html="highlight(s.name)" />
              <div style="font-size:0.75rem;color:var(--text2)">{{ s.type }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected chips -->
      <div class="row" style="flex-wrap:wrap;gap:6px;min-height:28px">
        <span v-for="tag in selected" :key="tag"
          style="display:flex;align-items:center;gap:6px;padding:4px 10px;background:var(--accent);color:#fff;border-radius:20px;font-size:0.82rem">
          {{ tag }}
          <span @click="deselect(tag)" style="cursor:pointer;opacity:0.8">✕</span>
        </span>
        <span v-if="!selected.length" style="color:var(--text2);font-size:0.85rem">No items selected</span>
      </div>

      <div class="divider" />
      <div style="font-size:0.82rem;color:var(--text2)">{{ items.length }} languages available · Click to add · Esc/click outside to close</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Lang { name: string; type: string; icon: string; color: string }

const items: Lang[] = [
  { name:'JavaScript', type:'Scripting',    icon:'🟨', color:'#f7df1e' },
  { name:'TypeScript', type:'Typed JS',     icon:'🔷', color:'#3178c6' },
  { name:'Python',     type:'General',      icon:'🐍', color:'#3776ab' },
  { name:'Rust',       type:'Systems',      icon:'🦀', color:'#ce422b' },
  { name:'Go',         type:'Systems',      icon:'🐹', color:'#00add8' },
  { name:'Java',       type:'OOP',          icon:'☕', color:'#f89820' },
  { name:'C++',        type:'Systems',      icon:'⚙️', color:'#00599c' },
  { name:'C#',         type:'OOP',          icon:'💜', color:'#9b4f96' },
  { name:'Ruby',       type:'Scripting',    icon:'💎', color:'#cc342d' },
  { name:'Swift',      type:'iOS/macOS',    icon:'🍎', color:'#fa7343' },
  { name:'Kotlin',     type:'JVM',          icon:'🎯', color:'#7f52ff' },
  { name:'PHP',        type:'Web',          icon:'🐘', color:'#777bb4' },
  { name:'Dart',       type:'Mobile/Web',   icon:'🎯', color:'#0175c2' },
  { name:'Scala',      type:'JVM/FP',       icon:'🔴', color:'#dc322f' },
  { name:'Haskell',    type:'Functional',   icon:'λ', color:'#5e5086' },
  { name:'Elixir',     type:'Functional',   icon:'💧', color:'#6e4a7e' },
  { name:'R',          type:'Statistics',   icon:'📊', color:'#276dc3' },
  { name:'MATLAB',     type:'Numerical',    icon:'📐', color:'#0076a8' },
  { name:'Lua',        type:'Embedded',     icon:'🌙', color:'#2c2d72' },
  { name:'Zig',        type:'Systems',      icon:'⚡', color:'#f7a41d' },
]

const query       = ref('')
const selected    = ref<string[]>([])
const highlighted = ref(-1)
const showDropdown= ref(false)

const suggestions = computed(() => {
  if (!query.value.trim()) return items.filter(i => !selected.value.includes(i.name)).slice(0, 8)
  const q = query.value.toLowerCase()
  return items.filter(i => !selected.value.includes(i.name) && i.name.toLowerCase().includes(q))
})

function highlight(name: string) {
  if (!query.value) return name
  const q = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return name.replace(new RegExp(`(${q})`, 'gi'), '<mark style="background:var(--accent);color:#fff;border-radius:2px">$1</mark>')
}

function onInput() { showDropdown.value = true; highlighted.value = -1 }
function move(dir: number) {
  highlighted.value = Math.max(-1, Math.min(suggestions.value.length - 1, highlighted.value + dir))
}
function select(i: number) {
  const s = suggestions.value[i] ?? suggestions.value[0]
  if (!s) return
  if (!selected.value.includes(s.name)) selected.value.push(s.name)
  query.value = ''; showDropdown.value = false; highlighted.value = -1
}
function deselect(name: string) { selected.value = selected.value.filter(s => s !== name) }
function close() { showDropdown.value = false }
function clear() { query.value = ''; showDropdown.value = false }
</script>
