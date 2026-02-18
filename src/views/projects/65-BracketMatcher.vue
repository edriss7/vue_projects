<template>
  <ProjectLayout title="Bracket Matcher">
    <div class="card">
      <label class="label">Input code / expression</label>
      <textarea v-model="code" class="input" style="min-height:120px;font-family:monospace;font-size:0.88rem"
        placeholder="Paste code or expression here…" @input="check" />

      <div v-if="result" class="mt">
        <div :class="['msg', result.ok ? 'msg-success' : 'msg-error']" style="margin-bottom:8px">
          {{ result.ok ? '✓ All brackets are matched!' : '✗ ' + result.message }}
        </div>

        <!-- Bracket stats -->
        <div v-if="result.ok" class="row" style="gap:8px;flex-wrap:wrap">
          <div v-for="s in result.stats" :key="s.label" class="stat-box" style="min-width:80px">
            <div class="val">{{ s.count }}</div>
            <div class="lbl">{{ s.label }}</div>
          </div>
        </div>

        <!-- Highlighted output -->
        <div v-if="!result.ok && result.errorPos !== undefined" style="margin-top:8px">
          <label class="label">Error at position {{ result.errorPos }}</label>
          <pre style="background:var(--bg);border-radius:8px;padding:12px;font-size:0.85rem;overflow-x:auto;white-space:pre-wrap;word-break:break-all">{{ highlightError(result.errorPos!) }}</pre>
        </div>
      </div>

      <div class="divider" />
      <div style="font-size:0.82rem;color:var(--text2)">Checks: <code>()</code> <code>[]</code> <code>{}</code></div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Result {
  ok: boolean
  message?: string
  errorPos?: number
  stats?: { label: string; count: number }[]
}

const code   = ref('function hello({ name }) {\n  const arr = [1, (2 + 3), 4];\n  return `Hello, ${name}!`;\n}')
const result = ref<Result | null>(null)

const open  = new Set(['(', '[', '{'])
const close = new Map<string, string>([[')', '('], [']', '['], ['}', '{']])

function check() {
  const s = code.value
  if (!s.trim()) { result.value = null; return }
  const stack: Array<{ ch: string; pos: number }> = []
  let parens = 0, squares = 0, braces = 0

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (open.has(ch)) {
      stack.push({ ch, pos: i })
      if (ch === '(') parens++
      else if (ch === '[') squares++
      else braces++
    } else if (close.has(ch)) {
      if (!stack.length) {
        result.value = { ok: false, message: `Unexpected '${ch}'`, errorPos: i }; return
      }
      const top = stack.pop()!
      if (top.ch !== close.get(ch)) {
        result.value = { ok: false, message: `Expected '${matchClose(top.ch)}' but found '${ch}'`, errorPos: i }; return
      }
    }
  }

  if (stack.length) {
    const top = stack[stack.length - 1]
    result.value = { ok: false, message: `Unclosed '${top.ch}' at position ${top.pos}`, errorPos: top.pos }
  } else {
    result.value = { ok: true, stats: [
      { label: '( ) pairs', count: parens },
      { label: '[ ] pairs', count: squares },
      { label: '{ } pairs', count: braces },
    ]}
  }
}

function matchClose(ch: string) {
  return ch === '(' ? ')' : ch === '[' ? ']' : '}'
}

function highlightError(pos: number) {
  const s = code.value
  return s.slice(0, pos) + '→→→' + s[pos] + '←←←' + s.slice(pos + 1)
}

check()
</script>
