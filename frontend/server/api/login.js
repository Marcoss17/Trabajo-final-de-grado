// server/api/login.js
import { readFile } from 'fs/promises'
import { join } from 'path'
import { sendError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Email y contraseña son obligatorios' }))
    }

    const dbPath = join(process.cwd(), 'db.json')
    const data = await readFile(dbPath, 'utf-8')
    const db = JSON.parse(data)
    const user = db.users.find(u => u.email === email && u.password === password)

    if (!user) {
      return sendError(event, createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' }))
    }

    return { message: 'Login exitoso', user }
  } catch (error) {
    console.error('Login error:', error)
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Error interno del servidor' }))
  }
})
