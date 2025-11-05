import * as aguaModel from "../models/aguaModel.js";
import mqttClient from "../../mqtt.js";

// Alterna manualmente o estado da bomba
export const setAgua = async (req, res) => {
  try {
    const ultimoEstado = await aguaModel.findLast();
    const estadoAtual = ultimoEstado ? ultimoEstado.ligada : 0;
    const novoEstado = estadoAtual ? 0 : 1;

    const registro = await aguaModel.create(novoEstado);
    const comando = novoEstado ? "LIGAR" : "DESLIGAR";

    mqttClient.publish("irrigador/comando", comando);
    console.log(`📡 Comando manual via MQTT: ${comando}`);

    res.status(201).json({
      message: `Irrigação ${novoEstado ? "LIGADA" : "DESLIGADA"}.`,
      data: registro,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// Liga manualmente
export const ligarAgua = async (req, res) => {
  try {
    const registro = await aguaModel.create(1);
    mqttClient.publish("irrigador/comando", "LIGAR");
    console.log("🚿 Bomba ligada manualmente via rota /agua/ligar");

    res.status(201).json({ message: "Bomba ligada manualmente.", data: registro });
  } catch (error) {
    res.status(500).json({ message: "Erro ao ligar a bomba.", error: error.message });
  }
};

// Desliga manualmente
export const desligarAgua = async (req, res) => {
  try {
    const registro = await aguaModel.create(0);
    mqttClient.publish("irrigador/comando", "DESLIGAR");
    console.log("🌤️ Bomba desligada manualmente via rota /agua/desligar");

    res.status(201).json({ message: "Bomba desligada manualmente.", data: registro });
  } catch (error) {
    res.status(500).json({ message: "Erro ao desligar a bomba.", error: error.message });
  }
};

// Retorna o estado atual
export const getAgua = async (req, res) => {
  try {
    const ultimoEstado = await aguaModel.findLast();
    if (!ultimoEstado) {
      return res.json({ ligada: 0, message: "Sem registros, assumindo desligada." });
    }

    res.json({
      ligada: ultimoEstado.ligada,
      statusTexto: ultimoEstado.ligada ? "🚿 Ligada" : "🌤️ Desligada",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter status.", error: error.message });
  }
};

// Retorna status simplificado (para o app exibir)
export const getStatus = async (req, res) => {
  try {
    const ultimoEstado = await aguaModel.findLast();
    const ligada = ultimoEstado ? !!ultimoEstado.ligada : false;

    res.json({
      ligada,
      texto: ligada ? "🚿 Ligada" : "🌤️ Desligada",
      horario: ultimoEstado?.created_at || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar status.", error: error.message });
  }
};
