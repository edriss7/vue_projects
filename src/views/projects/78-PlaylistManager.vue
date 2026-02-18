<template>
  <ProjectLayout title="Playlist Manager">
    <div class="card">
      <!-- Add song -->
      <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:16px">
        <input v-model="newTitle" class="input" placeholder="Song title…" @keyup.enter="addSong" />
        <input v-model="newArtist" class="input" placeholder="Artist…" @keyup.enter="addSong" />
        <button class="btn btn-primary" @click="addSong">Add</button>
      </div>

      <!-- Controls -->
      <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-secondary btn-sm" @click="prevTrack">⏮</button>
        <button class="btn btn-primary" style="padding:8px 20px" @click="togglePlay">{{ playing ? '⏸' : '▶' }}</button>
        <button class="btn btn-secondary btn-sm" @click="nextTrack">⏭</button>
        <div style="flex:1;min-width:120px">
          <input v-model.number="progress" type="range" min="0" max="100" style="width:100%;accent-color:var(--accent)" @input="seeked" />
        </div>
        <span style="font-size:0.8rem;color:var(--text2);white-space:nowrap">{{ elapsed }} / {{ duration }}</span>
        <button class="btn btn-secondary btn-sm" :class="shuffle ? 'btn-primary' : ''" @click="shuffle = !shuffle">🔀</button>
        <button class="btn btn-secondary btn-sm" :class="repeat !== 'none' ? 'btn-primary' : ''"
          @click="cycleRepeat">{{ repeat === 'one' ? '🔂' : '🔁' }}</button>
      </div>

      <!-- Now playing -->
      <div v-if="currentSong" style="background:var(--bg3);border-radius:8px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px">
        <div style="width:42px;height:42px;border-radius:8px;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">
          {{ playing ? '🎵' : '⏸' }}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:0.95rem">{{ currentSong.title }}</div>
          <div style="color:var(--text2);font-size:0.82rem">{{ currentSong.artist }}</div>
        </div>
        <div style="font-size:0.78rem;color:var(--text2)">{{ currentSong.duration }}</div>
      </div>

      <!-- Playlist -->
      <div style="max-height:260px;overflow-y:auto">
        <div v-for="(song, i) in songs" :key="song.id"
          @click="play(i)"
          style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background 0.15s"
          :style="{ background: i === currentIdx ? 'var(--accent)' + '22' : 'transparent',
                    borderLeft: i === currentIdx ? '3px solid var(--accent)' : '3px solid transparent' }">
          <span style="color:var(--text2);font-size:0.8rem;min-width:18px">{{ i + 1 }}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.88rem;font-weight: i === currentIdx ? 700 : 400"
              :style="{ fontWeight: i === currentIdx ? '700' : '400', color: i === currentIdx ? 'var(--accent)' : 'var(--text)' }">
              {{ song.title }}
            </div>
            <div style="font-size:0.75rem;color:var(--text2)">{{ song.artist }}</div>
          </div>
          <span style="font-size:0.78rem;color:var(--text2)">{{ song.duration }}</span>
          <button class="btn btn-sm btn-danger" @click.stop="removeSong(song.id)" style="padding:2px 6px">✕</button>
        </div>
      </div>

      <div style="font-size:0.78rem;color:var(--text2);margin-top:8px">{{ songs.length }} tracks · (Simulated playback)</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Song { id: number; title: string; artist: string; duration: string; secs: number }

const songs = ref<Song[]>([
  { id:1,  title:'Bohemian Rhapsody',   artist:'Queen',          duration:'5:55', secs:355 },
  { id:2,  title:'Hotel California',    artist:'Eagles',         duration:'6:30', secs:390 },
  { id:3,  title:'Stairway to Heaven',  artist:'Led Zeppelin',   duration:'8:02', secs:482 },
  { id:4,  title:'Smells Like Teen Spirit', artist:'Nirvana',    duration:'5:01', secs:301 },
  { id:5,  title:'Purple Rain',         artist:'Prince',         duration:'8:41', secs:521 },
  { id:6,  title:'Like a Rolling Stone',artist:'Bob Dylan',      duration:'6:09', secs:369 },
])

const currentIdx = ref(0)
const playing    = ref(false)
const progress   = ref(0)
const elapsed    = ref('0:00')
const shuffle    = ref(false)
const repeat     = ref<'none'|'all'|'one'>('none')
const newTitle   = ref('')
const newArtist  = ref('')
let nextId = 7
let timer: ReturnType<typeof setInterval> | null = null
let currentSecs  = 0

const currentSong = computed(() => songs.value[currentIdx.value])
const duration    = computed(() => currentSong.value?.duration ?? '0:00')

function fmt(s: number) {
  return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0')
}

function startTimer() {
  clearInterval(timer!)
  timer = setInterval(() => {
    if (!currentSong.value) return
    currentSecs++
    progress.value = (currentSecs / currentSong.value.secs) * 100
    elapsed.value = fmt(currentSecs)
    if (currentSecs >= currentSong.value.secs) {
      if (repeat.value === 'one') { currentSecs = 0 }
      else nextTrack()
    }
  }, 1000)
}

function play(i: number) {
  currentIdx.value = i; currentSecs = 0; progress.value = 0; elapsed.value = '0:00'
  playing.value = true; startTimer()
}

function togglePlay() {
  playing.value = !playing.value
  if (playing.value) startTimer()
  else clearInterval(timer!)
}

function nextTrack() {
  if (!songs.value.length) return
  let next = shuffle.value
    ? Math.floor(Math.random() * songs.value.length)
    : (currentIdx.value + 1) % songs.value.length
  if (!shuffle.value && next === 0 && repeat.value === 'none') { playing.value = false; clearInterval(timer!); return }
  play(next)
}

function prevTrack() {
  if (currentSecs > 3) { currentSecs = 0; return }
  play((currentIdx.value - 1 + songs.value.length) % songs.value.length)
}

function cycleRepeat() {
  repeat.value = repeat.value === 'none' ? 'all' : repeat.value === 'all' ? 'one' : 'none'
}

function seeked() {
  if (!currentSong.value) return
  currentSecs = Math.floor((progress.value / 100) * currentSong.value.secs)
  elapsed.value = fmt(currentSecs)
}

function addSong() {
  if (!newTitle.value.trim()) return
  const secs = 180 + Math.floor(Math.random() * 200)
  songs.value.push({ id: nextId++, title: newTitle.value.trim(), artist: newArtist.value.trim() || 'Unknown', duration: fmt(secs), secs })
  newTitle.value = ''; newArtist.value = ''
}

function removeSong(id: number) {
  const idx = songs.value.findIndex(s => s.id === id)
  songs.value = songs.value.filter(s => s.id !== id)
  if (idx === currentIdx.value) { playing.value = false; clearInterval(timer!) }
  else if (idx < currentIdx.value) currentIdx.value--
}

onUnmounted(() => clearInterval(timer!))
</script>
