<template>
  <ProjectLayout title="URL Encoder / Decoder">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <button class="btn" :class="mode==='encode' ? 'btn-primary' : 'btn-secondary'" @click="mode='encode'; convert()">Encode</button>
        <button class="btn" :class="mode==='decode' ? 'btn-primary' : 'btn-secondary'" @click="mode='decode'; convert()">Decode</button>
        <button class="btn" :class="mode==='full' ? 'btn-primary' : 'btn-secondary'" @click="mode='full'; convert()">Full URL</button>
      </div>

      <label class="label">{{ mode === 'encode' ? 'Plain Text' : mode === 'decode' ? 'Encoded String' : 'Full URL to parse' }}</label>
      <textarea v-model="input" class="input" style="min-height:80px;font-family:monospace;font-size:0.88rem" @input="convert" :placeholder="placeholders[mode]" />

      <div v-if="error" class="msg msg-error mt2">{{ error }}</div>

      <label class="label mt2">Output</label>
      <div style="background:var(--bg);border-radius:8px;padding:14px;font-family:monospace;font-size:0.88rem;min-height:60px;word-break:break-all;line-height:1.6;white-space:pre-wrap">{{ output || '—' }}</div>

      <div class="row" style="gap:8px;margin-top:10px">
        <button class="btn btn-secondary btn-sm" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        <button class="btn btn-secondary btn-sm" @click="swap">⇄ Swap</button>
      </div>

      <!-- URL breakdown when in full mode -->
      <div v-if="mode === 'full' && urlParts" class="mt">
        <div class="divider" />
        <label class="label">URL Parts</label>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div v-for="[k,v] in Object.entries(urlParts).filter(([,v])=>v)" :key="k"
            style="display:flex;gap:12px;padding:8px 12px;background:var(--bg3);border-radius:6px;font-size:0.88rem;flex-wrap:wrap">
            <span style="color:var(--text2);min-width:80px;font-weight:600">{{ k }}</span>
            <span style="font-family:monospace;word-break:break-all">{{ v }}</span>
          </div>
        </div>
      </div>

      <!-- Quick examples -->
      <div class="divider" />
      <label class="label">Try these</label>
      <div class="row" style="flex-wrap:wrap;gap:6px">
        <button v-for="ex in examples" :key="ex.label" class="btn btn-sm btn-secondary"
          @click="mode = ex.mode; input = ex.text; convert()">{{ ex.label }}</button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

type Mode = 'encode' | 'decode' | 'full'
const mode   = ref<Mode>('encode')
const input  = ref('Hello World! This is a test & more...')
const output = ref('')
const error  = ref('')
const copied = ref(false)
const urlParts = ref<Record<string,string> | null>(null)

const placeholders: Record<Mode, string> = {
  encode: 'hello world & more',
  decode: 'hello%20world%20%26%20more',
  full:   'https://example.com/path?q=hello world&lang=en#section',
}

function convert() {
  error.value = ''; urlParts.value = null
  try {
    if (mode.value === 'encode') {
      output.value = encodeURIComponent(input.value)
    } else if (mode.value === 'decode') {
      output.value = decodeURIComponent(input.value)
    } else {
      // Full URL parse
      const url = new URL(input.value.includes('://') ? input.value : 'https://' + input.value)
      output.value = url.href
      const params: Record<string,string> = {}
      url.searchParams.forEach((v,k) => params[k] = v)
      urlParts.value = {
        Protocol: url.protocol, Host: url.host, Pathname: url.pathname,
        Search: url.search, Hash: url.hash,
        ...Object.fromEntries(Object.entries(params).map(([k,v]) => [`Param: ${k}`, v]))
      }
    }
  } catch (e: unknown) { error.value = (e as Error).message }
}

function copy() {
  navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

function swap() { input.value = output.value; convert() }

const examples = [
  { mode: 'encode' as Mode, label: 'Spaces & symbols', text: 'Hello World! Price: $9.99 (50% off)' },
  { mode: 'decode' as Mode, label: 'Decode URL',       text: 'https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world' },
  { mode: 'full'   as Mode, label: 'Parse URL',        text: 'https://api.example.com/search?q=hello world&page=1&sort=asc#results' },
]

convert()
</script>
