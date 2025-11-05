import db from "../../database.js";


export const create = (valor) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO umidade (valor) VALUES (?)", [valor], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, valor });
    });
  });
};

export const findLast15 = () => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM umidade ORDER BY created_at DESC LIMIT 15",
      [],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

export const salvarLeitura = (umidade) => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    db.run(
      "INSERT INTO umidade (valor, created_at) VALUES (?, ?)",
      [umidade, timestamp],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, umidade, timestamp });
      }
    );
  });
};

export const getUltimaLeitura = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM umidade ORDER BY id DESC LIMIT 1", [], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};