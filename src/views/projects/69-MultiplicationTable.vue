<template>
  <ProjectLayout title="Multiplication Table">
    <div class="card">
      <div class="row" style="gap:16px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
        <div>
          <label class="label">Size (N × N)</label>
          <input v-model.number="size" type="number" min="2" max="20" class="input" style="width:80px" />
        </div>
        <div>
          <label class="label">Highlight multiples of</label>
          <input v-model.number="highlight" type="number" min="1" :max="size" class="input" style="width:80px" />
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding-top:18px">
          <input type="checkbox" v-model="showDiag" id="diag" style="accent-color:var(--accent)" />
          <label for="diag" style="font-size:0.85rem;cursor:pointer">Highlight diagonal</label>
        </div>
      </div>

      <div style="overflow-x:auto">
        <table style="border-collapse:collapse;font-size:0.8rem;text-align:center">
          <thead>
            <tr>
              <th style="padding:5px 8px;background:var(--bg3);color:var(--text2)">×</th>
              <th v-for="c in size" :key="c"
                style="padding:5px 8px;background:var(--bg3);color:var(--accent);font-weight:700;min-width:36px">
                {{ c }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in size" :key="r">
              <td style="padding:5px 8px;background:var(--bg3);color:var(--accent);font-weight:700">{{ r }}</td>
              <td v-for="c in size" :key="c"
                style="padding:5px 8px;border:1px solid var(--bg3);transition:background 0.15s"
                :style="{
                  background: cellBg(r, c),
                  color: cellColor(r, c),
                  fontWeight: (showDiag && r === c) ? '800' : '400',
                }">
                {{ r * c }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const size      = ref(10)
const highlight = ref(3)
const showDiag  = ref(true)

function cellBg(r: number, c: number) {
  const val = r * c
  if (showDiag.value && r === c) return 'var(--accent)' + '33'
  if (highlight.value > 0 && val % highlight.value === 0) return 'var(--accent2)' + '22'
  return 'transparent'
}

function cellColor(r: number, c: number) {
  if (showDiag.value && r === c) return 'var(--accent)'
  if (highlight.value > 0 && (r * c) % highlight.value === 0) return 'var(--accent2)'
  return 'var(--text)'
}
</script>
