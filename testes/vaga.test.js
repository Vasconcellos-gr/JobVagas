const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../server');
const Vaga = require('../servicos/vagas/vagasModel');
const Usuario = require('../servicos/empresas/empresasModel');


let mongoServer;

describe('API de Vagas', () => {
    let empresaTesteId;

  // Ligar a um banco de dados
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14'
      }
    });

      const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    
    // Cria uma empresa
    const empresa = new Usuario({
    nome: 'Empresa Teste',
    cnpj: '19.944.519/0001-89',
    email: 'teste@empresa.com',
    senha: '12345678',
    telefone: '(51) 99522-8898',
    setor: 'Tecnologia',
    endereco: 'Av Teste',
    bairro: 'Testeropolis',
    cidade: 'Teste City',
    estado: 'Estate od Test',
    website: '',
    descricao: '',
    });
    const empresaSalva = await empresa.save();
    empresaTesteId = empresaSalva._id;
});

    afterAll(async () => {
      await mongoose.disconnect();
      if (mongoServer) {
        await mongoServer.stop();
    }
  });

it('Deve criar uma nova vaga com sucesso', async () => {
    const novaVaga = {
      titulo: 'Desenvolvedor Node.js',
      empresaId: empresaTesteId.toString(),
      empresaNome: 'Empresa Teste',
      localizacao: 'Sao Teste',    
      tipo: 'CLT',           
      salario: 'R$ 5.000',  
      tags: ['Node.js', 'Express'],
      descricao: 'Vaga para back-end',
    };

    // Simula um POST vindo do front-end
    const resposta = await request(app)
    .post('/api/vagas')
    .send(novaVaga);

    if (resposta.status !== 201) {
      console.log('Motivo da recusa (Status 400):', resposta.body);
    }

    // O que é esperado que aconteça:
    expect(resposta.status).toBe(201); // 201 = Created
    expect(resposta.body.titulo).toBe('Desenvolvedor Node.js');

    // Confirma se realmente guardou no MongoDB
    const vagaNoBanco = await Vaga.findById(resposta.body._id);
    expect(vagaNoBanco).toBeTruthy();
    expect(vagaNoBanco.descricao).toBe('Vaga para back-end');
});
});