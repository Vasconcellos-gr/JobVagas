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

async function loginEmpresa(email, senha) {
  // 1. Busca a empresa pelo e-mail
  const empresa = await Empresa.findOne({ email });
  if (!empresa) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 2. Compara a senha digitada com o hash salvo no banco
  const senhaCorreta = await bcrypt.compare(senha, empresa.senha);
  if (!senhaCorreta) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 3. Retorna dados úteis (sem expor a senha)
  return {
    mensagem: 'Login realizado com sucesso!',
    usuario: {
      id: empresa._id,
      nome: empresa.nome,
      email: empresa.email
    }
  };
}

module.exports = {
  obterTodasEmpresas,
  criarEmpresa,
  obterEmpresaPorId,
  atualizarEmpresa,
  deletarEmpresa,
  loginEmpresa
};