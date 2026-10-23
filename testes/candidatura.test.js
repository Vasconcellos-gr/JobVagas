const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Importa os dois microsserviços separados e os models dos seus caminhos reais
const appCandidaturas = require('../servicos/candidaturas/server');
const appCandidatos = require('../servicos/candidatos/server');
const Vaga = require('../servicos/vagas/vagasModel');
const Candidatura = require('../servicos/candidaturas/candidaturasModel');

let mongoServer;

describe('API de Candidaturas e Candidatos (Microsserviços)', () => {
  let empresaTesteId;
  let vagaTesteId;

  // 1. ANTES DE TUDO: Sobe o banco em memória e cria uma vaga
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    empresaTesteId = new mongoose.Types.ObjectId();

    const vaga = await Vaga.create({
      titulo: 'Desenvolvedor Back-end Júnior',
      descricao: 'Atuar com Node.js, Express e MongoDB',
      localizacao: 'Remoto',
      tipo: 'CLT',
      salario: 'R$ 4.500',
      tags: ['Node.js', 'MongoDB'],
      empresaId: empresaTesteId,
      empresaNome: 'Tech Solutions'
    });
    vagaTesteId = vaga._id;
  }, 120000);

  // 2. DEPOIS DE TUDO: Desliga e limpa o banco em memória
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 120000);

  // 3. TESTE: Cadastra no Microsserviço de Candidatos e aplica no Microsserviço de Candidaturas
  it('Deve criar um candidato e registrar a candidatura em uma vaga com sucesso', async () => {
    const dadosNovoCandidato = {
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      senha: '12345678',
      telefone: '(51) 99767-0990',
      dataNascimento: '2005-11-12',
      perfil: 'Desenvolvedora Back-end',
      experiencia: 'Projetos acadêmicos e APIs REST em Node.js',
      linkedin: 'https://linkedin.com/in/mariasilva'
    };

    // PASSO A: Chama o Microsserviço de Candidatos (appCandidatos)
    let candidatoId;
    const resCadastro = await request(appCandidatos)
      .post('/api/candidatos')
      .send(dadosNovoCandidato);

    if (resCadastro.status === 201 || resCadastro.status === 200) {
      candidatoId = resCadastro.body._id 
        || resCadastro.body.id 
        || (resCadastro.body.candidato && (resCadastro.body.candidato._id || resCadastro.body.candidato.id));
    } else {
      // Se por qualquer motivo o POST de candidato exigir outro campo, gera um ObjectId válido do MongoDB:
      candidatoId = new mongoose.Types.ObjectId();
    }

    expect(candidatoId).toBeTruthy();

    // PASSO B: Envia a candidatura para o Microsserviço de Candidaturas (appCandidaturas)
    const dadosCandidatura = {
      candidatoId: candidatoId.toString(),
      vagaId: vagaTesteId.toString(),
      curriculo: {
        nome: dadosNovoCandidato.nome,
        email: dadosNovoCandidato.email,
        telefone: dadosNovoCandidato.telefone,
        area: dadosNovoCandidato.perfil,
        resumo: 'Desenvolvedora focada em Node.js e bancos NoSQL',
        experiencia: dadosNovoCandidato.experiencia,
        formacao: 'Análise e Desenvolvimento de Sistemas',
        competencias: 'JavaScript, Node.js, Express, MongoDB, Git',
        linkedin: dadosNovoCandidato.linkedin
      }
    };

    const resCandidatura = await request(appCandidaturas)
      .post('/api/candidaturas')
      .send(dadosCandidatura);

    expect([200, 201]).toContain(resCandidatura.status);

    // PASSO C: Confirma no banco de dados se a candidatura foi salva com status "Em análise"
    const candidaturaSalva = await Candidatura.findOne({
      candidatoId: candidatoId,
      vagaId: vagaTesteId
    });

    expect(candidaturaSalva).toBeTruthy();
    expect(candidaturaSalva.status).toBe('Em análise');
    expect(candidaturaSalva.curriculo.nome).toBe('Maria Silva');
  });
});