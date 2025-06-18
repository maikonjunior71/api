import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

// Caminhos dos arquivos das instâncias
const filePath1 = path.join(__dirname, "data", "instancias.json");
const filePath2 = path.join(__dirname, "data", "instancias2.json");

// Função para ler o arquivo de instâncias
const readInstances = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

// Função para escrever no arquivo de instâncias
const writeInstances = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// API para a primeira conta de instâncias
app.get("/api/instancia", async (req, res) => {
  try {
    const data = await readInstances(filePath1);
    res.json(data.lista[data.atual]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler instâncias" });
  }
});

app.post("/api/instancia/next", async (req, res) => {
  try {
    const data = await readInstances(filePath1);
    data.atual = (data.atual + 1) % data.lista.length;
    await writeInstances(filePath1, data);
    res.json({ atual: data.atual });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar instância" });
  }
});

app.get("/api/instancia/quantidade", async (req, res) => {
  try {
    const data = await readInstances(filePath1);
    res.json({ total: data.lista.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar instâncias" });
  }
});

// API para a segunda conta de instâncias
app.get("/api/instancia2", async (req, res) => {
  try {
    const data = await readInstances(filePath2);
    res.json(data.lista[data.atual]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler instâncias" });
  }
});

app.post("/api/instancia2/next", async (req, res) => {
  try {
    const data = await readInstances(filePath2);
    data.atual = (data.atual + 1) % data.lista.length;
    await writeInstances(filePath2, data);
    res.json({ atual: data.atual });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar instância" });
  }
});

app.get("/api/instancia2/quantidade", async (req, res) => {
  try {
    const data = await readInstances(filePath2);
    res.json({ total: data.lista.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar instâncias" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API rodando na porta", PORT));
