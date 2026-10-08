const mongoose = require('mongoose');

const candidatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  perfil: { type: String, required: true },
  experiencia: { type: String, required: true },
  telefone: { type: String },
  cv: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidato', candidatoSchema);