const Candidato = require('./candidatosModel');
const bcrypt = require('bcrypt');

async function obterTodosCandidatos() {
  return await Candidato.find();
}

async function criarCandidato(dados) {
  if (dados.senha) {
      const saltRounds = 10;
      dados.senha = await bcrypt.hash(dados.senha, saltRounds);
    }

  const candidato = new Candidato(dados);
  return await candidato.save();
}

async function obterCandidatoPorId(id) {
  return await Candidato.findById(id);
}

async function atualizarCandidato(id, dados) {
  if (dados.senha) {
      const saltRounds = 10;
      dados.senha = await bcrypt.hash(dados.senha, saltRounds);
    }
  
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