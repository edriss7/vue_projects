<template>
  <ProjectLayout title="Expense Tracker">
    <div class="card">
      <!-- Summary -->
      <div class="stat-grid">
        <div class="stat-box">
          <div class="val" style="color:var(--text)">{{ currencyFmt(balance) }}</div>
          <div class="lbl">Balance</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--green)">{{ currencyFmt(totalIncome) }}</div>
          <div class="lbl">Income</div>
        </div>
        <div class="stat-box">
          <div class="val" style="color:var(--red)">{{ currencyFmt(totalExpense) }}</div>
          <div class="lbl">Expenses</div>
        </div>
      </div>

      <div class="divider" />

      <!-- Add Transaction -->
      <h4 style="margin-bottom:12px">Add Transaction</h4>
      <div class="col" style="gap:10px">
        <input v-model="newDesc"  class="input" placeholder="Description (e.g. Salary, Rent)" />
        <div class="row">
          <input v-model.number="newAmount" type="number" class="input" placeholder="Amount" style="flex:1" />
          <select v-model="newType" class="input" style="width:140px">
            <option value="income">+ Income</option>
            <option value="expense">− Expense</option>
          </select>
        </div>
        <button class="btn btn-primary" style="align-self:flex-start" @click="add">Add Transaction</button>
      </div>

      <div class="divider" />

      <!-- History -->
      <h4 style="margin-bottom:12px">Transaction History</h4>
      <div v-if="transactions.length === 0" style="color:var(--text2);text-align:center;padding:16px 0">
        No transactions yet.
      </div>
      <div
        v-for="t in [...transactions].reverse()"
        :key="t.id"
        class="expense-item"
        :class="t.type"
      >
        <span>{{ t.desc }}</span>
        <div style="display:flex;align-items:center;gap:12px">
          <span :style="{ color: t.type === 'income' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }">
            {{ t.type === 'income' ? '+' : '−' }}{{ currencyFmt(Math.abs(t.amount)) }}
          </span>
          <button class="btn btn-sm btn-danger" @click="remove(t.id)">✕</button>
        </div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Transaction { id: number; desc: string; amount: number; type: 'income' | 'expense' }

const transactions = ref<Transaction[]>([
  { id: 1, desc: 'Salary',        amount: 3000, type: 'income'  },
  { id: 2, desc: 'Rent',          amount: 900,  type: 'expense' },
  { id: 3, desc: 'Groceries',     amount: 150,  type: 'expense' },
  { id: 4, desc: 'Freelance work',amount: 500,  type: 'income'  },
])

const newDesc   = ref('')
const newAmount = ref<number | null>(null)
const newType   = ref<'income' | 'expense'>('income')

const totalIncome  = computed(() => transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))
const totalExpense = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
const balance      = computed(() => totalIncome.value - totalExpense.value)

function currencyFmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 })
}

function add() {
  if (!newDesc.value.trim() || !newAmount.value || newAmount.value <= 0) return
  transactions.value.push({ id: Date.now(), desc: newDesc.value.trim(), amount: newAmount.value, type: newType.value })
  newDesc.value = ''; newAmount.value = null
}

function remove(id: number) {
  transactions.value = transactions.value.filter(t => t.id !== id)
}
</script>
