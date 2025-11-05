// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // importa suas rotas
import db from "./database.js"; // importa o database diretamente

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// O database.js já inicializa o banco automaticamente,
// então não precisamos chamar nenhuma função extra aqui.

// Adiciona o prefixo /api para todas as rotas
app.use("/api", routes);

// Teste de status do servidor
app.get("/", (req, res) => {
  res.json({ message: "Servidor rodando com sucesso 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
