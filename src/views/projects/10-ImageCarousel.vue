<template>
  <ProjectLayout title="Image Carousel">
    <div class="card">
      <div class="carousel">
        <div class="carousel-slide" :style="{ background: slides[current].bg }">
          <div style="text-align:center">
            <div style="font-size:5rem">{{ slides[current].icon }}</div>
            <div style="font-size:1.2rem;font-weight:700;margin-top:12px;color:#fff">{{ slides[current].label }}</div>
            <div style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-top:4px">{{ slides[current].sub }}</div>
          </div>
        </div>
        <button class="carousel-btn left" @click="prev">‹</button>
        <button class="carousel-btn right" @click="next">›</button>
      </div>

      <div class="carousel-dots">
        <button
          v-for="(_, i) in slides"
          :key="i"
          class="dot"
          :class="{ active: i === current }"
          @click="goTo(i)"
        />
      </div>

      <div style="text-align:center;color:var(--text2);font-size:0.88rem;margin-top:8px">
        {{ current + 1 }} / {{ slides.length }}
        <span style="margin-left:12px">Auto-play:</span>
        <button class="btn btn-sm" :class="autoplay ? 'btn-warn' : 'btn-success'" style="margin-left:8px" @click="toggleAuto">
          {{ autoplay ? 'Stop' : 'Start' }}
        </button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const slides = [
  { icon: '🌄', label: 'Mountain Sunrise',    sub: 'The peaks glow gold at dawn',       bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { icon: '🌊', label: 'Ocean Waves',          sub: 'Endless blue horizons',              bg: 'linear-gradient(135deg,#0f3460,#533483)' },
  { icon: '🌸', label: 'Spring Blossoms',      sub: 'Cherry trees in full bloom',         bg: 'linear-gradient(135deg,#e94560,#533483)' },
  { icon: '🏙', label: 'City Lights',          sub: 'The skyline never sleeps',           bg: 'linear-gradient(135deg,#2c3e50,#3498db)' },
  { icon: '🌌', label: 'Milky Way',            sub: 'Stars beyond counting',              bg: 'linear-gradient(135deg,#0f0c29,#302b63)' },
  { icon: '🍂', label: 'Autumn Forest',        sub: 'A canopy of fire and gold',          bg: 'linear-gradient(135deg,#834d09,#2c1654)' },
]

const current = ref(0)
const autoplay = ref(true)
let timer: ReturnType<typeof setInterval> | null = null

function next()   { current.value = (current.value + 1) % slides.length }
function prev()   { current.value = (current.value - 1 + slides.length) % slides.length }
function goTo(i: number) { current.value = i }

function startAuto() {
  timer = setInterval(next, 3000)
}
function stopAuto()  { clearInterval(timer!); timer = null }
function toggleAuto() {
  autoplay.value = !autoplay.value
  autoplay.value ? startAuto() : stopAuto()
}

onMounted(startAuto)
onUnmounted(stopAuto)
</script>
