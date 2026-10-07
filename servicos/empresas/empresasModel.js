const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  setor: {
    type: String,
    required: true
  },
  localizacao: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Empresa', empresaSchema);