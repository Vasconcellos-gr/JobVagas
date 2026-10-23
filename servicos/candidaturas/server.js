const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../../config/DataBase');
const candidaturasService = require('./candidaturasSrc');
const Candidatura = require('./candidaturasModel');

const app = express();
app.use(express.json());

const PORT = 3004;
const VAGAS_SERVICE_URL = 'http://localhost:3001';
const EMPRESAS_SERVICE_URL = 'http://localhost:3002';

app.get('/api/candidaturas', async (req, res) => {
    try {
    const candidaturas = await candidaturasService.obterTodasCandidaturas();
    res.json(candidaturas);
    } catch (error) {
    res.status(500).json({ erro: error.message });
    }
});

// Busca candidaturas de uma empresa consultando o Microsserviço de Vagas via HTTP
app.get('/api/candidaturas/empresa/:empresaId', async (req, res) => {
    try {
    const { empresaId } = req.params;

    // 1. Pergunta ao Microsserviço de Vagas (porta 3001) quais são as vagas desta empresa
    const respVagas = await fetch(`${VAGAS_SERVICE_URL}/api/vagas/empresa/${empresaId}`);
    const vagasDaEmpresa = await respVagas.json();

    if (!Array.isArray(vagasDaEmpresa) || vagasDaEmpresa.length === 0) {
        return res.status(200).json([]);
    }

    const idsDasVagas = vagasDaEmpresa.map(vaga => vaga._id.toString());
    const candidaturas = await Candidatura.find({ vagaId: { $in: idsDasVagas } }).lean();

    const candidaturasProntas = candidaturas.map(cand => {
         const vagaCorrespondente = vagasDaEmpresa.find(v => v._id.toString() === cand.vagaId?.toString());
        return {
        ...cand,
        vagaId: vagaCorrespondente
        };
    });

    res.status(200).json(candidaturasProntas);
    } catch (erro) {
    console.error('Erro ao buscar candidaturas da empresa:', erro);
    res.status(500).json({ erro: 'Erro ao carregar a lista de candidatos.' });
    }
});

// Busca candidaturas do candidato consultando os Microsserviços de Vagas e Empresas via HTTP
app.get('/api/candidaturas/candidato/:candidatoId', async (req, res) => {
    const { candidatoId } = req.params;
    if (!mongoose.isValidObjectId(candidatoId)) {
    return res.status(400).json({ erro: 'Identificador de candidato inválido.' });
    }

    try {
    const candidaturas = await Candidatura.find({ candidatoId }).lean();
    if (candidaturas.length === 0) {
        return res.status(200).json([]);
    }

    // Consulta Vagas (3001) e Empresas (3002) via HTTP
    const [respVagas, respEmpresas] = await Promise.all([
        fetch(`${VAGAS_SERVICE_URL}/api/vagas`),
        fetch(`${EMPRESAS_SERVICE_URL}/api/empresas`)
    ]);

    const todasVagas = await respVagas.json();
    const todasEmpresas = await respEmpresas.json();

    const candidaturasProntas = candidaturas.map(cand => {
        const vagaCorrespondente = (Array.isArray(todasVagas) ? todasVagas : []).find(
        v => v._id.toString() === cand.vagaId?.toString()
        ) || {};
        const empresaCorrespondente = (Array.isArray(todasEmpresas) ? todasEmpresas : []).find(
        e => e._id.toString() === vagaCorrespondente.empresaId?.toString()
        ) || {};

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

app.post('/api/candidaturas', async (req, res) => {
    try {
    const dados = req.body;
    const candidaturaExistente = await Candidatura.findOne({
        vagaId: dados.vagaId,
        candidatoId: dados.candidatoId
    });

    if (candidaturaExistente) {
        return res.status(400).json({ erro: 'Você já se candidatou a esta vaga anteriormente.' });
    }

    const novaCandidatura = new Candidatura(dados);
    await novaCandidatura.save();

    res.status(201).json({ mensagem: 'Candidatura salva com sucesso!' });
    } catch (erro) {
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

app.put('/api/candidaturas/:id/status', async (req, res) => {
    try {
    const candidaturaAtualizada = await Candidatura.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { returnDocument: 'after' }
    );

    if (!candidaturaAtualizada) {
        return res.status(404).json({ erro: 'Candidatura não encontrada.' });
    }
    res.status(200).json(candidaturaAtualizada);
    } catch (erro) {
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

if (require.main === module) {
    connectDB();
    app.listen(PORT, () => {
    console.log(`[Microsserviço Candidaturas] Rodando na porta ${PORT}`);
    });
}

module.exports = app;