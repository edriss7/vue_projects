<template>
  <ProjectLayout title="Regex Tester">
    <div class="card">
      <!-- Pattern -->
      <div class="row" style="gap:0;margin-bottom:12px">
        <span style="background:var(--bg3);padding:10px 12px;border-radius:8px 0 0 8px;color:var(--text2);font-family:monospace">/</span>
        <input v-model="pattern" class="input" style="border-radius:0;flex:1" placeholder="pattern" @input="run" spellcheck="false" />
        <span style="background:var(--bg3);padding:10px 12px;color:var(--text2);font-family:monospace">/</span>
        <input v-model="flags" class="input" style="border-radius:0 8px 8px 0;width:60px" placeholder="gim" @input="run" spellcheck="false" />
      </div>

      <div v-if="error" class="msg msg-error" style="margin-bottom:12px">⚠️ {{ error }}</div>

      <!-- Test string -->
      <label class="label">Test String</label>
      <textarea v-model="testStr" class="input" style="min-height:100px;font-family:monospace" @input="run" />

      <!-- Results -->
      <div v-if="!error && pattern" class="mt">
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <label class="label" style="margin:0">Highlighted Matches</label>
          <span class="badge" :class="matches.length ? 'badge-green' : 'badge-red'">
            {{ matches.length }} match{{ matches.length !== 1 ? 'es' : '' }}
          </span>
        </div>
        <div
          style="background:var(--bg);border-radius:8px;padding:14px;font-family:monospace;font-size:0.95rem;line-height:1.8;white-space:pre-wrap;word-break:break-all"
          v-html="highlighted"
        />

        <div v-if="matches.length" class="mt">
          <label class="label">Match Details</label>
          <div
            v-for="(m, i) in matches"
            :key="i"
            style="background:var(--bg3);border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:0.88rem"
          >
            <span class="badge badge-blue" style="margin-right:8px">#{{ i+1 }}</span>
            <span style="font-family:monospace;color:var(--yellow)">"{{ m.text }}"</span>
            <span style="color:var(--text2);margin-left:8px">index {{ m.index }}–{{ m.index + m.text.length }}</span>
          </div>
        </div>
      </div>

      <!-- Quick patterns -->
      <div class="mt">
        <label class="label">Quick patterns</label>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          <button v-for="q in quickPatterns" :key="q.label" class="btn btn-sm btn-secondary"
            @click="loadQuick(q)">{{ q.label }}</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const pattern  = ref('\\b\\w+ing\\b')
const flags    = ref('gi')
const testStr  = ref('The quick brown fox is jumping over the lazy dog, happily running and singing.')
const error    = ref('')

interface Match { text: string; index: number }
const matches = ref<Match[]>([])

function run() {
  error.value   = ''
  matches.value = []
  if (!pattern.value) return
  try {
    const re = new RegExp(pattern.value, flags.value.replace(/[^gimsuy]/g, ''))
    const m  = [...testStr.value.matchAll(re)]
    matches.value = m.map(x => ({ text: x[0], index: x.index ?? 0 }))
  } catch (e: unknown) {
    error.value = (e as Error).message
  }
}

const highlighted = computed(() => {
  if (!pattern.value || error.value) return escHtml(testStr.value)
  try {
    const re = new RegExp(pattern.value, flags.value.replace(/[^gimsuy]/g, ''))
    return escHtml(testStr.value).replace(
      new RegExp(pattern.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags.value.replace(/[^gimsuy]/g, '')),
      (m) => `<mark style="background:rgba(245,158,11,0.35);color:var(--yellow);border-radius:3px;padding:1px 2px">${escHtml(m)}</mark>`
    )
  } catch {
    return escHtml(testStr.value)
  }
})

function escHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

const quickPatterns = [
  { label: 'Email',    pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL',      pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+',       flags: 'gi' },
  { label: 'Numbers',  pattern: '\\d+(\\.\\d+)?',                                        flags: 'g'  },
  { label: 'Words',    pattern: '\\b\\w+\\b',                                             flags: 'g'  },
  { label: 'Hex',      pattern: '#[0-9a-fA-F]{3,8}',                                     flags: 'g'  },
]

function loadQuick(q: { pattern: string; flags: string }) {
  pattern.value = q.pattern; flags.value = q.flags; run()
}

run()
</script>
