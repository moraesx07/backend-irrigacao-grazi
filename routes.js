import { Router } from "express";
import * as authController from "./app/controllers/authController.js";
import * as umidadeController from "./app/controllers/umidadeController.js";
import * as aguaController from "./app/controllers/aguaController.js";
import { authenticateToken } from "./app/middleware/authMiddleware.js";

const router = Router();

/* ==========================
   ROTAS DE AUTENTICAÇÃO (PÚBLICAS)
   ========================== */
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);

/* ==========================
   ROTAS DE USUÁRIO (PROTEGIDAS)
   ========================== */
router.get("/usuario", authenticateToken, authController.getUser);

/* ==========================
   ROTAS DE UMIDADE (PROTEGIDAS)
   ========================== */

// 🚀 Nova rota para o Arduino enviar leituras de umidade
router.post("/umidade", authenticateToken, umidadeController.addUmidade);

// Retorna o histórico das últimas 15 leituras
router.get("/historicoumidade", authenticateToken, umidadeController.getHistorico);

// Retorna a última leitura registrada
router.get("/umidade/ultima", authenticateToken, umidadeController.getUltimaLeitura);

/* ==========================
   ROTAS DE CONTROLE DE ÁGUA (PROTEGIDAS)
   ========================== */

// Alterna manualmente o estado da bomba (liga/desliga)
router.post("/agua", authenticateToken, aguaController.setAgua);

// Liga manualmente a bomba
router.post("/agua/ligar", authenticateToken, aguaController.ligarAgua);

// Desliga manualmente a bomba
router.post("/agua/desligar", authenticateToken, aguaController.desligarAgua);

// Retorna o estado atual da bomba (ligada/desligada)
router.get("/agua", authenticateToken, aguaController.getAgua);

// Rota de status resumido (pode ser usada pelo app)
router.get("/status", authenticateToken, aguaController.getStatus);

export default router;
