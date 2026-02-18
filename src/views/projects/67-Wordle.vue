<template>
  <ProjectLayout title="Wordle">
    <div class="card" style="text-align:center">
      <!-- Board -->
      <div style="display:inline-flex;flex-direction:column;gap:6px;margin-bottom:16px">
        <div v-for="(row, ri) in 6" :key="ri" style="display:flex;gap:6px">
          <div v-for="(ci) in 5" :key="ci"
            :style="{
              width:'52px', height:'52px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.6rem', fontWeight:'800', borderRadius:'6px',
              border: '2px solid ' + cellBorder(ri, ci-1),
              background: cellBg(ri, ci-1),
              color: cellColor(ri, ci-1),
              transition: 'background 0.3s',
            }">
            {{ guesses[ri]?.[ci-1] ?? (ri === currentRow ? currentGuess[ci-1] ?? '' : '') }}
          </div>
        </div>
      </div>

      <div v-if="message" :class="['msg', won ? 'msg-success' : gameOver ? 'msg-error' : 'msg-info']" style="margin-bottom:12px">
        {{ message }}
      </div>

      <!-- Keyboard -->
      <div style="display:flex;flex-direction:column;gap:6px;align-items:center">
        <div v-for="row in keyboard" :key="row.join('')" style="display:flex;gap:4px">
          <button v-for="k in row" :key="k"
            @click="press(k)"
            :style="{
              padding: k === 'ENTER' || k === '⌫' ? '0 10px' : '0',
              width: k === 'ENTER' || k === '⌫' ? 'auto' : '34px',
              height: '46px', borderRadius:'6px', fontWeight:'700', fontSize:'0.82rem', cursor:'pointer',
              border:'none', background: keyBg(k), color: keyBg(k) === 'var(--bg3)' ? 'var(--text)' : '#fff',
            }"
          >{{ k }}</button>
        </div>
      </div>

      <button v-if="gameOver || won" class="btn btn-primary mt2" @click="newGame">New Game</button>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const WORDS = ['CRANE','SLATE','AUDIO','STARE','ARISE','RAISE','WRITE','CLOUD','BRAVE','FLAME',
  'GRACE','PLANT','STONE','BLEND','CRISP','DRIFT','DRIVE','ELITE','EPOCH','FABLE',
  'GIANT','GLOBE','GRAIL','GROVE','GUILD','HASTE','HAVEN','HEART','HOVER','IDEAL']

const target      = ref('')
const guesses     = ref<string[][]>([])
const currentGuess= ref<string[]>([])
const currentRow  = computed(() => guesses.value.length)
const won         = ref(false)
const gameOver    = ref(false)
const message     = ref('')

const keyboard = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

function newGame() {
  target.value = WORDS[Math.floor(Math.random() * WORDS.length)]
  guesses.value = []; currentGuess.value = []; won.value = false; gameOver.value = false; message.value = ''
}

function press(k: string) {
  if (won.value || gameOver.value) return
  if (k === '⌫') { currentGuess.value.pop(); return }
  if (k === 'ENTER') { submit(); return }
  if (currentGuess.value.length < 5) currentGuess.value.push(k)
}

function submit() {
  if (currentGuess.value.length < 5) { message.value = 'Not enough letters'; setTimeout(() => message.value = '', 1500); return }
  const guess = [...currentGuess.value]
  guesses.value.push(guess)
  currentGuess.value = []
  if (guess.join('') === target.value) {
    won.value = true; message.value = ['Genius!','Magnificent!','Impressive!','Splendid!','Great!','Phew!'][guesses.value.length-1] ?? 'Nice!'
  } else if (guesses.value.length >= 6) {
    gameOver.value = true; message.value = `The word was ${target.value}`
  }
}

type Status = 'correct'|'present'|'absent'|'empty'
function tileStatus(row: number, col: number): Status {
  const g = guesses.value[row]
  if (!g) return 'empty'
  const letter = g[col]
  const t = target.value
  if (letter === t[col]) return 'correct'
  if (t.includes(letter)) return 'present'
  return 'absent'
}

function cellBg(ri: number, ci: number) {
  if (ri >= guesses.value.length) return 'transparent'
  const s = tileStatus(ri, ci)
  return s === 'correct' ? '#22c55e' : s === 'present' ? '#eab308' : '#374151'
}
function cellColor(ri: number, ci: number) {
  return ri < guesses.value.length ? '#fff' : 'var(--text)'
}
function cellBorder(ri: number, ci: number) {
  if (ri < guesses.value.length) return 'transparent'
  if (ri === currentRow.value) {
    return currentGuess.value[ci] !== undefined ? 'var(--accent)' : 'var(--bg3)'
  }
  return 'var(--bg3)'
}

function keyBg(k: string) {
  let best: Status = 'empty'
  for (const g of guesses.value) {
    for (let i = 0; i < 5; i++) {
      if (g[i] === k) {
        const s = tileStatus(guesses.value.indexOf(g), i)
        if (s === 'correct') return '#22c55e'
        if (s === 'present') best = 'present'
        else if (best === 'empty') best = 'absent'
      }
    }
  }
  if (best === 'present') return '#eab308'
  if (best === 'absent') return '#374151'
  return 'var(--bg3)'
}

newGame()

// keyboard events
function onKey(e: KeyboardEvent) {
  const k = e.key.toUpperCase()
  if (k === 'ENTER') press('ENTER')
  else if (k === 'BACKSPACE') press('⌫')
  else if (/^[A-Z]$/.test(k)) press(k)
}
window.addEventListener('keydown', onKey)
import { onUnmounted } from 'vue'
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
