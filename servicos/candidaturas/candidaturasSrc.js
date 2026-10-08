const Candidatura = require('./candidaturasModel');

async function obterTodasCandidaturas() {
  return await Candidatura.find()
    .populate('vaga')
    .populate('candidato');
}

async function criarCandidatura(dados) {
  const candidatura = new Candidatura(dados);
  return await candidatura.save();
}

async function obterCandidaturaPorId(id) {
  return await Candidatura.findById(id)
    .populate('vaga')
    .populate('candidato');
}

async function atualizarCandidatura(id, dados) {
  return await Candidatura.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarCandidatura(id) {
  return await Candidatura.findByIdAndDelete(id);
}

module.exports = {
  obterTodasCandidaturas,
  criarCandidatura,
  obterCandidaturaPorId,
  atualizarCandidatura,
  deletarCandidatura
};