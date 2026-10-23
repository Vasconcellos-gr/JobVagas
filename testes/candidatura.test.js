const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Vaga = require('../servicos/vagas/vagasModel');
const Candidatura = require('../servicos/candidaturas/candidaturasModel');

let mongoServer;

describe('API de Candidaturas e Candidatos', () => {
  let empresaTesteId;
  let vagaTesteId;

  // 1. ANTES DE TUDO: Sobe o banco em memória e cria uma vaga pronta para receber candidaturas
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Gera um ID de empresa válido do MongoDB sem depender do model de Candidato
    empresaTesteId = new mongoose.Types.ObjectId();

    // Cria a vaga diretamente no banco para o candidato se inscrever
    const vaga = await Vaga.create({
      titulo: 'Desenvolvedor Back-end Júnior',
      descricao: 'Atuar com Node.js, Express e MongoDB',
      localizacao: 'Remoto',
      local: 'Remoto',
      tipo: 'CLT',
      modalidade: 'Remoto',
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

  // 3. TESTE: Criar o candidato e enviar a candidatura com o currículo
  it('Deve criar um candidato e registrar a candidatura em uma vaga com sucesso', async () => {
    // PASSO A: Dados completos que o seu model Candidato exige (experiencia, perfil, dataNascimento)
    const dadosNovoCandidato = {
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      senha: '12345678',
      telefone: '(51) 99767-0990',
      dataNascimento: '2005-11-12', // Formato de data que o Node.js e o Mongoose aceitam
      perfil: 'Desenvolvedora Back-end',
      experiencia: 'Projetos acadêmicos e APIs REST em Node.js',
      linkedin: 'https://linkedin.com/in/mariasilva',
      tipoPerfil: 'candidato'
    };

    // Tenta cadastrar via rota da API (ou cria direto no model Candidato se a rota tiver outro nome)
    let candidatoId;
    const resCadastro = await request(app)
      .post('/api/candidatos') // Se a sua rota for /api/usuarios ou /api/cadastro, você pode trocar aqui
      .send(dadosNovoCandidato);

    if (resCadastro.status === 201 || resCadastro.status === 200) {
      candidatoId = resCadastro.body._id 
        || resCadastro.body.id 
        || (resCadastro.body.usuario && (resCadastro.body.usuario._id || resCadastro.body.usuario.id))
        || (resCadastro.body.candidato && (resCadastro.body.candidato._id || resCadastro.body.candidato.id));
    } else {
      // Caso a rota tenha outro endereço no seu server.js, usa o model Candidato registrado no Mongoose:
      const CandidatoModel = mongoose.models.Candidato || mongoose.models.Usuario;
      const candidatoCriado = await CandidatoModel.create(dadosNovoCandidato);
      candidatoId = candidatoCriado._id;
    }

    expect(candidatoId).toBeTruthy();

    // PASSO B: Montar a candidatura exatamente no formato do seu candidaturaSchema
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

    // Envia a candidatura para a API
    const resCandidatura = await request(app)
      .post('/api/candidaturas')
      .send(dadosCandidatura);

    if (resCandidatura.status !== 201 && resCandidatura.status !== 200) {
      console.log('Detalhe da resposta da API de candidaturas:', resCandidatura.status, resCandidatura.body);
    }

    expect([200, 201]).toContain(resCandidatura.status);

    // PASSO C: Confirma direto no banco de dados se a candidatura foi salva com status "Em análise"
    const candidaturaSalva = await Candidatura.findOne({
      candidatoId: candidatoId,
      vagaId: vagaTesteId
    });

    expect(candidaturaSalva).toBeTruthy();
    expect(candidaturaSalva.status).toBe('Em análise');
    expect(candidaturaSalva.curriculo.nome).toBe('Maria Silva');
  });
});