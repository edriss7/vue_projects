<template>
  <ProjectLayout title="Vigenère Cipher">
    <div class="card">
      <div class="row" style="gap:8px;margin-bottom:16px">
        <button class="btn" :class="mode==='encrypt'?'btn-primary':'btn-secondary'" @click="mode='encrypt';run()">Encrypt</button>
        <button class="btn" :class="mode==='decrypt'?'btn-primary':'btn-secondary'" @click="mode='decrypt';run()">Decrypt</button>
      </div>

      <label class="label">Key (letters only)</label>
      <input v-model="key" class="input" placeholder="SECRET" @input="run" />

      <label class="label mt2">{{ mode === 'encrypt' ? 'Plaintext' : 'Ciphertext' }}</label>
      <textarea v-model="inputText" class="input" style="min-height:80px;font-family:monospace" @input="run"
        :placeholder="mode === 'encrypt' ? 'Enter text to encrypt…' : 'Enter text to decrypt…'" />

      <div v-if="error" class="msg msg-error mt2">{{ error }}</div>

      <label class="label mt2">{{ mode === 'encrypt' ? 'Ciphertext' : 'Plaintext' }}</label>
      <div style="background:var(--bg);border-radius:8px;padding:12px;font-family:monospace;font-size:0.9rem;min-height:60px;word-break:break-all;white-space:pre-wrap">
        {{ output || '—' }}
      </div>

      <button class="btn btn-secondary btn-sm" style="margin-top:8px" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>

      <div class="divider" />
      <div style="font-size:0.82rem;color:var(--text2);line-height:1.6">
        The Vigenère cipher is a polyalphabetic substitution cipher using a keyword.
        Each letter of the plaintext is shifted by the corresponding letter of the key (A=0, B=1…).
        Non-alphabetic characters are passed through unchanged.
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const mode      = ref<'encrypt'|'decrypt'>('encrypt')
const key       = ref('SECRET')
const inputText = ref('Hello, World! This is a test message.')
const output    = ref('')
const error     = ref('')
const copied    = ref(false)

function run() {
  error.value = ''
  const k = key.value.toUpperCase().replace(/[^A-Z]/g, '')
  if (!k) { error.value = 'Key must contain at least one letter.'; output.value = ''; return }
  let result = ''
  let ki = 0
  for (const ch of inputText.value) {
    const code = ch.toUpperCase().charCodeAt(0)
    if (code >= 65 && code <= 90) {
      const shift = k.charCodeAt(ki % k.length) - 65
      const base  = ch === ch.toUpperCase() ? 65 : 97
      const plain = ch.charCodeAt(0) - base
      const enc   = mode.value === 'encrypt'
        ? (plain + shift) % 26
        : (plain - shift + 26) % 26
      result += String.fromCharCode(enc + base)
      ki++
    } else {
      result += ch
    }
  }
  output.value = result
}

function copy() {
  navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

run()
</script>
