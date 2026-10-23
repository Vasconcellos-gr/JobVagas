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

async function obterCurriculoCandidato(id) {
  return await Candidato.findById(id).select('curriculo');
}

async function atualizarCurriculoCandidato(id, curriculo) {
  return await Candidato.findByIdAndUpdate(
    id,
    { $set: { curriculo } },
    { new: true, runValidators: true, select: 'curriculo' }
  );
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

async function loginCandidato(email, senha) {
  // 1. Busca o candidato pelo e-mail
  const candidato = await Candidato.findOne({ email });
  if (!candidato) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 2. Compara a senha digitada com o hash salvo no banco
  const senhaCorreta = await bcrypt.compare(senha, candidato.senha);
  if (!senhaCorreta) {
    throw new Error('E-mail ou senha inválidos.');
  }

  // 3. Retorna dados úteis (sem expor a senha)
  return {
    mensagem: 'Login realizado com sucesso!',
    usuario: {
      id: candidato._id,
      nome: candidato.nome,
      email: candidato.email
    }
  };
}

module.exports = {
  obterTodosCandidatos,
  criarCandidato,
  obterCandidatoPorId,
  obterCurriculoCandidato,
  atualizarCurriculoCandidato,
  atualizarCandidato,
  deletarCandidato,
  loginCandidato
};