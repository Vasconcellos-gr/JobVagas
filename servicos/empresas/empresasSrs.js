const Empresa = require('./empresasModel');
const bcrypt = require('bcrypt');

async function obterTodasEmpresas() {
  return await Empresa.find();
}

async function criarEmpresa(dados) {
  if (dados.senha) {
    const saltRounds = 10;
    dados.senha = await bcrypt.hash(dados.senha, saltRounds);
  }

  const empresa = new Empresa(dados);
  return await empresa.save();
}

async function obterEmpresaPorId(id) {
  return await Empresa.findById(id);
}

async function atualizarEmpresa(id, dados) {
  if (dados.senha) {
    const saltRounds = 10;
    dados.senha = await bcrypt.hash(dados.senha, saltRounds);
  }
  
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