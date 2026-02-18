<template>
  <ProjectLayout title="Base Converter">
    <div class="card">
      <div class="col" style="gap:14px">
        <div v-for="base in bases" :key="base.key">
          <label class="label">{{ base.label }} (Base {{ base.n }})</label>
          <div class="row" style="gap:8px">
            <input
              v-model="values[base.key]"
              class="input"
              :placeholder="base.placeholder"
              style="font-family:monospace"
              spellcheck="false"
              @input="convert(base.key)"
            />
            <button class="btn btn-sm btn-secondary" @click="copyVal(base.key)">
              {{ copied === base.key ? '✓' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="msg msg-error mt2">{{ error }}</div>

      <div class="divider" />
      <label class="label">Bit Representation (32-bit)</label>
      <div style="font-family:monospace;font-size:0.88rem;background:var(--bg);padding:14px;border-radius:8px;word-break:break-all;line-height:2">
        <span
          v-for="(bit, i) in bits"
          :key="i"
          :style="{ color: bit === '1' ? 'var(--accent2)' : 'var(--text2)', marginRight: (i+1)%8===0 && i<31 ? '10px' : '2px' }"
        >{{ bit }}</span>
      </div>

      <div class="divider" />
      <label class="label">Quick values</label>
      <div class="row" style="flex-wrap:wrap;gap:8px">
        <button v-for="v in [0,1,8,10,16,32,64,100,127,255,256,1024,65535]" :key="v"
          class="btn btn-sm btn-secondary"
          @click="values.dec = String(v); convert('dec')">{{ v }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const bases = [
  { key: 'bin', label: 'Binary',      n: 2,  placeholder: '1010' },
  { key: 'oct', label: 'Octal',       n: 8,  placeholder: '12' },
  { key: 'dec', label: 'Decimal',     n: 10, placeholder: '10' },
  { key: 'hex', label: 'Hexadecimal', n: 16, placeholder: 'A' },
]

const baseMap: Record<string, number> = { bin: 2, oct: 8, dec: 10, hex: 16 }
const values = ref<Record<string, string>>({ bin: '1010', oct: '12', dec: '10', hex: 'A' })
const error  = ref('')
const copied = ref('')

function convert(from: string) {
  error.value = ''
  const raw = values.value[from].trim()
  if (!raw) { bases.forEach(b => { if (b.key !== from) values.value[b.key] = '' }); return }
  try {
    const n = parseInt(raw, baseMap[from])
    if (isNaN(n) || n < 0) throw new Error('Invalid input')
    bases.forEach(b => {
      if (b.key !== from) values.value[b.key] = n.toString(baseMap[b.key]).toUpperCase()
    })
  } catch { error.value = `Invalid ${bases.find(b=>b.key===from)?.label} number` }
}

const bits = computed(() => {
  const n = parseInt(values.value.dec || '0', 10)
  return isNaN(n) ? '0'.repeat(32).split('') : (n >>> 0).toString(2).padStart(32, '0').split('')
})

function copyVal(key: string) {
  navigator.clipboard.writeText(values.value[key])
  copied.value = key; setTimeout(() => copied.value = '', 2000)
}
</script>
