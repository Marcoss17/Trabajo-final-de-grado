const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Registro de usuario
router.post("/registro", async (req, res) => {
  let { nombre, correo, contraseña, planSeleccionado } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: "Por favor completa todos los campos obligatorios." });
  }

  // Convertir correo a minúsculas
  correo = correo.toLowerCase();

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El usuario ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña: contraseñaHasheada,
      planSeleccionado: planSeleccionado || null,
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
});


// Login de usuario
router.post("/login", async (req, res) => {
  let { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Por favor completa todos los campos." });
  }

  // Convertimos el correo a minúsculas
  correo = correo.toLowerCase();

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Credenciales inválidas." });
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!esValida) {
      return res.status(400).json({ mensaje: "Credenciales inválidas." });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        planSeleccionado: usuario.planSeleccionado,
        fechaRegistro: usuario.fechaRegistro,
        fotoPerfil: usuario.fotoPerfil || null,
      },
    });
  } catch (error) {
    console.error("❌ Error en el login:", error.message);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});


module.exports = router;
