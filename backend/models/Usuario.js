const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  planSeleccionado: {
    type: String,
    default: null
  },
  fotoPerfil: {
    type: String,
    default: null // o una URL por defecto a una imagen genérica
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
