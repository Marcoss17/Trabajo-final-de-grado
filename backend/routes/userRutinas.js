const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserRutinas = require("../models/UserRutinas");
const Progreso = require("../models/Progreso");

// POST /api/usuario/rutinas
router.post('/rutinas', async (req, res) => {
  try {
    console.log('Datos recibidos en backend:', req.body);

    const { userId, correo, rutinaSlug } = req.body;

    if (!userId || !correo || !rutinaSlug) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }

    // Validar que correo sea string no vacío
    if (typeof correo !== 'string' || correo.trim() === '') {
      return res.status(400).json({ mensaje: 'Correo inválido' });
    }

    // Buscar registro de rutinas del usuario
    let registro = await UserRutinas.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (registro) {
      if (registro.rutinas.includes(rutinaSlug)) {
        return res.status(409).json({ mensaje: 'Esta rutina ya fue seleccionada por el usuario.' });
      }
      registro.rutinas.push(rutinaSlug);
      await registro.save();
    } else {
      // Crear nuevo registro con correo y rutinas
      registro = new UserRutinas({
        userId: new mongoose.Types.ObjectId(userId),
        correo: correo,
        rutinas: [rutinaSlug]
      });
      await registro.save();
    }

    res.json({ mensaje: 'Rutina guardada con éxito' });

  } catch (error) {
    console.error('Error en POST /rutinas:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// GET /api/usuario/rutinas/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ mensaje: 'Falta el userId en la URL' });
    }

    const registro = await UserRutinas.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    if (!registro) {
      return res.status(404).json({ mensaje: 'No se encontraron rutinas para este usuario' });
    }

    res.json({ rutinas: registro.rutinas });

  } catch (error) {
    console.error('Error en GET /rutinas/:userId:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// DELETE /api/usuario/rutinas/:userId/:rutinaSlug
router.delete('/:userId/:rutinaSlug', async (req, res) => {
  try {
    const { userId, rutinaSlug } = req.params;

    if (!userId || !rutinaSlug) {
      return res.status(400).json({ mensaje: 'Faltan parámetros necesarios' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Buscar el documento del usuario con rutinas
    const userRutinas = await UserRutinas.findOne({ userId: userObjectId });

    if (!userRutinas) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado en UserRutinas' });
    }

    // Verificar que la rutina exista
    if (!userRutinas.rutinas.includes(rutinaSlug)) {
      return res.status(404).json({ mensaje: 'Rutina no encontrada para este usuario' });
    }

    // Eliminar la rutina del array
    userRutinas.rutinas = userRutinas.rutinas.filter(slug => slug !== rutinaSlug);

    // Actualizar el documento con las rutinas restantes
    await UserRutinas.updateOne(
      { userId: userObjectId },
      { $set: { rutinas: userRutinas.rutinas } }
    );

    // 🔥 Eliminar el progreso de esa rutina específica
    await Progreso.updateOne(
      { userId: userObjectId },
      { $pull: { rutinas: { rutinaSlug } } }
    );

    return res.status(200).json({ mensaje: 'Rutina y progresos eliminados correctamente' });
  } catch (error) {
    console.error('Error en DELETE rutina:', error);
    return res.status(500).json({ mensaje: 'Error del servidor al eliminar rutina' });
  }
});

module.exports = router;
