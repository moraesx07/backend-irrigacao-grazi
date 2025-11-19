#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define PINO_SENSOR 34
#define PINO_AGUA 4
#define LED 2

const char* WIFI_SSID = "ME CHAMA DE LINDO";
const char* WIFI_PASS = "EU-AMO-GRAZIANI";

const char* URL_BACKEND = "https://lonely-cobweb-4jq7r5797wwrcq5wr-3000.app.github.dev/api/";
String token;

const int UMIDADE_MIN = 20; // Liga bomba
const int UMIDADE_MAX = 80; // Desliga bomba

bool manualMode = false;  // true se o usuário apertar botão manual
int manualState = 0;      // 1 = ligar, 0 = desligar

void setup() {
  Serial.begin(115200);
  pinMode(PINO_AGUA, OUTPUT);
  pinMode(LED, OUTPUT);
  digitalWrite(PINO_AGUA, LOW);

  conectarWiFi();
  token = login("adm", "minha_senha_123");
}

void loop() {
  int umidade = lerUmidade();
  Serial.print("Umidade: ");
  Serial.println(umidade);

  // Envia leitura para o backend
  enviarUmidade(umidade);

  // Verifica estado manual
  if (manualMode) {
    if (manualState == 1) ligarBomba();
    else desligarBomba();
  } else {
    // Controle automático
    if (umidade <= UMIDADE_MIN) ligarBomba();
    if (umidade >= UMIDADE_MAX) desligarBomba();
  }

  delay(3000); // 3 segundos entre leituras
}

// --- Funções ---
void conectarWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado! IP: " + WiFi.localIP().toString());
}

String login(const char* usuario, const char* senha) {
  HTTPClient http;
  String url = String(URL_BACKEND) + "signin";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  DynamicJsonDocument doc(256);
  doc["usuario"] = usuario;
  doc["senha"] = senha;
  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  String tkn = "";
  if (code == 200) {
    String resp = http.getString();
    DynamicJsonDocument resDoc(512);
    deserializeJson(resDoc, resp);
    tkn = resDoc["token"].as<String>();
    Serial.println("Token recebido: " + tkn);
  } else {
    Serial.println("Falha login: " + String(code));
  }
  http.end();
  return tkn;
}

int lerUmidade() {
  int valor = analogRead(PINO_SENSOR);
  int porcentagem = map(valor, 2500, 1070, 0, 100);
  porcentagem = constrain(porcentagem, 0, 100);
  return porcentagem;
}

void enviarUmidade(int umidade) {
  HTTPClient http;
  String url = String(URL_BACKEND) + "umidade";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + token);

  DynamicJsonDocument doc(128);
  doc["valor"] = umidade;
  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  if (code == 200) Serial.println("Umidade enviada!");
  else Serial.println("Erro envio umidade: " + String(code));

  http.end();
}

void ligarBomba() {
  digitalWrite(PINO_AGUA, HIGH);
  Serial.println("Bomba LIGADA");
}

void desligarBomba() {
  digitalWrite(PINO_AGUA, LOW);
  Serial.println("Bomba DESLIGADA");
}

// Chamadas externas para controle manual via botão app
void ligarManual() {
  manualMode = true;
  manualState = 1;
}

void desligarManual() {
  manualMode = true;
  manualState = 0;
}

void voltarAutomatico() {
  manualMode = false;
}