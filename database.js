import sqlite3 from "sqlite3";

// Habilita o modo verboso para mais detalhes no console
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
    initDb();
  }
});

async function initDb() {
  db.serialize(() => {
    // Tabela de Usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Histórico de Umidade
    db.run(`
      CREATE TABLE IF NOT EXISTS umidade (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Controle da Água
    db.run(`
      CREATE TABLE IF NOT EXISTS agua (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ligada INTEGER NOT NULL, -- 0 para false, 1 para true
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- TRIGGERS para atualizar 'updated_at' ---

    db.run(`
      CREATE TRIGGER IF NOT EXISTS trigger_usuarios_updated_at
      AFTER UPDATE ON usuarios
      FOR EACH ROW
      BEGIN
        UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);

    db.run(`
      CREATE TRIGGER IF NOT EXISTS trigger_umidade_updated_at
      AFTER UPDATE ON umidade
      FOR EACH ROW
      BEGIN
        UPDATE umidade SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);

    db.run(`
      CREATE TRIGGER IF NOT EXISTS trigger_agua_updated_at
      AFTER UPDATE ON agua
      FOR EACH ROW
      BEGIN
        UPDATE agua SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
    `);

    console.log("Banco de dados inicializado com sucesso.");

    // -------------------------------------------------------
    // 🔥 Criar usuário ADM automaticamente se não existir 🔥
    // -------------------------------------------------------

    db.get("SELECT * FROM usuarios WHERE usuario = 'adm'", async (err, row) => {
      if (err) {
        console.error("Erro ao verificar usuário ADM:", err.message);
        return;
      }

      if (!row) {
        console.log("Criando usuário ADM padrão...");

        const bcrypt = await import("bcryptjs");
        const senhaHash = bcrypt.default.hashSync("minha_senha_123", 10);

        db.run(
          "INSERT INTO usuarios (usuario, senha) VALUES (?, ?)",
          ["adm", senhaHash],
          (err) => {
            if (err) {
              console.error("Erro ao criar ADM:", err.message);
            } else {
              console.log("Usuário ADM criado com sucesso!");
            }
          }
        );
      } else {
        console.log("ADM já existe, não será recriado.");
      }
    });

    // -------------------------------------------------------
  });
}

export default db;