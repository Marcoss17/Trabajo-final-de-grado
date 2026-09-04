const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Modelos
const Progreso = require('../models/Progreso') // esquema Progreso (igual que antes)
const UserRutinas = require('../models/UserRutinas') // esquema para rutinas seleccionadas

// GET progreso completo para usuario (rutinas seleccionadas + progreso)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    // Buscar rutinas seleccionadas por el usuario
    const userRutinasDoc = await UserRutinas.findOne({ userId })

    // Si no tiene rutinas seleccionadas, devolver array vacío
    const rutinasSeleccionadas = userRutinasDoc?.rutinas || []

    // Buscar progreso para ese usuario
    const progresoDoc = await Progreso.findOne({ userId })

    // Crear arreglo de rutinas con progreso combinado
    const progresoCompleto = rutinasSeleccionadas.map(rutinaSlug => {
      // Buscar progreso para esta rutina
      const rutinaProgreso = progresoDoc?.rutinas.find(r => r.rutinaSlug === rutinaSlug)

      const diasCompletados = rutinaProgreso?.diasCompletados || []
      const porcentajeCompletado = Math.min(100, Math.round((diasCompletados.length / 30) * 100))

      return {
        rutinaSlug,
        diasCompletados,
        porcentajeCompletado
      }
    })

    res.json({ progreso: progresoCompleto })

  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al obtener progreso combinado' })
  }
})

// POST marcar día completado (igual que antes)
router.post('/marcar', async (req, res) => {
  try {
    const { userId, rutinaSlug } = req.body
    if (!userId || !rutinaSlug) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' })
    }

    let progreso = await Progreso.findOne({ userId })

    const hoy = new Date()
    const hoyStr = hoy.toISOString().split('T')[0]

    if (!progreso) {
      progreso = new Progreso({
        userId,
        rutinas: [{ rutinaSlug, diasCompletados: [new Date(hoyStr)] }]
      })
    } else {
      const rutina = progreso.rutinas.find(r => r.rutinaSlug === rutinaSlug)
      if (rutina) {
        const yaMarcado = rutina.diasCompletados.some(d => d.toISOString().split('T')[0] === hoyStr)
        if (yaMarcado) {
          return res.status(400).json({ mensaje: 'Ya has marcado el día de hoy para esta rutina' })
        }
        rutina.diasCompletados.push(new Date(hoyStr))
      } else {
        progreso.rutinas.push({ rutinaSlug, diasCompletados: [new Date(hoyStr)] })
      }
    }

    await progreso.save()
    res.json({ mensaje: 'Día marcado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al marcar día completado' })
  }
})

module.exports = router