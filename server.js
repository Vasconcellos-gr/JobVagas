const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/DataBase');

// Conectar ao MongoDB


const app = express();
app.use(express.json());

const PORT = 3000;

// Importar serviços
const vagasService = require('./servicos/vagas/vagasSrc');
const empresasService = require('./servicos/empresas/empresasSrs');
const candidatosService = require('./servicos/candidatos/candidatosSrc');
const candidaturasService = require('./servicos/candidaturas/candidaturasSrc');
const Candidatura = require('./servicos/candidaturas/candidaturasModel');
const Vaga = require('./servicos/vagas/vagasModel');
const Empresa = require('./servicos/empresas/empresasModel');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// ==================== ROTAS DE VAGAS ====================
app.get('/api/vagas', async (req, res) => {
  try {
    const vagas = await vagasService.obterTodasVagas();
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/vagas/:id', async (req, res) => {
  try {
    const vaga = await vagasService.obterVagaPorId(req.params.id);
    if (!vaga) {
      return res.status(404).json({ erro: 'Vaga não encontrada' });
    }
    res.json(vaga);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post('/api/vagas', async (req, res) => {
  try {
    const novaVaga = new Vaga({
      titulo: req.body.titulo,
      empresaId: req.body.empresaId,
      empresaNome: req.body.empresaNome,
      localizacao: req.body.localizacao, 
      tipo: req.body.tipo,
      salario: req.body.salario,
      tags: req.body.tags || [],
      descricao: req.body.descricao
    });
    
    await novaVaga.save();
    res.status(201).json(novaVaga);
  } catch (erro) {
    console.error('Erro ao publicar vaga:', erro.message);
    res.status(400).json({ erro: 'Erro ao publicar', detalhes: erro.message });
  }
});

app.put('/api/vagas/:id', async (req, res) => {
  try {
    const idDaVaga = req.params.id;

    const dadosAtualizados = {
      titulo: req.body.titulo,
      localizacao: req.body.localizacao,
      tipo: req.body.tipo,
      salario: req.body.salario,
      tags: req.body.tags,
      descricao: req.body.descricao // <-- Adicionado para salvar no banco!
    };

    const vagaAtualizada = await Vaga.findByIdAndUpdate(
      idDaVaga, 
      dadosAtualizados, 
      { returnDocument: 'after' } // Retorna a vaga com os dados novos
    );

    if (!vagaAtualizada) {
      return res.status(404).json({ erro: 'Vaga não encontrada.' });
    }

    res.status(200).json(vagaAtualizada);
  } catch (erro) {
    console.error('Erro ao atualizar vaga:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao atualizar a vaga.' });
  }
});

app.delete('/api/vagas/:id', async (req, res) => {
  try {
    const idDaVaga = req.params.id;

    // Comando do Mongoose que busca pelo ID e apaga do banco imediatamente
    const vagaExcluida = await Vaga.findByIdAndDelete(idDaVaga);

    // Se o banco não encontrou nenhuma vaga com esse ID
    if (!vagaExcluida) {
      return res.status(404).json({ erro: 'Vaga não encontrada.' });
    }

    // Se a exclusão foi um sucesso
    res.status(200).json({ mensagem: 'Vaga excluída com sucesso!' });

  } catch (erro) {
    console.error('Erro ao excluir vaga:', erro.message);
    res.status(500).json({ erro: 'Erro interno ao tentar excluir a vaga.' });
  }
});

app.get('/api/vagas/empresa/:empresaId', async (req, res) => {
  try {
    const { empresaId } = req.params;
    
    // Procura no banco de dados todas as vagas que tenham este empresaId
    const vagas = await Vaga.find({ empresaId: empresaId }).sort({ dataCriacao: -1 });
    
    // Devolve as vagas com sucesso (mesmo que seja uma lista vazia [])
    res.status(200).json(vagas);
  } catch (erro) {
    console.error('Erro na rota de vagas da empresa:', erro);
    res.status(500).json({ erro: 'Erro interno ao buscar as vagas.' });
  }
});

// ==================== ROTAS DE EMPRESAS ====================
app.get('/api/empresas', async (req, res) => {
  try {
    const empresas = await empresasService.obterTodasEmpresas();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/empresas/:id', async (req, res) => {
  try {
    const empresa = await empresasService.obterEmpresaPorId(req.params.id);
    if (!empresa) {
      return res.status(404).json({ erro: 'Empresa não encontrada' });
    }
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post('/api/empresas', async (req, res) => {
  try {
    const empresa = await empresasService.criarEmpresa(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.put('/api/empresas/:id', async (req, res) => {
  try {
    const empresa = await empresasService.atualizarEmpresa(req.params.id, req.body);
    res.json(empresa);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.delete('/api/empresas/:id', async (req, res) => {
  try {
    await empresasService.deletarEmpresa(req.params.id);
    res.json({ mensagem: 'Empresa deletada' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Rota de Login para Empresas
app.post('/api/empresas/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe o e-mail e a senha.' });
    }
    const resultado = await empresasService.loginEmpresa(email, senha);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ erro: error.message });
  }
});

// ==================== ROTAS DE CANDIDATOS ====================
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await candidatosService.obterTodosCandidatos();
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/candidatos/:id', async (req, res) => {
  try {
    const candidato = await candidatosService.obterCandidatoPorId(req.params.id);
    if (!candidato) {
      return res.status(404).json({ erro: 'Candidato não encontrado' });
    }
    res.json(candidato);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/candidatos/:id/curriculo', async (req, res) => {
  try {
    const candidato = await candidatosService.obterCurriculoCandidato(req.params.id);
    if (!candidato) {
      return res.status(404).json({ erro: 'Candidato não encontrado' });
    }
    res.json(candidato.curriculo || null);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.put('/api/candidatos/:id/curriculo', async (req, res) => {
  try {
    const curriculo = await candidatosService.atualizarCurriculoCandidato(req.params.id, req.body);
    if (!curriculo) {
      return res.status(404).json({ erro: 'Candidato não encontrado' });
    }
    res.json(curriculo.curriculo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.post('/api/candidatos', async (req, res) => {
  try {
    const candidato = await candidatosService.criarCandidato(req.body);
    res.status(201).json(candidato);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.put('/api/candidatos/:id', async (req, res) => {
  try {
    const candidato = await candidatosService.atualizarCandidato(req.params.id, req.body);
    res.json(candidato);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.delete('/api/candidatos/:id', async (req, res) => {
  try {
    await candidatosService.deletarCandidato(req.params.id);
    res.json({ mensagem: 'Candidato deletado' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Rota de Login para Candidatos
app.post('/api/candidatos/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe o e-mail e a senha.' });
    }
    const resultado = await candidatosService.loginCandidato(email, senha);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(401).json({ erro: error.message });
  }
});

// ==================== ROTAS DE CANDIDATURAS ====================
app.get('/api/candidaturas', async (req, res) => {
  try {
    const candidaturas = await candidaturasService.obterTodasCandidaturas();
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/candidaturas/candidato/:candidatoId', async (req, res) => {
  const { candidatoId } = req.params;
  if (!mongoose.isValidObjectId(candidatoId)) {
    return res.status(400).json({ erro: 'Identificador de candidato inválido.' });
  }

  try {
    const candidaturas = await candidaturasService.obterCandidaturasPorCandidato(candidatoId);
    res.json(candidaturas);
  } catch (error) {
    console.error('Erro ao buscar candidaturas do candidato:', error);
    res.status(500).json({ erro: 'Não foi possível carregar suas candidaturas.' });
  }
});

app.get('/api/candidaturas/:id', async (req, res) => {
  try {
    const candidatura = await candidaturasService.obterCandidaturaPorId(req.params.id);
    if (!candidatura) {
      return res.status(404).json({ erro: 'Candidatura não encontrada' });
    }
    res.json(candidatura);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/api/candidaturas/empresa/:empresaId', async (req, res) => {
  try {
    const empresaId = req.params.empresaId;

    // Busca no MongoDB todas as vagas criadas por esta empresa
    const vagasDaEmpresa = await Vaga.find({ empresaId: empresaId });

    if (vagasDaEmpresa.length === 0) {
      return res.status(200).json([]); // Se não tem vagas, devolve lista vazia
    }

    // Extrai apenas os IDs dessas vagas
    const idsDasVagas = vagasDaEmpresa.map(vaga => vaga._id.toString());

    // 2. Busca todas as candidaturas vinculadas a essas vagas.
    // Usamos .lean() para converter o formato estrito do Mongoose num objeto leve de JavaScript
    const candidaturas = await Candidatura.find({ vagaId: { $in: idsDasVagas } }).lean();

    // 3. O seu Front-end espera que o "vagaId" seja o objeto completo da vaga.
    // Vamos cruzar as informações antes de enviar para a tela:
    const candidaturasProntas = candidaturas.map(cand => {
      const vagaCorrespondente = vagasDaEmpresa.find(v => v._id.toString() === cand.vagaId);
      return {
        ...cand,
        vagaId: vagaCorrespondente // Substitui o ID de texto pelo objeto com Título e Local
      };
    });

    res.status(200).json(candidaturasProntas);
  } catch (erro) {
    console.error('Erro ao buscar candidaturas da empresa:', erro);
    res.status(500).json({ erro: 'Erro ao carregar a lista de candidatos.' });
  }
});

// ==================== ROTA DE CANDIDATURAS DO CANDIDATO ====================
app.get('/api/candidaturas/candidato/:candidatoId', async (req, res) => {
  try {
    const candidatoId = req.params.candidatoId;

    const candidaturas = await Candidatura.find({ candidatoId: candidatoId }).lean();

    if (candidaturas.length === 0) {
      return res.status(200).json([]);
    }

    const idsDasVagas = candidaturas.map(c => c.vagaId);
    const vagasEncontradas = await Vaga.find({ _id: { $in: idsDasVagas } }).lean();

    const idsDasEmpresas = vagasEncontradas.map(v => v.empresaId).filter(Boolean);
    const empresasEncontradas = await Empresa.find({ _id: { $in: idsDasEmpresas } }).lean();

    const candidaturasProntas = candidaturas.map(cand => {
      const vagaCorrespondente = vagasEncontradas.find(v => v._id.toString() === cand.vagaId?.toString()) || {};
      const empresaCorrespondente = empresasEncontradas.find(e => e._id.toString() === vagaCorrespondente.empresaId?.toString()) || {};

      return {
        ...cand,
        vagaId: {
          ...vagaCorrespondente,
          empresaId: empresaCorrespondente
        }
      };
    });

    res.status(200).json(candidaturasProntas);
  } catch (erro) {
    console.error('Erro ao buscar candidaturas do candidato:', erro);
    res.status(500).json({ erro: 'Erro ao carregar a sua lista de candidaturas.' });
  }
});

app.post('/api/candidaturas', async (req, res) => {
  try {
    const dados = req.body;

    // Regra de negócio: impede que o candidato se inscreva 2 vezes na mesma vaga
    const candidaturaExistente = await Candidatura.findOne({ 
      vagaId: dados.vagaId, 
      candidatoId: dados.candidatoId 
    });

    if (candidaturaExistente) {
      return res.status(400).json({ erro: 'Você já se candidatou a esta vaga anteriormente.' });
    }

    // Cria e salva a candidatura no banco de dados
    const novaCandidatura = new Candidatura(dados);
    await novaCandidatura.save();

    res.status(201).json({ mensagem: 'Candidatura salva com sucesso!' });
  } catch (erro) {
    console.error('Erro ao salvar candidatura:', erro);
    res.status(500).json({ erro: 'Erro interno ao processar a sua candidatura.' });
  }
});

app.put('/api/candidaturas/:id', async (req, res) => {
  try {
    const candidatura = await candidaturasService.atualizarCandidatura(req.params.id, req.body);
    res.json(candidatura);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Rota para atualizar o status de uma candidatura
app.put('/api/candidaturas/:id/status', async (req, res) => {
  try {
    const idCandidatura = req.params.id;
    const { status } = req.body;

    const candidaturaAtualizada = await Candidatura.findByIdAndUpdate(
      idCandidatura,
      { status: status },
      { returnDocument: 'after' }
    );

    if (!candidaturaAtualizada) {
      return res.status(404).json({ erro: 'Candidatura não encontrada.' });
    }

    res.status(200).json(candidaturaAtualizada);
  } catch (erro) {
    console.error('Erro ao atualizar status:', erro);
    res.status(500).json({ erro: 'Erro interno ao tentar atualizar o status.' });
  }
});

app.delete('/api/candidaturas/:id', async (req, res) => {
  try {
    await candidaturasService.deletarCandidatura(req.params.id);
    res.json({ mensagem: 'Candidatura deletada' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Exemplo de rota de login de empresa no server.js
app.post('/api/empresas/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await loginEmpresa(email, senha); // Função que usa o bcrypt.compare
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Exemplo de rota de login de candidato no server.js
app.post('/api/candidatos/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await loginCandidato(email, senha); // Função que usa o bcrypt.compare
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// ROTAS DE DASHBOARD
app.get('/home-candidato', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home_candidato.html'));
});

app.get('/home-empresa', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home_empresa.html'));
});

// Rota raiz para servir o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


// Responsavel pelo start 
if (require.main === module) {
  
  connectDB();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;