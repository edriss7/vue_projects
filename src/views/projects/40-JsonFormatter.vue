<template>
  <ProjectLayout title="JSON Formatter">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm"   @click="format">Format</button>
        <button class="btn btn-secondary btn-sm" @click="minify">Minify</button>
        <button class="btn btn-secondary btn-sm" @click="sort">Sort Keys</button>
        <button class="btn btn-secondary btn-sm" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        <button class="btn btn-secondary btn-sm" @click="clear">Clear</button>
        <span v-if="error" class="msg msg-error" style="padding:4px 10px;margin:0">{{ error }}</span>
        <span v-if="info"  class="msg msg-success" style="padding:4px 10px;margin:0">{{ info }}</span>
      </div>

      <div class="md-editor" style="gap:16px">
        <div class="col">
          <label class="label">Input JSON</label>
          <textarea v-model="input" class="input" style="min-height:300px;font-family:monospace;font-size:0.85rem" spellcheck="false" @input="validate" />
        </div>
        <div class="col">
          <label class="label">Output</label>
          <div style="background:var(--bg);border-radius:8px;padding:14px;font-family:monospace;font-size:0.85rem;min-height:300px;white-space:pre;overflow:auto;line-height:1.6" v-html="outputHtml" />
        </div>
      </div>

      <div v-if="stats" class="stat-grid mt">
        <div class="stat-box"><div class="val">{{ stats.keys }}</div><div class="lbl">Keys</div></div>
        <div class="stat-box"><div class="val">{{ stats.depth }}</div><div class="lbl">Depth</div></div>
        <div class="stat-box"><div class="val">{{ stats.size }}</div><div class="lbl">Bytes</div></div>
        <div class="stat-box"><div class="val">{{ stats.arrays }}</div><div class="lbl">Arrays</div></div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const DEFAULT = `{
  "name": "vue-projects",
  "version": "1.0.0",
  "features": ["TypeScript", "Vite", "Vue Router"],
  "meta": {
    "author": "You",
    "projects": 80,
    "awesome": true
  }
}`

const input  = ref(DEFAULT)
const output = ref('')
const error  = ref('')
const info   = ref('')
const copied = ref(false)

function validate() {
  error.value = ''
  try { JSON.parse(input.value) } catch (e: unknown) { error.value = (e as Error).message }
}

function format() {
  error.value = ''; info.value = ''
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
    info.value   = 'Formatted ✓'
    setTimeout(() => info.value = '', 2000)
  } catch (e: unknown) { error.value = (e as Error).message }
}

function minify() {
  error.value = ''; info.value = ''
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
    info.value   = 'Minified ✓'
    setTimeout(() => info.value = '', 2000)
  } catch (e: unknown) { error.value = (e as Error).message }
}

function sort() {
  error.value = ''
  try {
    const parsed  = JSON.parse(input.value)
    const sortObj = (o: unknown): unknown => {
      if (Array.isArray(o))         return o.map(sortObj)
      if (o && typeof o === 'object') {
        return Object.fromEntries(
          Object.entries(o as Record<string, unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => [k, sortObj(v)])
        )
      }
      return o
    }
    output.value = JSON.stringify(sortObj(parsed), null, 2)
  } catch (e: unknown) { error.value = (e as Error).message }
}

function clear() { input.value = ''; output.value = ''; error.value = '' }

function copy() {
  navigator.clipboard.writeText(output.value || input.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

// Syntax highlighting
const outputHtml = computed(() => {
  if (!output.value) return '<span style="color:var(--text2)">Output appears here</span>'
  return output.value
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"([^"]+)":/g, '<span style="color:#f59e0b">"$1"</span>:')
    .replace(/: "([^"]*)"(,?)/g, ': <span style="color:#10b981">"$1"</span>$2')
    .replace(/: (true|false)/g, ': <span style="color:#818cf8">$1</span>')
    .replace(/: (null)/g, ': <span style="color:#ef4444">$1</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span style="color:#38bdf8">$1</span>')
})

const stats = computed(() => {
  try {
    const src = output.value || input.value
    if (!src.trim()) return null
    const parsed = JSON.parse(src)
    let keys = 0, arrays = 0, depth = 0
    function walk(o: unknown, d: number) {
      depth = Math.max(depth, d)
      if (Array.isArray(o)) { arrays++; o.forEach(v => walk(v, d+1)) }
      else if (o && typeof o === 'object') {
        for (const v of Object.values(o as Record<string,unknown>)) { keys++; walk(v, d+1) }
      }
    }
    walk(parsed, 0)
    return { keys, arrays, depth, size: new TextEncoder().encode(src).length }
  } catch { return null }
})

format()
</script>
