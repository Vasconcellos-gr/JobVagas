const Vaga = require('./vagasModel');

async function obterTodasVagas() {
  return await Vaga.find();
}

async function criarVaga(dados) {
  const vaga = new Vaga(dados);
  return await vaga.save();
}

async function obterVagaPorId(id) {
  return await Vaga.findById(id);
}

async function atualizarVaga(id, dados) {
  return await Vaga.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarVaga(id) {
  return await Vaga.findByIdAndDelete(id);
}

module.exports = {
  obterTodasVagas,
  criarVaga,
  obterVagaPorId,
  atualizarVaga,
  deletarVaga
};