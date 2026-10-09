const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true },
  setor: { type: String, required: true },
  endereco: { type: String },
  bairro: { type: String },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  website: { type: String },
  descricao: { type: String },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Empresa', empresaSchema);