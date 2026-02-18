<template>
  <div class="project-page">
    <div class="project-topbar">
      <RouterLink to="/projects">
        <button class="btn btn-secondary btn-sm">&larr; Back to Projects</button>
      </RouterLink>
      <h2>{{ title }}</h2>
    </div>
    <div class="project-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ title: string }>()
</script>
