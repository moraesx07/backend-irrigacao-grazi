import mqtt from "mqtt";
import * as umidadeModel from "./app/models/umidadeModel.js";
import * as aguaModel from "./app/models/aguaModel.js";

const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

const LIMITE_MIN = 20;
const LIMITE_MAX = 70;

mqttClient.on("connect", () => {
  console.log("✅ Conectado ao broker MQTT!");
  mqttClient.subscribe("irrigador/umidade");
});

mqttClient.on("message", async (topic, message) => {
  if (topic === "irrigador/umidade") {
    const umidade = parseFloat(message.toString());
    if (isNaN(umidade)) return;

    console.log(`🌱 Umidade recebida: ${umidade}%`);
    await umidadeModel.salvarLeitura(umidade);

    // Pega último estado da bomba
    const ultimoEstado = await aguaModel.findLast();
    let estadoAtual = ultimoEstado ? ultimoEstado.ligada : 0;

    // Controle automático
    if (umidade <= LIMITE_MIN && estadoAtual === 0) {
      await aguaModel.create(1);
      mqttClient.publish("irrigador/comando", "LIGAR");
      console.log("🚿 Comando automático: LIGAR");
    } else if (umidade >= LIMITE_MAX && estadoAtual === 1) {
      await aguaModel.create(0);
      mqttClient.publish("irrigador/comando", "DESLIGAR");
      console.log("🌤️ Comando automático: DESLIGAR");
    }
  }
});

export default mqttClient;
