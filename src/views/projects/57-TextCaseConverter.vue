<template>
  <ProjectLayout title="Text Case Converter">
    <div class="card">
      <label class="label">Input Text</label>
      <textarea v-model="input" class="input" style="min-height:100px" placeholder="Enter text to convert…" />

      <div class="mt">
        <div v-for="conv in conversions" :key="conv.key" style="margin-bottom:10px">
          <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:4px">
            <label class="label" style="margin:0">{{ conv.label }}</label>
            <button class="btn btn-sm btn-secondary" @click="copy(conv.key)">
              {{ copied === conv.key ? '✓ Copied' : 'Copy' }}
            </button>
          </div>
          <div style="background:var(--bg);border-radius:6px;padding:10px 14px;font-family:monospace;font-size:0.9rem;word-break:break-all">
            {{ convert(conv.key) || '—' }}
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const input  = ref('hello world from vue typescript')
const copied = ref('')

const conversions = [
  { key: 'upper',    label: 'UPPERCASE'           },
  { key: 'lower',    label: 'lowercase'            },
  { key: 'title',    label: 'Title Case'           },
  { key: 'sentence', label: 'Sentence case'        },
  { key: 'camel',    label: 'camelCase'            },
  { key: 'pascal',   label: 'PascalCase'           },
  { key: 'snake',    label: 'snake_case'           },
  { key: 'kebab',    label: 'kebab-case'           },
  { key: 'screaming',label: 'SCREAMING_SNAKE_CASE' },
  { key: 'dot',      label: 'dot.case'             },
  { key: 'reverse',  label: 'esreveR'              },
  { key: 'alternate',label: 'aLtErNaTe CaSe'       },
]

function words() { return input.value.trim().split(/[\s_\-./]+/).filter(Boolean) }

function convert(key: string): string {
  const s = input.value.trim()
  if (!s) return ''
  const w = words()
  switch (key) {
    case 'upper':    return s.toUpperCase()
    case 'lower':    return s.toLowerCase()
    case 'title':    return w.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    case 'sentence': return s[0].toUpperCase() + s.slice(1).toLowerCase()
    case 'camel':    return w.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
    case 'pascal':   return w.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
    case 'snake':    return w.map(w => w.toLowerCase()).join('_')
    case 'kebab':    return w.map(w => w.toLowerCase()).join('-')
    case 'screaming':return w.map(w => w.toUpperCase()).join('_')
    case 'dot':      return w.map(w => w.toLowerCase()).join('.')
    case 'reverse':  return s.split('').reverse().join('')
    case 'alternate':return [...s].map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
    default:         return s
  }
}

function copy(key: string) {
  navigator.clipboard.writeText(convert(key))
  copied.value = key; setTimeout(() => copied.value = '', 2000)
}
</script>
