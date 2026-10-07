const mongoose = require('mongoose');

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