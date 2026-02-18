<template>
  <ProjectLayout title="Star Rating">
    <div class="card">
      <!-- Main rating widget -->
      <div style="text-align:center;margin-bottom:32px">
        <h3 style="margin-bottom:8px;color:var(--text2)">Rate your experience</h3>
        <div
          class="stars"
          style="justify-content:center"
          @mouseleave="hovered = 0"
        >
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ lit: n <= (hovered || rating) }"
            @mouseover="hovered = n"
            @click="rate(n)"
          >★</span>
        </div>
        <div style="margin-top:12px;font-size:1.1rem;font-weight:700;min-height:28px">
          {{ ratingLabel }}
        </div>
      </div>

      <!-- Multiple categories -->
      <div class="divider" />
      <h4 style="margin-bottom:16px">Rate different aspects</h4>

      <div v-for="cat in categories" :key="cat.name" style="margin-bottom:16px">
        <div class="row" style="justify-content:space-between;margin-bottom:6px">
          <span>{{ cat.name }}</span>
          <span style="color:var(--text2);font-size:0.85rem">{{ cat.rating || 'Not rated' }}</span>
        </div>
        <div
          class="stars"
          style="gap:6px;font-size:1.8rem"
          @mouseleave="cat.hovered = 0"
        >
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ lit: n <= (cat.hovered || cat.rating) }"
            @mouseover="cat.hovered = n"
            @click="cat.rating = n"
          >★</span>
        </div>
      </div>

      <div class="divider" />
      <div v-if="avgRating > 0">
        <div class="row" style="justify-content:space-between;align-items:center">
          <span>Average rating:</span>
          <span style="font-size:1.4rem;font-weight:800;color:var(--yellow)">
            ★ {{ avgRating.toFixed(1) }} / 5
          </span>
        </div>
        <div class="progress-bar mt2">
          <div class="progress-fill" :style="{ width: (avgRating / 5 * 100) + '%', background: 'var(--yellow)' }" />
        </div>
      </div>

      <div class="divider" />
      <!-- Leave a review -->
      <h4 style="margin-bottom:12px">Leave a review</h4>
      <textarea v-model="review" class="input" style="min-height:80px" placeholder="Share your thoughts…" />
      <button class="btn btn-primary mt2" :disabled="!rating || !review.trim()" @click="submit">
        Submit Review
      </button>

      <div v-if="submitted" class="msg msg-success mt2">
        🎉 Thank you for your {{ rating }}-star review!
      </div>

      <!-- Reviews list -->
      <div v-if="reviews.length" class="mt">
        <div class="divider" />
        <label class="label">Reviews ({{ reviews.length }})</label>
        <div
          v-for="(r, i) in reviews"
          :key="i"
          style="background:var(--bg3);border-radius:8px;padding:14px 16px;margin-bottom:8px"
        >
          <div class="row" style="justify-content:space-between;margin-bottom:6px">
            <span style="color:var(--yellow);font-size:1.1rem">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
            <span style="color:var(--text2);font-size:0.8rem">{{ r.date }}</span>
          </div>
          <p style="font-size:0.9rem">{{ r.text }}</p>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const rating  = ref(0)
const hovered = ref(0)
const review  = ref('')
const submitted = ref(false)

const labels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent']
const ratingLabel = computed(() => {
  const n = hovered.value || rating.value
  return n ? labels[n] : 'Click a star to rate'
})

const categories = reactive([
  { name: '🎨 Design',      rating: 0, hovered: 0 },
  { name: '⚡ Performance', rating: 0, hovered: 0 },
  { name: '🛠 Usability',   rating: 0, hovered: 0 },
  { name: '📚 Docs',        rating: 0, hovered: 0 },
])

const avgRating = computed(() => {
  const rated = categories.filter(c => c.rating > 0)
  if (!rated.length) return 0
  return rated.reduce((s, c) => s + c.rating, 0) / rated.length
})

interface Review { rating: number; text: string; date: string }
const reviews = ref<Review[]>([])

function rate(n: number) { rating.value = n }

function submit() {
  reviews.value.unshift({
    rating: rating.value,
    text: review.value.trim(),
    date: new Date().toLocaleDateString(),
  })
  review.value = ''; submitted.value = true
  setTimeout(() => submitted.value = false, 3000)
}
</script>
