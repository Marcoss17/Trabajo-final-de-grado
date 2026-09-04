const mongoose = require('mongoose')

const progresoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  rutinas: [
    {
      rutinaSlug: { type: String, required: true },
      diasCompletados: [Date]
    }
  ]
})

module.exports = mongoose.model('Progreso', progresoSchema)
