const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fetch = require('node-fetch');
const mongoose = require("mongoose");
const verificarToken = require("../middlewares/authMiddleware");
const Usuario = require("../models/Usuario");

// Configuración multer para subir imágenes a /uploads/fotos-perfil
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const dir = path.join(__dirname, "..", "uploads", "fotos-perfil");
      await fs.mkdir(dir, { recursive: true }); // Asegura que la carpeta exista
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.usuario.id + '-' + Date.now() + ext);
  }
});

// Filtro para aceptar solo archivos de imagen
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Ruta protegida para obtener el perfil del usuario
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-contraseña");
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el perfil del usuario." });
  }
});

// Ruta protegida para actualizar el plan seleccionado del usuario
router.put("/plan", verificarToken, async (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ mensaje: "ID de plan no proporcionado." });
  }

  try {
    console.log("Usuario ID:", req.usuario.id);
    console.log("Plan ID recibido:", planId);

    const planesPath = path.join(__dirname, "..", "..", "frontend", "data", "planes.json");
    const planesData = await fs.readFile(planesPath, "utf-8");
    const planes = JSON.parse(planesData);

    const planValido = planes.some(plan => plan.id.toString() === planId.toString());

    if (!planValido) {
      return res.status(400).json({ mensaje: "ID de plan no válido." });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { planSeleccionado: planId.toString() },
      { new: true }
    ).select("-contraseña");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.json({ mensaje: "Plan actualizado con éxito.", usuario });
  } catch (error) {
    console.error("❌ Error al actualizar el plan:", error);
    res.status(500).json({ mensaje: "Error al actualizar el plan.", error: error.message });
  }
});

// DELETE /api/usuario/plan - Eliminar plan seleccionado
router.delete("/plan", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    usuario.planSeleccionado = undefined;
    await usuario.save();

    res.json({ mensaje: "Plan eliminado con éxito." });
  } catch (error) {
    console.error("❌ Error al eliminar el plan:", error);
    res.status(500).json({ mensaje: "Error al eliminar el plan.", error: error.message });
  }
});

// PUT /api/usuario/cambiar-password - Cambiar contraseña del usuario
router.put("/cambiar-password", verificarToken, async (req, res) => {
  const { actual, nueva } = req.body;

  if (!actual || !nueva) {
    return res.status(400).json({ mensaje: "Se requieren la contraseña actual y la nueva." });
  }

  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const coincide = await bcrypt.compare(actual, usuario.contraseña);
    if (!coincide) {
      return res.status(401).json({ mensaje: "La contraseña actual es incorrecta." });
    }

    const salt = await bcrypt.genSalt(10);
    const nuevaHash = await bcrypt.hash(nueva, salt);
    usuario.contraseña = nuevaHash;

    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error("❌ Error al cambiar la contraseña:", error);
    res.status(500).json({ mensaje: "Error al cambiar la contraseña.", error: error.message });
  }
});

// PUT /api/usuario/editar-perfil - Editar nombre y correo del usuario
router.put("/editar-perfil", verificarToken, async (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ mensaje: "Nombre y correo son obligatorios." });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente && usuarioExistente._id.toString() !== req.usuario.id) {
      return res.status(400).json({ mensaje: "El correo ya está en uso por otro usuario." });
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    usuario.nombre = nombre;
    usuario.correo = correo;

    await usuario.save();

    const usuarioActualizado = await Usuario.findById(req.usuario.id).select("-contraseña");
    res.json({ mensaje: "Perfil actualizado con éxito.", usuario: usuarioActualizado });
  } catch (error) {
    console.error("❌ Error al actualizar el perfil:", error);
    res.status(500).json({ mensaje: "Error al actualizar el perfil.", error: error.message });
  }
});

// PUT /api/usuario/foto-perfil - Subir o actualizar foto de perfil
router.put(
  "/foto-perfil",
  verificarToken,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ mensaje: "No se subió ninguna imagen." });
      }

      const usuario = await Usuario.findById(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado." });
      }

      // Eliminar imagen anterior si existía
      if (usuario.fotoPerfil) {
        const fotoAnteriorPath = path.join(__dirname, "..", "uploads", "fotos-perfil", path.basename(usuario.fotoPerfil));
        fs.unlink(fotoAnteriorPath).catch(() => {});
      }

      // Guardar nueva ruta de imagen
      usuario.fotoPerfil = `/uploads/fotos-perfil/${req.file.filename}`;
      await usuario.save();

      res.json({
        mensaje: "Foto de perfil actualizada con éxito.",
        fotoPerfil: usuario.fotoPerfil
      });
    } catch (error) {
      console.error("❌ Error al subir foto de perfil:", error);
      res.status(500).json({
        mensaje: "Error al subir la foto de perfil.",
        error: error.message
      });
    }
  }
);

// DELETE /api/usuario/foto-perfil - Eliminar foto de perfil del usuario
router.delete("/foto-perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Si no hay foto asignada, no hay nada que borrar
    if (!usuario.fotoPerfil) {
      return res.status(400).json({ mensaje: "No hay ninguna foto de perfil para eliminar." });
    }

    const rutaFoto = path.join(__dirname, "..", "uploads", "fotos-perfil", path.basename(usuario.fotoPerfil));

    // Eliminar el archivo del sistema de archivos
    await fs.unlink(rutaFoto).catch(() => {});

    // Quitar referencia a la foto del usuario
    usuario.fotoPerfil = undefined;
    await usuario.save();

    res.json({ mensaje: "Foto de perfil eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar foto de perfil:", error);
    res.status(500).json({ mensaje: "Error al eliminar la foto de perfil.", error: error.message });
  }
});

// DELETE /api/usuario - Eliminar cuenta de usuario (requiere contraseña)
router.delete('/', verificarToken, async (req, res) => {
  const { contraseña } = req.body;

  if (!contraseña) {
    return res.status(400).json({ mensaje: "La contraseña es requerida para eliminar la cuenta." });
  }

  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }

    // Eliminar rutinas y progreso asociados
    const UserRutinas = require("../models/UserRutinas");
    const Progreso = require("../models/Progreso");

    // Usa el mismo formato que en las rutas de userRutinas y progreso
    const userObjectId = new mongoose.Types.ObjectId(usuario._id.toString());

    await Promise.all([
      UserRutinas.deleteOne({ userId: userObjectId }),
      Progreso.deleteOne({ userId: userObjectId })
    ]);

    // Borrar foto de perfil si existe
    if (usuario.fotoPerfil) {
      const fotoPath = path.join(__dirname, '..', 'uploads', 'fotos-perfil', path.basename(usuario.fotoPerfil));
      await fs.unlink(fotoPath).catch(() => { });
    }

    // Eliminar usuario
    await Usuario.findByIdAndDelete(usuario._id);

    return res.json({ mensaje: "Cuenta y datos relacionados eliminados con éxito." });
  } catch (error) {
    console.error("❌ Error al eliminar la cuenta:", error);
    return res.status(500).json({ mensaje: "Error al eliminar la cuenta.", error: error.message });
  }
});

module.exports = router;
