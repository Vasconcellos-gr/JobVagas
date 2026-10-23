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

const candidaturaSchema = new mongoose.Schema({
  candidatoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidato',
    required: true
  },
  vagaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaga',
    required: true
  },
  curriculo: {
    type: curriculoSchema
  },
  dataCandidatura: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Em análise', 'Aprovada', 'Rejeitada', 'Entrevista agendada'],
    default: 'Em análise'
  }
});

module.exports = mongoose.model('Candidatura', candidaturaSchema);