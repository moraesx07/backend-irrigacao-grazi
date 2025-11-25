import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";

// POST /signup
export const signup = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
    }

    const existingUser = await userModel.findByUsuario(usuario);
    if (existingUser) {
      return res.status(409).json({ message: "Este usuário já existe." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const newUser = await userModel.create(usuario, senhaHash);

    res.status(201).json({ message: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// POST /signin (login com token)
export const signin = async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
    }

    const user = await userModel.findByUsuario(usuario);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    // Cria o token JWT
    const payload = { id: user.id, usuario: user.usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login bem-sucedido!",
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// GET /usuario (agora livre, sem token)
export const getUser = async (req, res) => {
  try {
    const { id } = req.body; // agora o frontend pode enviar o ID ou usar outro método
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

// GET /signout
export const signout = (req, res) => {
  res.json({ message: "Logout realizado. Por favor, apague o token no cliente." });
};
