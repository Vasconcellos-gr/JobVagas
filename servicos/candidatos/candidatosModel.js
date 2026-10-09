const mongoose = require('mongoose');

const candidatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  perfil: { type: String, required: true },
  experiencia: { type: String, required: true },
  linkedin: { type: String },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidato', candidatoSchema);