const express = require('express');
const connectDB = require('../../config/DataBase');
const empresasService = require('./empresasSrs');

const app = express();
app.use(express.json());

const PORT = 3002;

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

if (require.main === module) {
    connectDB();
    app.listen(PORT, () => {
    console.log(`[Microsserviço Empresas] Rodando na porta ${PORT}`);
    });
}

module.exports = app;