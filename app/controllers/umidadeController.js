import * as umidadeModel from "../models/umidadeModel.js";
import * as aguaModel from "../models/aguaModel.js";

export const addUmidade = async (req, res) => {
  try {
    const { valor } = req.body;
    if (valor === undefined) {
      return res.status(400).json({ message: "Valor de umidade não fornecido." });
    }

    // Salva leitura no banco
    const leitura = await umidadeModel.salvarLeitura(valor);
    console.log("Nova leitura registrada:", leitura);

    // --- Controle automático ---
    // Defina aqui o limite de umidade mínima para acionar a bomba
    const LIMITE_MINIMO = 40;

    let ligada;
    if (valor < LIMITE_MINIMO) {
      ligada = 1; // liga bomba
    } else {
      ligada = 0; // desliga bomba
    }

    // Registra novo estado na tabela agua
    await aguaModel.create(ligada);

    return res.status(200).json({
      message: "Leitura registrada e decisão tomada.",
      leitura,
      bombaLigada: ligada,
    });
  } catch (error) {
    console.error("Erro ao registrar umidade:", error);
    res.status(500).json({ message: "Erro ao registrar umidade." });
  }
};

export const getHistorico = async (req, res) => {
  try {
    const historico = await umidadeModel.findLast15();
    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ message: "Erro ao buscar histórico de umidade." });
  }
};

export const getUltimaLeitura = async (req, res) => {
  try {
    const ultima = await umidadeModel.findLast();
    if (!ultima) {
      return res.status(404).json({ message: "Nenhuma leitura encontrada." });
    }
    res.status(200).json(ultima);
  } catch (error) {
    console.error("Erro ao buscar última leitura:", error);
    res.status(500).json({ message: "Erro ao buscar última leitura." });
  }
};
