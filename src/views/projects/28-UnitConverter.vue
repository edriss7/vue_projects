<template>
  <ProjectLayout title="Unit Converter">
    <div class="card">
      <!-- Category tabs -->
      <div class="row" style="gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="btn btn-sm"
          :class="category === cat.key ? 'btn-primary' : 'btn-secondary'"
          @click="setCategory(cat.key)"
        >{{ cat.icon }} {{ cat.label }}</button>
      </div>

      <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap">
        <div class="col" style="flex:1;min-width:100px">
          <label class="label">Value</label>
          <input v-model.number="value" type="number" class="input" />
        </div>
        <div class="col" style="flex:1;min-width:120px">
          <label class="label">From</label>
          <select v-model="fromUnit" class="input">
            <option v-for="u in currentUnits" :key="u.key" :value="u.key">{{ u.label }}</option>
          </select>
        </div>
        <button class="btn btn-secondary" @click="swapUnits" title="Swap">⇄</button>
        <div class="col" style="flex:1;min-width:120px">
          <label class="label">To</label>
          <select v-model="toUnit" class="input">
            <option v-for="u in currentUnits" :key="u.key" :value="u.key">{{ u.label }}</option>
          </select>
        </div>
      </div>

      <div class="result-box mt">
        <div style="color:var(--text2);font-size:0.85rem;margin-bottom:4px">Result</div>
        <div style="font-size:2rem;font-weight:800">{{ result }} <span style="font-size:1rem;color:var(--text2)">{{ toUnit }}</span></div>
        <div style="color:var(--text2);font-size:0.85rem;margin-top:6px">
          {{ value }} {{ fromUnit }} = {{ result }} {{ toUnit }}
        </div>
      </div>

      <!-- All conversions table -->
      <div class="mt">
        <label class="label">All conversions from {{ value }} {{ fromUnit }}</label>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div
            v-for="u in currentUnits.filter(u => u.key !== fromUnit)"
            :key="u.key"
            style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg3);border-radius:6px;font-size:0.9rem"
          >
            <span>{{ u.label }}</span>
            <strong style="color:var(--accent2)">{{ convertTo(u.key) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Unit { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }
interface Category { key: string; label: string; icon: string; units: Unit[] }

const categories: Category[] = [
  {
    key: 'length', label: 'Length', icon: '📏',
    units: [
      { key: 'mm',   label: 'Millimetre',  toBase: v => v / 1000,       fromBase: v => v * 1000       },
      { key: 'cm',   label: 'Centimetre',  toBase: v => v / 100,        fromBase: v => v * 100        },
      { key: 'm',    label: 'Metre',       toBase: v => v,              fromBase: v => v              },
      { key: 'km',   label: 'Kilometre',   toBase: v => v * 1000,       fromBase: v => v / 1000       },
      { key: 'in',   label: 'Inch',        toBase: v => v * 0.0254,     fromBase: v => v / 0.0254     },
      { key: 'ft',   label: 'Foot',        toBase: v => v * 0.3048,     fromBase: v => v / 0.3048     },
      { key: 'yd',   label: 'Yard',        toBase: v => v * 0.9144,     fromBase: v => v / 0.9144     },
      { key: 'mi',   label: 'Mile',        toBase: v => v * 1609.344,   fromBase: v => v / 1609.344   },
    ],
  },
  {
    key: 'weight', label: 'Weight', icon: '⚖️',
    units: [
      { key: 'mg',  label: 'Milligram', toBase: v => v / 1e6,        fromBase: v => v * 1e6       },
      { key: 'g',   label: 'Gram',      toBase: v => v / 1000,       fromBase: v => v * 1000      },
      { key: 'kg',  label: 'Kilogram',  toBase: v => v,              fromBase: v => v             },
      { key: 't',   label: 'Tonne',     toBase: v => v * 1000,       fromBase: v => v / 1000      },
      { key: 'oz',  label: 'Ounce',     toBase: v => v * 0.0283495,  fromBase: v => v / 0.0283495 },
      { key: 'lb',  label: 'Pound',     toBase: v => v * 0.453592,   fromBase: v => v / 0.453592  },
      { key: 'st',  label: 'Stone',     toBase: v => v * 6.35029,    fromBase: v => v / 6.35029   },
    ],
  },
  {
    key: 'temp', label: 'Temperature', icon: '🌡',
    units: [
      { key: 'C', label: 'Celsius',    toBase: v => v,                fromBase: v => v                },
      { key: 'F', label: 'Fahrenheit', toBase: v => (v-32)*5/9,       fromBase: v => v*9/5+32         },
      { key: 'K', label: 'Kelvin',     toBase: v => v - 273.15,       fromBase: v => v + 273.15       },
    ],
  },
]

const category = ref('length')
const value    = ref(1)
const fromUnit = ref('m')
const toUnit   = ref('ft')

const currentCat   = computed(() => categories.find(c => c.key === category.value)!)
const currentUnits = computed(() => currentCat.value.units)

function setCategory(key: string) {
  category.value = key
  fromUnit.value = currentCat.value.units[0].key
  toUnit.value   = currentCat.value.units[1].key
}

function convert(v: number, from: string, to: string) {
  const fu = currentUnits.value.find(u => u.key === from)!
  const tu = currentUnits.value.find(u => u.key === to)!
  const base = fu.toBase(v)
  return tu.fromBase(base)
}

const result = computed(() => {
  const r = convert(value.value, fromUnit.value, toUnit.value)
  return parseFloat(r.toFixed(6))
})

function convertTo(to: string) {
  return parseFloat(convert(value.value, fromUnit.value, to).toFixed(6))
}

function swapUnits() { [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value] }
</script>
