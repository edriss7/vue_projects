<template>
  <ProjectLayout title="Timezone Converter">
    <div class="card">
      <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap;margin-bottom:20px">
        <div class="col" style="flex:1;min-width:140px">
          <label class="label">Time</label>
          <input v-model="inputTime" type="time" class="input" />
        </div>
        <div class="col" style="flex:1;min-width:180px">
          <label class="label">From Timezone</label>
          <select v-model="fromTz" class="input">
            <option v-for="tz in tzList" :key="tz.zone" :value="tz.zone">{{ tz.label }}</option>
          </select>
        </div>
        <div class="col" style="flex:1;min-width:140px">
          <label class="label">Date</label>
          <input v-model="inputDate" type="date" class="input" />
        </div>
      </div>

      <label class="label">Converted Times</label>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div v-for="tz in tzList" :key="tz.zone"
          style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--bg3);border-radius:8px"
          :style="{ borderLeft: tz.zone === fromTz ? '4px solid var(--accent)' : '4px solid transparent' }"
        >
          <div>
            <div style="font-weight:700;font-size:0.9rem">{{ tz.city }}</div>
            <div style="color:var(--text2);font-size:0.78rem">{{ tz.zone }}</div>
          </div>
          <div style="text-align:right">
            <div style="font-family:monospace;font-size:1.1rem;font-weight:700">{{ convert(tz.zone) }}</div>
            <div style="color:var(--text2);font-size:0.78rem">{{ tz.offset }}</div>
          </div>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const now       = new Date()
const inputTime = ref(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
const inputDate = ref(now.toISOString().split('T')[0])
const fromTz    = ref('America/New_York')

const tzList = [
  { zone: 'UTC',                city: 'UTC / GMT',       offset: 'UTC+0',  label: 'UTC — London (Winter)'  },
  { zone: 'Europe/London',      city: 'London',          offset: 'GMT±0/+1',label: 'Europe/London'         },
  { zone: 'Europe/Paris',       city: 'Paris / Berlin',  offset: 'UTC+1/2', label: 'Europe/Paris'           },
  { zone: 'Europe/Moscow',      city: 'Moscow',          offset: 'UTC+3',   label: 'Europe/Moscow'          },
  { zone: 'Asia/Dubai',         city: 'Dubai',           offset: 'UTC+4',   label: 'Asia/Dubai'             },
  { zone: 'Asia/Kolkata',       city: 'Mumbai / Delhi',  offset: 'UTC+5:30',label: 'Asia/Kolkata'           },
  { zone: 'Asia/Shanghai',      city: 'Beijing / Shanghai',offset:'UTC+8',  label: 'Asia/Shanghai'          },
  { zone: 'Asia/Tokyo',         city: 'Tokyo',           offset: 'UTC+9',   label: 'Asia/Tokyo'             },
  { zone: 'Australia/Sydney',   city: 'Sydney',          offset: 'UTC+10/11',label:'Australia/Sydney'       },
  { zone: 'America/New_York',   city: 'New York',        offset: 'UTC-5/-4',label: 'America/New_York'       },
  { zone: 'America/Chicago',    city: 'Chicago',         offset: 'UTC-6/-5',label: 'America/Chicago'        },
  { zone: 'America/Los_Angeles',city: 'Los Angeles',     offset: 'UTC-8/-7',label: 'America/Los_Angeles'    },
  { zone: 'America/Sao_Paulo',  city: 'São Paulo',       offset: 'UTC-3',   label: 'America/Sao_Paulo'      },
]

function convert(targetTz: string) {
  try {
    const [h, m] = inputTime.value.split(':').map(Number)
    const d = new Date(`${inputDate.value}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
    const fromFmt = new Intl.DateTimeFormat('en-US', { timeZone: fromTz.value, hour:'2-digit', minute:'2-digit', hour12: false })
    const toFmt   = new Intl.DateTimeFormat('en-US', { timeZone: targetTz,     hour:'2-digit', minute:'2-digit', hour12: false })
    // offset trick: calculate difference
    const fromOffset = getOffset(fromTz.value, d)
    const toOffset   = getOffset(targetTz, d)
    const diff = toOffset - fromOffset
    const adjusted = new Date(d.getTime() + diff * 60000)
    return toFmt.format(adjusted)
  } catch { return '—' }
}

function getOffset(tz: string, date: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
  const parts = fmt.formatToParts(date)
  const tzName = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT+0'
  const match = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) return 0
  const sign = match[1] === '+' ? 1 : -1
  return sign * (parseInt(match[2]) * 60 + (match[3] ? parseInt(match[3]) : 0))
}
</script>
