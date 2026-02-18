<template>
  <ProjectLayout title="Lorem Ipsum Generator">
    <div class="card">
      <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap;margin-bottom:16px">
        <div class="col" style="flex:1;min-width:120px">
          <label class="label">Type</label>
          <select v-model="type" class="input" @change="generate">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="bytes">Bytes (~)</option>
          </select>
        </div>
        <div class="col" style="flex:1;min-width:80px">
          <label class="label">Count</label>
          <input v-model.number="count" type="number" min="1" max="100" class="input" @input="generate" />
        </div>
        <div class="col" style="gap:6px">
          <label class="checkbox-row" style="margin:0">
            <input type="checkbox" v-model="startWithLorem" @change="generate" /> Start with "Lorem ipsum"
          </label>
          <label class="checkbox-row" style="margin:0">
            <input type="checkbox" v-model="html" @change="generate" /> Wrap in &lt;p&gt; tags
          </label>
        </div>
        <button class="btn btn-primary" @click="generate">Generate</button>
      </div>

      <div
        style="background:var(--bg);border-radius:8px;padding:16px;font-size:0.95rem;line-height:1.8;min-height:200px;white-space:pre-wrap;max-height:400px;overflow-y:auto"
      >{{ output }}</div>

      <div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" @click="copy">{{ copied ? '✓ Copied' : 'Copy' }}</button>
        <span style="color:var(--text2);font-size:0.85rem;align-self:center">
          {{ output.split(/\s+/).filter(Boolean).length }} words · {{ output.length }} chars
        </span>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const type           = ref('paragraphs')
const count          = ref(3)
const startWithLorem = ref(true)
const html           = ref(false)
const output         = ref('')
const copied         = ref(false)

function rndWord(skip = 0) { return WORDS[Math.floor(Math.random() * (WORDS.length - skip)) + skip] }

function sentence() {
  const len = 8 + Math.floor(Math.random() * 12)
  const words = Array.from({ length: len }, () => rndWord())
  words[0] = words[0][0].toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function paragraph() {
  const sents = 3 + Math.floor(Math.random() * 4)
  return Array.from({ length: sents }, sentence).join(' ')
}

function generate() {
  let text = ''
  if (type.value === 'words') {
    const arr = Array.from({ length: count.value }, () => rndWord())
    if (startWithLorem.value && arr.length >= 2) { arr[0] = 'Lorem'; arr[1] = 'ipsum' }
    text = arr.join(' ')
  } else if (type.value === 'sentences') {
    const arr = Array.from({ length: count.value }, sentence)
    if (startWithLorem.value) arr[0] = 'Lorem ipsum ' + arr[0].slice(0,1).toLowerCase() + arr[0].slice(1)
    text = arr.join(' ')
  } else if (type.value === 'bytes') {
    let raw = ''
    while (raw.length < count.value * 1024) raw += paragraph() + '\n\n'
    text = raw.slice(0, count.value * 1024)
  } else {
    const arr = Array.from({ length: count.value }, paragraph)
    if (startWithLorem.value) arr[0] = 'Lorem ipsum dolor sit amet, ' + arr[0].slice(0,1).toLowerCase() + arr[0].slice(1)
    text = html.value ? arr.map(p => `<p>${p}</p>`).join('\n') : arr.join('\n\n')
  }
  output.value = text
}

function copy() {
  navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

generate()
</script>
