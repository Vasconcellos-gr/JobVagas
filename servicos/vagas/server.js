const express = require('express');
const connectDB = require('../../config/DataBase');
const vagasService = require('./vagasSrc');
const Vaga = require('./vagasModel');

const app = express();
app.use(express.json());

const PORT = 3001;

app.get('/api/vagas', async (req, res) => {
    try {
    const vagas = await vagasService.obterTodasVagas();
    res.json(vagas);
    } catch (error) {
    res.status(500).json({ erro: error.message });
    }
});

app.get('/api/vagas/empresa/:empresaId', async (req, res) => {
    try {
    const { empresaId } = req.params;
    const vagas = await Vaga.find({ empresaId }).sort({ dataCriacao: -1 });
    res.status(200).json(vagas);
    } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao buscar as vagas.' });
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
    res.status(400).json({ erro: 'Erro ao publicar', detalhes: erro.message });
    }
});

app.put('/api/vagas/:id', async (req, res) => {
    try {
    const dadosAtualizados = {
        titulo: req.body.titulo,
        localizacao: req.body.localizacao,
        tipo: req.body.tipo,
        salario: req.body.salario,
        tags: req.body.tags,
        descricao: req.body.descricao
    };

    const vagaAtualizada = await Vaga.findByIdAndUpdate(
        req.params.id,
        dadosAtualizados,
        { returnDocument: 'after' }
    );

    if (!vagaAtualizada) {
        return res.status(404).json({ erro: 'Vaga não encontrada.' });
    }
    res.status(200).json(vagaAtualizada);
    } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao atualizar a vaga.' });
    }
});

app.delete('/api/vagas/:id', async (req, res) => {
    try {
    const vagaExcluida = await Vaga.findByIdAndDelete(req.params.id);
    if (!vagaExcluida) {
        return res.status(404).json({ erro: 'Vaga não encontrada.' });
    }
    res.status(200).json({ mensagem: 'Vaga excluída com sucesso!' });
    } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao tentar excluir a vaga.' });
    }
});

if (require.main === module) {
    connectDB();
    app.listen(PORT, () => {
    console.log(`[Microsserviço Vagas] Rodando na porta ${PORT}`);
    });
}

module.exports = app;