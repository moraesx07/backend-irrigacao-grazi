import { Router } from "express";
import * as authController from "../app/controllers/authController.js";
import * as umidadeController from "../app/controllers/umidadeController.js";
import * as aguaController from "../app/controllers/aguaController.js";
import { authenticateToken } from "../app/middleware/authMiddleware.js";

const router = Router();

/* ==========================
   ROTAS PÚBLICAS PARA O ESP32
   ========================== */

// ESP32 envia leitura SEM TOKEN
router.post("/leitura", umidadeController.addUmidade);

// ESP32 pega o estado da bomba SEM TOKEN
router.get("/estado", aguaController.getAgua);

// ESP32 pega status simplificado SEM TOKEN
router.get("/status", aguaController.getStatus);

/* ==========================
   AUTENTICAÇÃO
   ========================== */
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);

/* ==========================
   USUÁRIO (PROTEGIDO)
   ========================== */
router.get("/usuario", authenticateToken, authController.getUser);

/* ==========================
   UMIDADE (PROTEGIDO PELO APP)
   ========================== */
router.get("/historicoumidade", authenticateToken, umidadeController.getHistorico);
router.get("/umidade/ultima", authenticateToken, umidadeController.getUltimaLeitura);

/* ==========================
   ÁGUA (PROTEGIDO — APENAS PARA O APP)
   ========================== */
router.post("/agua", authenticateToken, aguaController.setAgua);
router.post("/agua/ligar", authenticateToken, aguaController.ligarAgua);
router.post("/agua/desligar", authenticateToken, aguaController.desligarAgua);

// ⚠️ MAS o GET /agua AGORA É LIVRE para o ESP32
router.get("/agua", aguaController.getAgua);

export default router;
