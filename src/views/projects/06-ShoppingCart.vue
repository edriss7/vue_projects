<template>
  <ProjectLayout title="Shopping Cart">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <!-- Products -->
      <div class="card">
        <h3 style="margin-bottom:16px">Products</h3>
        <div
          v-for="p in products"
          :key="p.id"
          class="cart-item"
        >
          <div>
            <div class="cart-item-name">{{ p.emoji }} {{ p.name }}</div>
            <div class="cart-item-price">${{ p.price.toFixed(2) }}</div>
          </div>
          <button class="btn btn-sm btn-primary" style="margin-left:auto" @click="addToCart(p.id)">
            + Add
          </button>
        </div>
      </div>

      <!-- Cart -->
      <div class="card">
        <h3 style="margin-bottom:16px">Cart
          <span v-if="cartCount" class="badge badge-blue" style="margin-left:8px">{{ cartCount }}</span>
        </h3>

        <div v-if="cartItems.length === 0" style="color:var(--text2);padding:24px 0;text-align:center">
          Your cart is empty
        </div>

        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="cart-item-name">{{ item.emoji }} {{ item.name }}</div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="qty-btn" @click="dec(item.id)">−</button>
            <span style="font-variant-numeric:tabular-nums;width:20px;text-align:center">{{ item.qty }}</span>
            <button class="qty-btn" @click="inc(item.id)">+</button>
            <button class="btn btn-sm btn-danger" @click="removeItem(item.id)">✕</button>
          </div>
        </div>

        <div v-if="cartItems.length" class="divider" />
        <div v-if="cartItems.length" style="display:flex;justify-content:space-between;align-items:center">
          <span class="cart-total">${{ total }}</span>
          <button class="btn btn-success btn-sm" @click="checkout">Checkout</button>
        </div>

        <div v-if="checked" class="msg msg-success mt2">🎉 Order placed! Thank you.</div>
      </div>
    </div>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

interface Product { id: number; name: string; price: number; emoji: string }
interface CartItem extends Product { qty: number }

const products: Product[] = [
  { id: 1, name: 'Vue T-Shirt',    price: 29.99, emoji: '👕' },
  { id: 2, name: 'TypeScript Mug', price: 14.99, emoji: '☕' },
  { id: 3, name: 'Vite Sticker',   price: 4.99,  emoji: '⚡' },
  { id: 4, name: 'Dev Keyboard',   price: 99.99, emoji: '⌨️' },
  { id: 5, name: 'Dark Mode Hat',  price: 19.99, emoji: '🧢' },
  { id: 6, name: 'Node Hoodie',    price: 49.99, emoji: '🟢' },
]

const cart    = ref<Map<number, number>>(new Map())
const checked = ref(false)

const cartItems = computed<CartItem[]>(() =>
  products
    .filter(p => (cart.value.get(p.id) ?? 0) > 0)
    .map(p => ({ ...p, qty: cart.value.get(p.id)! }))
)

const cartCount = computed(() => [...cart.value.values()].reduce((a, b) => a + b, 0))
const total     = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2))

function addToCart(id: number) {
  cart.value = new Map(cart.value).set(id, (cart.value.get(id) ?? 0) + 1)
  checked.value = false
}
function inc(id: number) { addToCart(id) }
function dec(id: number) {
  const cur = cart.value.get(id) ?? 0
  const next = new Map(cart.value)
  if (cur <= 1) next.delete(id); else next.set(id, cur - 1)
  cart.value = next
}
function removeItem(id: number) {
  const next = new Map(cart.value); next.delete(id); cart.value = next
}
function checkout() { checked.value = true; cart.value = new Map() }
</script>
