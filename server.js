const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== PROXY PARA OS MICROSSERVIÇOS ====================
// Importante: Os proxies vêm ANTES de express.json() para encaminhar o body intacto!

// 1. Microsserviço de Vagas (Porta 3001)
app.use('/api/vagas', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: (path) => `/api/vagas${path}`
}));

// 2. Microsserviço de Empresas (Porta 3002)
app.use('/api/empresas', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: (path) => `/api/empresas${path}`
}));

// 3. Microsserviço de Candidatos (Porta 3003)
app.use('/api/candidatos', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: (path) => `/api/candidatos${path}`
}));

// 4. Microsserviço de Candidaturas (Porta 3004)
app.use('/api/candidaturas', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: (path) => `/api/candidaturas${path}`
}));

// ==================== FRONT-END E DASHBOARDS ====================
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/home-candidato', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home_candidato.html'));
});

app.get('/home-empresa', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'home_empresa.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[API Gateway] Rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;