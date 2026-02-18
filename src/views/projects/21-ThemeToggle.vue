<template>
  <ProjectLayout title="Theme Toggle">
    <div :style="themeStyle" style="border-radius:16px;padding:32px;transition:all 0.3s">
      <!-- Toggle switch -->
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:32px">
        <span style="font-size:1.2rem">☀️</span>
        <button
          @click="dark = !dark"
          :style="{
            width:'60px', height:'32px', borderRadius:'999px',
            background: dark ? '#6366f1' : '#cbd5e1',
            border:'none', cursor:'pointer', position:'relative',
            transition:'background 0.3s'
          }"
        >
          <span :style="{
            position:'absolute', top:'4px',
            left: dark ? '30px' : '4px',
            width:'24px', height:'24px', borderRadius:'50%',
            background:'white', transition:'left 0.3s',
            display:'block', boxShadow:'0 1px 4px rgba(0,0,0,0.3)'
          }"/>
        </button>
        <span style="font-size:1.2rem">🌙</span>
      </div>

      <!-- Preview UI -->
      <div :style="cardStyle" style="border-radius:12px;padding:24px;margin-bottom:16px;transition:all 0.3s">
        <div style="font-size:1.2rem;font-weight:700;margin-bottom:8px" :style="{ color: dark ? '#f1f5f9' : '#0f172a' }">
          Sample Card
        </div>
        <p :style="{ color: dark ? '#94a3b8' : '#64748b', fontSize:'0.9rem', marginBottom:'16px' }">
          This card shows how components look in {{ dark ? 'dark' : 'light' }} mode.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button :style="btnPrimary">Primary</button>
          <button :style="btnSecondary">Secondary</button>
        </div>
      </div>

      <!-- Color swatches -->
      <div :style="cardStyle" style="border-radius:12px;padding:24px;transition:all 0.3s">
        <div style="font-size:0.85rem;font-weight:600;margin-bottom:12px" :style="{ color: dark ? '#94a3b8' : '#64748b' }">
          Theme Colors
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <div v-for="c in (dark ? darkColors : lightColors)" :key="c" :style="{ background:c, width:'36px',height:'36px',borderRadius:'8px' }" />
        </div>
      </div>

      <div style="text-align:center;margin-top:20px;font-size:0.9rem" :style="{ color: dark ? '#94a3b8' : '#64748b' }">
        Currently: <strong>{{ dark ? 'Dark' : 'Light' }} Mode</strong>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const dark = ref(true)

const themeStyle   = computed(() => ({ background: dark.value ? '#0f172a' : '#f8fafc' }))
const cardStyle    = computed(() => ({ background: dark.value ? '#1e293b' : '#ffffff', border: `1px solid ${dark.value ? '#334155' : '#e2e8f0'}` }))
const btnPrimary   = computed(() => ({ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }))
const btnSecondary = computed(() => ({ background: dark.value ? '#334155' : '#e2e8f0', color: dark.value ? '#f1f5f9' : '#1e293b', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }))

const darkColors  = ['#6366f1','#818cf8','#10b981','#f59e0b','#ef4444','#0ea5e9','#8b5cf6','#1e293b']
const lightColors = ['#6366f1','#4f46e5','#059669','#d97706','#dc2626','#0284c7','#7c3aed','#f1f5f9']
</script>
