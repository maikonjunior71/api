
import express from "express"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(express.json())

const filePath = path.join(__dirname, "data", "instancias.json")

app.get("/api/instancia", async (req, res) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(raw)
    res.json(data.lista[data.atual])
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler instâncias" })
  }
})

app.post("/api/instancia/next", async (req, res) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(raw)
    data.atual = (data.atual + 1) % data.lista.length
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    res.json({ atual: data.atual })
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar instância" })
  }
})

app.get("/api/instancia/quantidade", async (req, res) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(raw)
    res.json({ total: data.lista.length })
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar instâncias" })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("API rodando na porta", PORT))
