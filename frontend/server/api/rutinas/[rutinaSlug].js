import fs from 'fs/promises'
import path from 'path'
import { sendError, createError } from 'h3'

const dbPath = path.resolve('./db.json')

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'DELETE') {
    return sendError(event, createError({ statusCode: 405, statusMessage: 'Método no permitido' }))
  }

  try {
    const rutinaSlug = event.context.params.rutinaSlug

    // Esperamos userId en body para identificar al usuario que quiere borrar la rutina
    const body = await readBody(event)
    const { userId } = body
    if (!userId) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Falta userId en la petición' }))
    }

    // Leer base de datos
    const data = await fs.readFile(dbPath, 'utf-8')
    const db = JSON.parse(data)

    // Encontrar usuario
    const user = db.users.find(u => u.id === userId)
    if (!user) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' }))
    }

    if (!Array.isArray(user.rutinasSeleccionadas)) {
      user.rutinasSeleccionadas = []
    }

    // Filtrar rutinas eliminando la que coincide con rutinaSlug
    const rutinasAntes = user.rutinasSeleccionadas.length
    user.rutinasSeleccionadas = user.rutinasSeleccionadas.filter(slug => slug !== rutinaSlug)

    if (rutinasAntes === user.rutinasSeleccionadas.length) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Rutina no encontrada en usuario' }))
    }

    // Guardar cambios
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2))

    return { mensaje: 'Rutina eliminada correctamente' }
  } catch (error) {
    console.error('Error eliminando rutina:', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Error interno del servidor' }))
  }
})
