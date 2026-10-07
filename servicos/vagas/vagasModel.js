const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  empresa: {
    type: String,
    required: true
  },
  local: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['CLT', 'PJ', 'Temporário'],
    required: true
  },
  salario: {
    type: String,
    required: true
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