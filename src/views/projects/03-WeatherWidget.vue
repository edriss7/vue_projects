<template>
  <ProjectLayout title="Weather Widget">
    <div class="card">
      <div class="row">
        <input v-model="query" class="input" placeholder="Search city…" @keyup.enter="search" />
        <button class="btn btn-primary" @click="search">Search</button>
      </div>

      <div v-if="weather" class="mt" style="text-align:center">
        <div style="font-size:5rem;line-height:1">{{ weather.icon }}</div>
        <h2 style="font-size:1.8rem;margin-top:12px">{{ weather.city }}</h2>
        <div style="font-size:3.5rem;font-weight:800;margin:8px 0">{{ weather.temp }}°C</div>
        <div style="color:var(--text2)">{{ weather.condition }}</div>

        <div class="stat-grid mt">
          <div class="stat-box">
            <div class="val">{{ weather.humidity }}%</div>
            <div class="lbl">Humidity</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ weather.wind }} km/h</div>
            <div class="lbl">Wind</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ weather.feelsLike }}°</div>
            <div class="lbl">Feels Like</div>
          </div>
          <div class="stat-box">
            <div class="val">{{ weather.uv }}</div>
            <div class="lbl">UV Index</div>
          </div>
        </div>
      </div>

      <div v-if="error" class="msg msg-error mt">{{ error }}</div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface WeatherData {
  city: string; temp: number; condition: string; icon: string
  humidity: number; wind: number; feelsLike: number; uv: number
}

const DB: Record<string, WeatherData> = {
  london:    { city: 'London',     temp: 14, condition: 'Partly Cloudy', icon: '⛅', humidity: 72, wind: 18, feelsLike: 12, uv: 3 },
  paris:     { city: 'Paris',      temp: 17, condition: 'Sunny',         icon: '☀️', humidity: 58, wind: 12, feelsLike: 16, uv: 5 },
  tokyo:     { city: 'Tokyo',      temp: 22, condition: 'Clear',         icon: '🌤', humidity: 65, wind: 9,  feelsLike: 21, uv: 6 },
  sydney:    { city: 'Sydney',     temp: 28, condition: 'Hot & Sunny',   icon: '☀️', humidity: 50, wind: 14, feelsLike: 30, uv: 8 },
  newyork:   { city: 'New York',   temp: 10, condition: 'Windy',         icon: '🌬', humidity: 60, wind: 25, feelsLike: 7,  uv: 2 },
  dubai:     { city: 'Dubai',      temp: 38, condition: 'Very Hot',      icon: '🔆', humidity: 40, wind: 8,  feelsLike: 42, uv: 11 },
  toronto:   { city: 'Toronto',    temp: 5,  condition: 'Snowy',         icon: '❄️', humidity: 80, wind: 22, feelsLike: 1,  uv: 1 },
  amsterdam: { city: 'Amsterdam',  temp: 11, condition: 'Rainy',         icon: '🌧', humidity: 85, wind: 20, feelsLike: 8,  uv: 2 },
}

const query   = ref('')
const weather = ref<WeatherData | null>(null)
const error   = ref('')

function search() {
  const key = query.value.trim().toLowerCase().replace(/\s+/g, '')
  if (!key) return
  const data = DB[key]
  if (data) {
    weather.value = data; error.value = ''
  } else {
    error.value = `No data for "${query.value}". Try: London, Paris, Tokyo, Sydney, New York, Dubai, Toronto, Amsterdam.`
    weather.value = null
  }
}

// Default city
query.value = 'London'; search()
</script>
