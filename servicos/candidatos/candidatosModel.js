const mongoose = require('mongoose');

const curriculoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  area: String,
  resumo: String,
  experiencia: String,
  formacao: String,
  competencias: String,
  linkedin: String
}, { _id: false });

const candidatoSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  senha: {
    type: String, 
    required: true 
  },
  telefone: {
    type: String, 
    required: true 
  },
  dataNascimento: { 
    type: Date, 
    required: true 
  },
  perfil: { 
    type: String, 
    required: true 
  },
  experiencia: { 
    type: String, 
    required: true 
  },
  linkedin: { 
    type: String 
  },
  curriculo: {
    type: curriculoSchema,
    default: undefined
  },
  dataCriacao: { 
    type: Date, 
    default: Date.now }
});

module.exports = mongoose.model('Candidato', candidatoSchema);