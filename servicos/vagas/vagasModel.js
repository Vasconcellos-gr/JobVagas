const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  // 🚀 CRUCIAL: Liga a vaga à empresa que a criou
  empresaId: {
    type: String, 
    required: true
  },
  // 🚀 Nome da empresa para mostrar no card
  empresaNome: {
    type: String,
    required: true
  },
  localizacao: { // Ajustado para bater com o front-end
    type: String,
    required: true
  },
  tipo: {
    type: String,
    // 🚀 Adicionado "Híbrido" para não dar erro com o seu HTML
    enum: ['CLT', 'PJ', 'Temporário', 'Híbrido'], 
    required: true
  },
  salario: {
    type: String,
    required: true
  },
  tags: {
    type: [String], // 🚀 Salva as tags como um array/lista de palavras
    default: []
  },
  descricao: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vaga', vagaSchema);