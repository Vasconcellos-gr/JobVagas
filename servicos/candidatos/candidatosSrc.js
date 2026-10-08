const Candidato = require('./candidatosModel');

async function obterTodosCandidatos() {
  return await Candidato.find();
}

async function criarCandidato(dados) {
  const candidato = new Candidato(dados);
  return await candidato.save();
}

async function obterCandidatoPorId(id) {
  return await Candidato.findById(id);
}

async function atualizarCandidato(id, dados) {
  return await Candidato.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarCandidato(id) {
  return await Candidato.findByIdAndDelete(id);
}

module.exports = {
  obterTodosCandidatos,
  criarCandidato,
  obterCandidatoPorId,
  atualizarCandidato,
  deletarCandidato
};