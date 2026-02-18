import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback — Express 5 uses app.use() instead of app.get('*', ...)
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`\nVue Projects running at http://localhost:${PORT}\n`)
})
