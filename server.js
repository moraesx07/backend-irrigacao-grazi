import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import db from "./database.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas com prefixo /api
app.use("/api", routes);

// Teste de status do servidor
app.get("/", (req, res) => {
  res.json({ message: "Servidor rodando com sucesso 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
