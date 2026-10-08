const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  telefone: { type: Number, required: true },
  endereco: { type: String },
  bairro: { type: String },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  website: { type: String },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Empresa', empresaSchema);