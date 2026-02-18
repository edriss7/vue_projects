<template>
  <ProjectLayout title="Markdown Preview">
    <div class="md-editor">
      <div class="col">
        <label class="label">Markdown Input</label>
        <textarea v-model="source" class="input" style="min-height:320px;font-family:monospace;font-size:0.9rem" />
      </div>
      <div class="col">
        <label class="label">Rendered Preview</label>
        <div class="md-preview" v-html="rendered" />
      </div>
    </div>
    <p style="color:var(--text2);font-size:0.8rem;margin-top:12px">
      Supports: # headings, **bold**, *italic*, `code`, ```blocks```, &gt;blockquote, - lists, [links](url), ---
    </p>
  </ProjectLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectLayout from './ProjectLayout.vue'

const source = ref(`# Welcome to Markdown Preview

This is a **live preview** of your Markdown. Try editing the left panel!

## Features

- **Bold text** and *italic text*
- Inline \`code\` snippets
- Blockquotes
- [Hyperlinks](https://vuejs.org)

### Code Block

\`\`\`
const greeting = 'Hello, Vue 3!'
console.log(greeting)
\`\`\`

> Markdown is a lightweight markup language with plain text formatting syntax.

---

Start typing to see changes in real time.
`)

function escape(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

const rendered = computed(() => {
  let html = source.value

  // Code blocks first (prevent inner processing)
  const blocks: string[] = []
  html = html.replace(/```[\s\S]*?```/g, (m) => {
    blocks.push(`<pre><code>${escape(m.slice(3, -3).replace(/^\n/, ''))}</code></pre>`)
    return `\x00BLOCK${blocks.length - 1}\x00`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_, c) => `<code>${escape(c)}</code>`)

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm,  '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm,    '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm,     '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm,      '<h1>$1</h1>')

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g,         '<em>$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

  // Lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // HR
  html = html.replace(/^---$/gm, '<hr/>')

  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><(h[1-6]|ul|ol|li|pre|blockquote|hr)/g, '<$1')
  html = html.replace(/<\/(h[1-6]|ul|ol|li|pre|blockquote|hr)><\/p>/g, '</$1>')

  // Restore code blocks
  html = html.replace(/\x00BLOCK(\d+)\x00/g, (_, i) => blocks[parseInt(i)])

  return html
})
</script>
