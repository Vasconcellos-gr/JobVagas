const Empresa = require('./empresasModel');

async function obterTodasEmpresas() {
  return await Empresa.find();
}

async function criarEmpresa(dados) {
  const empresa = new Empresa(dados);
  return await empresa.save();
}

async function obterEmpresaPorId(id) {
  return await Empresa.findById(id);
}

async function atualizarEmpresa(id, dados) {
  return await Empresa.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarEmpresa(id) {
  return await Empresa.findByIdAndDelete(id);
}

module.exports = {
  obterTodasEmpresas,
  criarEmpresa,
  obterEmpresaPorId,
  atualizarEmpresa,
  deletarEmpresa
};