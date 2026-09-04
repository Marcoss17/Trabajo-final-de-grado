// server/api/users.js
import fs from 'fs/promises'
import path from 'path'

const dbPath = path.resolve('./db.json')

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method === 'GET') {
    const data = await fs.readFile(dbPath, 'utf-8')
    return JSON.parse(data).users || []
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const data = await fs.readFile(dbPath, 'utf-8')
    const db = JSON.parse(data)

    db.users.push(body)
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2))

    return { success: true }
  }
})
