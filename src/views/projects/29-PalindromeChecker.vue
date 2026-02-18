<template>
  <ProjectLayout title="Palindrome Checker">
    <div class="card">
      <label class="label">Enter a word or phrase</label>
      <input v-model="input" class="input" placeholder="e.g. racecar, A man a plan a canal Panama" @input="check" />

      <div v-if="input.trim()" class="mt">
        <!-- Result banner -->
        <div class="result-box" style="text-align:center;font-size:1.3rem;font-weight:700" :style="{ borderLeft: `4px solid ${isPalindrome ? 'var(--green)' : 'var(--red)'}` }">
          <span style="font-size:2rem">{{ isPalindrome ? '✅' : '❌' }}</span><br/>
          <span :style="{ color: isPalindrome ? 'var(--green)' : 'var(--red)' }">
            {{ isPalindrome ? 'Yes, it\'s a palindrome!' : 'No, not a palindrome.' }}
          </span>
        </div>

        <!-- Step-by-step -->
        <div class="mt">
          <label class="label">Step-by-step breakdown</label>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div class="stat-box" style="text-align:left">
              <div class="lbl">1. Original input</div>
              <div style="font-family:monospace;font-size:1rem;margin-top:4px;word-break:break-all">"{{ input }}"</div>
            </div>
            <div class="stat-box" style="text-align:left">
              <div class="lbl">2. Lowercase, letters/numbers only</div>
              <div style="font-family:monospace;font-size:1rem;margin-top:4px;word-break:break-all">"{{ cleaned }}"</div>
            </div>
            <div class="stat-box" style="text-align:left">
              <div class="lbl">3. Reversed</div>
              <div style="font-family:monospace;font-size:1rem;margin-top:4px;word-break:break-all">"{{ reversed }}"</div>
            </div>
            <div class="stat-box" style="text-align:left">
              <div class="lbl">4. Comparison</div>
              <div style="margin-top:6px">
                <span v-for="(ch, i) in cleaned.split('')" :key="i"
                  style="display:inline-block;font-family:monospace;font-size:0.9rem;padding:2px 4px;border-radius:3px;margin:2px"
                  :style="{ background: ch === reversed[i] ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: ch === reversed[i] ? 'var(--green)' : 'var(--red)' }"
                >{{ ch }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fun examples -->
        <div class="mt">
          <label class="label">Try these examples</label>
          <div class="row" style="flex-wrap:wrap;gap:8px">
            <button
              v-for="ex in examples"
              :key="ex"
              class="btn btn-sm btn-secondary"
              @click="input = ex; check()"
            >{{ ex }}</button>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const input = ref('racecar')

const cleaned  = computed(() => input.value.toLowerCase().replace(/[^a-z0-9]/g, ''))
const reversed = computed(() => cleaned.value.split('').reverse().join(''))
const isPalindrome = computed(() => cleaned.value.length > 0 && cleaned.value === reversed.value)

function check() { /* reactivity handles it */ }

const examples = [
  'racecar', 'level', 'radar', 'noon', 'civic',
  'A man a plan a canal Panama',
  'Was it a car or a cat I saw',
  'Never odd or even',
  'hello', 'world',
]
</script>
