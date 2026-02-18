<template>
  <ProjectLayout title="Calculator">
    <div class="card" style="max-width:340px;margin:0 auto">
      <div class="calc-display">
        <div class="expr">{{ expression || '&nbsp;' }}</div>
        <div class="val">{{ display }}</div>
      </div>
      <div class="calc-grid">
        <button class="calc-btn clear span2" @click="clear">AC</button>
        <button class="calc-btn op" @click="toggleSign">±</button>
        <button class="calc-btn op" @click="percent">%</button>

        <button v-for="n in ['7','8','9']" :key="n" class="calc-btn" @click="digit(n)">{{ n }}</button>
        <button class="calc-btn op" @click="op('÷')">÷</button>

        <button v-for="n in ['4','5','6']" :key="n" class="calc-btn" @click="digit(n)">{{ n }}</button>
        <button class="calc-btn op" @click="op('×')">×</button>

        <button v-for="n in ['1','2','3']" :key="n" class="calc-btn" @click="digit(n)">{{ n }}</button>
        <button class="calc-btn op" @click="op('−')">−</button>

        <button class="calc-btn span2" @click="digit('0')">0</button>
        <button class="calc-btn" @click="dot">.</button>
        <button class="calc-btn op" @click="op('+')">+</button>

        <button class="calc-btn eq span2" @click="equals">=</button>
        <button class="calc-btn op" @click="backspace">⌫</button>
        <button class="calc-btn op" @click="op('+')"></button>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const display    = ref('0')
const expression = ref('')
let firstOperand  = ''
let operator      = ''
let waitingForSecond = false

function digit(n: string) {
  if (waitingForSecond) { display.value = n; waitingForSecond = false; return }
  display.value = display.value === '0' ? n : display.value + n
}

function dot() {
  if (waitingForSecond) { display.value = '0.'; waitingForSecond = false; return }
  if (!display.value.includes('.')) display.value += '.'
}

function op(o: string) {
  firstOperand = display.value
  operator = o
  expression.value = `${display.value} ${o}`
  waitingForSecond = true
}

function equals() {
  if (!operator || !firstOperand) return
  const a = parseFloat(firstOperand)
  const b = parseFloat(display.value)
  const opMap: Record<string, number> = {
    '+': a + b, '−': a - b, '×': a * b, '÷': b !== 0 ? a / b : NaN,
  }
  const result = opMap[operator] ?? NaN
  expression.value = `${firstOperand} ${operator} ${display.value} =`
  display.value = isNaN(result) ? 'Error' : String(parseFloat(result.toFixed(10)))
  operator = ''; firstOperand = ''; waitingForSecond = false
}

function clear() {
  display.value = '0'; expression.value = ''; operator = ''; firstOperand = ''; waitingForSecond = false
}

function backspace() {
  if (display.value.length > 1) display.value = display.value.slice(0, -1)
  else display.value = '0'
}

function toggleSign() {
  display.value = String(parseFloat(display.value) * -1)
}

function percent() {
  display.value = String(parseFloat(display.value) / 100)
}
</script>
