// routes/index.js
import { Router } from "express";
import * as authController from "../app/controllers/authController.js";
import * as umidadeController from "../app/controllers/umidadeController.js";
import * as aguaController from "../app/controllers/aguaController.js";
import { authenticateToken } from "../app/middleware/authMiddleware.js";

const router = Router();

// ROTAS DE AUTENTICAÇÃO
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);

// ROTAS DE USUÁRIO (PROTEGIDAS)
router.get("/usuario", authenticateToken, authController.getUser);

// ROTAS DE UMIDADE (PROTEGIDAS)
router.post("/umidade", authenticateToken, umidadeController.addUmidade);
router.get("/historicoumidade", authenticateToken, umidadeController.getHistorico);
router.get("/umidade/ultima", authenticateToken, umidadeController.getUltimaLeitura);

// ROTAS DE CONTROLE DE ÁGUA (PROTEGIDAS)
router.post("/agua", authenticateToken, aguaController.setAgua);
router.post("/agua/ligar", authenticateToken, aguaController.ligarAgua);
router.post("/agua/desligar", authenticateToken, aguaController.desligarAgua);
router.get("/agua", authenticateToken, aguaController.getAgua);
router.get("/status", authenticateToken, aguaController.getStatus);

export default router;
