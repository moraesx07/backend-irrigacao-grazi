import { Router } from "express";
import * as authController from "../app/controllers/authController.js";
import * as umidadeController from "../app/controllers/umidadeController.js";
import * as aguaController from "../app/controllers/aguaController.js";
// import { authenticateToken } from "../app/middleware/authMiddleware.js"; // REMOVIDO

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
router.post("/signin", authController.signin); // Token só aqui
router.get("/signout", authController.signout);

/* ==========================
   USUÁRIO (ANTES PROTEGIDO)
   ========================== */
router.get("/usuario", authController.getUser); // agora livre, sem token

/* ==========================
   UMIDADE (ANTES PROTEGIDO PELO APP)
   ========================== */
router.get("/historicoumidade", umidadeController.getHistorico);
router.get("/umidade/ultima", umidadeController.getUltimaLeitura);

/* ==========================
   ÁGUA (ANTES PROTEGIDO — APENAS PARA O APP)
   ========================== */
router.post("/agua", aguaController.setAgua);
router.post("/agua/ligar", aguaController.ligarAgua);
router.post("/agua/desligar", aguaController.desligarAgua);

// ⚠️ GET /agua já era livre
router.get("/agua", aguaController.getAgua);

export default router;
