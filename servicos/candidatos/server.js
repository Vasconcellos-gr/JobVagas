const express = require('express');
const connectDB = require('../../config/DataBase');
const candidatosService = require('./candidatosSrc');

const app = express();
app.use(express.json());

const PORT = 3003;

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

if (require.main === module) {
    connectDB();
    app.listen(PORT, () => {
    console.log(`[Microsserviço Candidatos] Rodando na porta ${PORT}`);
    });
}

module.exports = app;