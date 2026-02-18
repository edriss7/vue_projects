<template>
  <div class="page">
    <div class="page-inner">
      <div class="projects-header">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <RouterLink to="/" style="color:var(--text2);font-size:0.9rem;">&larr; Home</RouterLink>
          <RouterLink to="/storybook" style="color:var(--accent2);font-size:0.9rem;">Component Storybook &rarr;</RouterLink>
        </div>
        <h1 style="margin-top:12px;">80 Vue Projects</h1>
        <p>Click <strong>Show Project</strong> on any card to see the live implementation.</p>
      </div>
      <div class="projects-grid">
        <div
          v-for="p in projects"
          :key="p.id"
          class="project-card"
        >
          <span class="project-num">#{{ String(p.id).padStart(2, '0') }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.description }}</p>
          <div class="row" style="justify-content:space-between;align-items:center;">
            <span class="project-tag">{{ p.tag }}</span>
            <RouterLink :to="`/projects/${p.slug}`">
              <button class="btn btn-primary btn-sm">Show Project &rarr;</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { projects } from '../types'
</script>
