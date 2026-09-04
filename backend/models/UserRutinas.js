const mongoose = require('mongoose')

const userRutinaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true // importante para que solo haya un doc por usuario
  },
  rutinas: [String], // array de slugs de rutinas
  correo: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('UserRutinas', userRutinaSchema)
