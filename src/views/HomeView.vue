<template>
  <div class="home-hero">
    <span class="home-badge">Vue 3 · TypeScript · Vite</span>
    <h1>Vue <span>Projects</span></h1>
    <p>A collection of 80 fully-implemented Vue 3 projects — explore state management, timers, games, utilities, and more.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <RouterLink to="/projects">
        <button class="btn btn-primary" style="font-size:1.1rem;padding:14px 36px;">
          View Projects &rarr;
        </button>
      </RouterLink>
      <RouterLink to="/storybook">
        <button class="btn btn-secondary" style="font-size:1.1rem;padding:14px 36px;">
          Component Storybook
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
