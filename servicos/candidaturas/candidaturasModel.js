const mongoose = require('mongoose');

const candidaturaSchema = new mongoose.Schema({
  vagaId: { type: String, required: true },
  candidatoId: { type: String, required: true },
  candidatoNome: { type: String },
  candidatoEmail: { type: String },
  curriculo: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, default: 'Nova' }, // <-- Adicione esta linha
  dataCandidatura: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidatura', candidaturaSchema);