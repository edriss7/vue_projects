<template>
  <ProjectLayout title="Progress Wizard">
    <div class="card">
      <!-- Step progress bar -->
      <div style="display:flex;align-items:center;margin-bottom:24px">
        <template v-for="(step, i) in steps" :key="step.title">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;transition:all 0.3s"
              :style="{
                background: i < current ? 'var(--green)' : i === current ? 'var(--accent)' : 'var(--bg3)',
                color: i <= current ? '#fff' : 'var(--text2)',
              }">
              {{ i < current ? '✓' : i + 1 }}
            </div>
            <div style="font-size:0.7rem;color:var(--text2);white-space:nowrap;max-width:60px;text-align:center">{{ step.title }}</div>
          </div>
          <div v-if="i < steps.length - 1" style="flex:1;height:3px;margin:0 4px;margin-bottom:18px;transition:background 0.3s"
            :style="{ background: i < current ? 'var(--green)' : 'var(--bg3)' }" />
        </template>
      </div>

      <!-- Step content -->
      <div style="min-height:220px">
        <!-- Step 1: Personal Info -->
        <div v-if="current === 0">
          <h3 style="margin-bottom:16px">Personal Information</h3>
          <label class="label">Full Name</label>
          <input v-model="data.name" class="input" placeholder="John Doe" />
          <label class="label mt2">Email</label>
          <input v-model="data.email" class="input" type="email" placeholder="john@example.com" />
          <label class="label mt2">Age</label>
          <input v-model.number="data.age" class="input" type="number" min="1" max="120" placeholder="25" />
        </div>

        <!-- Step 2: Account -->
        <div v-if="current === 1">
          <h3 style="margin-bottom:16px">Account Setup</h3>
          <label class="label">Username</label>
          <input v-model="data.username" class="input" placeholder="cooluser42" />
          <label class="label mt2">Password</label>
          <input v-model="data.password" class="input" type="password" placeholder="••••••••" />
          <label class="label mt2">Role</label>
          <select v-model="data.role" class="input">
            <option value="">Select role…</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
            <option>Other</option>
          </select>
        </div>

        <!-- Step 3: Preferences -->
        <div v-if="current === 2">
          <h3 style="margin-bottom:16px">Preferences</h3>
          <label class="label">Theme</label>
          <div class="row" style="gap:8px">
            <button v-for="t in ['Dark','Light','Auto']" :key="t" class="btn btn-sm"
              :class="data.theme === t ? 'btn-primary' : 'btn-secondary'"
              @click="data.theme = t">{{ t }}</button>
          </div>
          <label class="label mt2">Notifications</label>
          <label v-for="opt in ['Email','Push','SMS']" :key="opt" style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:6px;font-size:0.88rem">
            <input type="checkbox" :checked="data.notifs.includes(opt)"
              @change="toggleNotif(opt)" style="accent-color:var(--accent)" />
            {{ opt }}
          </label>
        </div>

        <!-- Step 4: Review -->
        <div v-if="current === 3">
          <h3 style="margin-bottom:16px">Review & Submit</h3>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:0.88rem">
            <div v-for="[k,v] in reviewEntries" :key="k"
              style="display:flex;gap:12px;padding:8px 12px;background:var(--bg3);border-radius:6px">
              <span style="color:var(--text2);min-width:110px;font-weight:600">{{ k }}</span>
              <span style="font-family:monospace">{{ v }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation error -->
      <div v-if="stepError" class="msg msg-error" style="margin-bottom:8px">{{ stepError }}</div>

      <!-- Navigation -->
      <div class="row" style="justify-content:space-between;margin-top:16px">
        <button class="btn btn-secondary" :disabled="current === 0" @click="current--">← Back</button>
        <button v-if="current < steps.length - 1" class="btn btn-primary" @click="next">Next →</button>
        <button v-else class="btn btn-primary" @click="submit" :disabled="submitted">
          {{ submitted ? '✓ Submitted!' : 'Submit' }}
        </button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const steps = [
  { title: 'Personal' },
  { title: 'Account' },
  { title: 'Prefs' },
  { title: 'Review' },
]

const current   = ref(0)
const stepError = ref('')
const submitted = ref(false)

const data = ref({
  name: '', email: '', age: '' as number | '',
  username: '', password: '', role: '',
  theme: 'Dark', notifs: [] as string[],
})

function toggleNotif(opt: string) {
  const idx = data.value.notifs.indexOf(opt)
  if (idx >= 0) data.value.notifs.splice(idx, 1)
  else data.value.notifs.push(opt)
}

function validate(): boolean {
  stepError.value = ''
  if (current.value === 0) {
    if (!data.value.name.trim()) { stepError.value = 'Name is required.'; return false }
    if (!/\S+@\S+\.\S+/.test(data.value.email)) { stepError.value = 'Valid email required.'; return false }
  }
  if (current.value === 1) {
    if (!data.value.username.trim()) { stepError.value = 'Username is required.'; return false }
    if (data.value.password.length < 6) { stepError.value = 'Password must be at least 6 characters.'; return false }
  }
  return true
}

function next() {
  if (validate()) current.value++
}

function submit() {
  submitted.value = true
}

const reviewEntries = computed(() => [
  ['Name', data.value.name],
  ['Email', data.value.email],
  ['Age', String(data.value.age)],
  ['Username', data.value.username],
  ['Role', data.value.role],
  ['Theme', data.value.theme],
  ['Notifications', data.value.notifs.join(', ') || 'None'],
])
</script>
