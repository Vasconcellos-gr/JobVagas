const express = require('express');
const path = require('path');
const connectDB = require('./config/DataBase');

// Conectar ao MongoDB
connectDB();

const app = express();
const PORT = 3000;

// Importar serviços
const vagasService = require('./servicos/vagas/vagasSrc');
const empresasService = require('./servicos/empresas/empresasSrs');
const candidatosService = require('./servicos/candidatos/candidatosSrc');
const candidaturasService = require('./servicos/candidaturas/candidaturasSrc');

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

app.post('/api/vagas', async (req, res) => {
  try {
    const vaga = await vagasService.criarVaga(req.body);
    res.status(201).json(vaga);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.put('/api/vagas/:id', async (req, res) => {
  try {
    const vaga = await vagasService.atualizarVaga(req.params.id, req.body);
    res.json(vaga);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.delete('/api/vagas/:id', async (req, res) => {
  try {
    await vagasService.deletarVaga(req.params.id);
    res.json({ mensagem: 'Vaga deletada' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
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

// ==================== ROTAS DE CANDIDATOS ====================
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await candidatosService.obterTodosCandidatos();
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
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

// ==================== ROTAS DE CANDIDATURAS ====================
app.get('/api/candidaturas', async (req, res) => {
  try {
    const candidaturas = await candidaturasService.obterTodasCandidaturas();
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post('/api/candidaturas', async (req, res) => {
  try {
    const candidatura = await candidaturasService.criarCandidatura(req.body);
    res.status(201).json(candidatura);
  } catch (error) {
    res.status(400).json({ erro: error.message });
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

app.delete('/api/candidaturas/:id', async (req, res) => {
  try {
    await candidaturasService.deletarCandidatura(req.params.id);
    res.json({ mensagem: 'Candidatura deletada' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// Rota raiz para servir o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});