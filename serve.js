const express = require('express');
const path = require('path');

const { vagas } = require('./services/vagas/vagasService');
const { empresas } = require('./services/empresas/empresasService');
const { candidatos } = require('./services/candidatos/candidatosService');
const { candidaturas } = require('./services/candidaturas/candidaturasService');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/api/vagas', (req, res) => {
  res.json(vagas);
});

app.get('/api/empresas', (req, res) => {
  res.json(empresas);
});

app.get('/api/candidatos', (req, res) => {
  res.json(candidatos);
});

app.get('/api/candidaturas', (req, res) => {
  res.json(candidaturas);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});