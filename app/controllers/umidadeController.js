import * as umidadeModel from "../models/umidadeModel.js";
import * as aguaModel from "../models/aguaModel.js";

// Adiciona nova leitura de umidade e controla a bomba automaticamente
export const addUmidade = async (req, res) => {
  try {
    const { valor } = req.body;
    if (valor === undefined) {
      return res.status(400).json({ message: "Valor de umidade não fornecido." });
    }

    const leitura = await umidadeModel.salvarLeitura(valor);
    console.log("Nova leitura registrada:", leitura);

    const LIMITE_MINIMO = 20;
    const LIMITE_MAXIMO = 80;

    const ultimaAgua = await aguaModel.findLast();
    const estadoAtual = ultimaAgua ? ultimaAgua.ligada : 0;
    let novaBomba = estadoAtual;

    if (valor < LIMITE_MINIMO && estadoAtual === 0) novaBomba = 1;
    else if (valor >= LIMITE_MAXIMO && estadoAtual === 1) novaBomba = 0;

    if (novaBomba !== estadoAtual) await aguaModel.create(novaBomba);

    res.status(200).json({
      message: "Leitura registrada e decisão tomada.",
      leitura,
      bombaLigada: novaBomba,
    });
  } catch (error) {
    console.error("Erro ao registrar umidade:", error);
    res.status(500).json({ message: "Erro ao registrar umidade." });
  }
};

// Últimas 15 leituras
export const getHistorico = async (req, res) => {
  try {
    const historico = await umidadeModel.findLast15();
    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de umidade.", error: error.message });
  }
};

// Última leitura
export const getUltimaLeitura = async (req, res) => {
  try {
    const leitura = await umidadeModel.getUltimaLeitura();
    res.json(leitura);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar última leitura de umidade.", error: error.message });
  }
};
