describe('Fluxo de Gerenciamento de Vagas (Empresa)', () => {

    const emailEmpresa = `empresa.vagas.${Date.now()}@tech.com`;
    const senhaEmpresa = '12345678';
    const cnpjDinamico = `12.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-99`;

    const tituloOriginal = `Dev Node.js Pleno ${Date.now()}`;
    const tituloEditado = `Dev Node.js Sênior ${Date.now()}`;

  // 1. PREPARAÇÃO: Cria a empresa no banco via API antes de abrir a tela
    before(() => {
    cy.request({
        method: 'POST',
        url: '/api/empresas',
        body: {
        nome: 'Tech Vagas S/A',
        email: emailEmpresa,
        senha: senhaEmpresa,
        cnpj: cnpjDinamico,
        telefone: '(11) 4002-8922',
        setor: 'Tecnologia',
        cidade: 'São Paulo',
        estado: 'SP'
        },
        failOnStatusCode: true
    });
    });

  // Antes de cada teste (ou no teste completo), garante que a empresa está logada
    beforeEach(() => {
    cy.visit('/login.html');
    cy.get('#tipoUsuario').select('empresa');
    cy.get('[name="email"], #email').type(emailEmpresa);
    cy.get('[name="senha"], #senha').type(senhaEmpresa);
    cy.get('button[type="submit"]').click();

    // Confirma que entrou no painel da empresa
    cy.url().should('include', '/home_empresa.html');
    });

it('Deve publicar, editar e excluir uma vaga com sucesso', () => {
    // ==========================================
    // ETAPA 1: PUBLICAR NOVA VAGA
    // ==========================================
    cy.intercept('POST', '/api/vagas').as('criarVaga');

    cy.get('#titulo, [name="titulo"], #vagaTitulo')
        .filter(':visible')
        .first()
        .type(tituloOriginal);

    cy.get('#descricao, [name="descricao"], #vagaDescricao')
        .filter(':visible')
        .first()
        .type('Desenvolvimento de APIs REST com Express e MongoDB.');

    cy.get('#localizacao, #local, [name="localizacao"], [name="local"]')
        .filter(':visible')
        .first()
        .type('Remoto');

    cy.get('#salario, [name="salario"], #vagaSalario')
        .filter(':visible')
        .first()
        .type('R$ 7.000');

    cy.get('#tipo, [name="tipo"]')
        .filter(':visible')
        .first()
        .then(($el) => {
        if ($el.is('select')) {
            cy.wrap($el).select('CLT');
        } else {
            cy.wrap($el).type('CLT');
        }
        });

    // Submete o formulário de criação
    cy.get('button[type="submit"]')
        .filter(':visible')
        .first()
        .click();

    // Aguarda a API confirmar a criação
    cy.wait('@criarVaga').then((intercept) => {
        expect([200, 201]).to.include(
        intercept.response.statusCode,
        `Erro ao criar vaga: ${JSON.stringify(intercept.response.body)}`
        );
    });

    // CLICA NA ABA "MINHAS VAGAS" PARA VER OS CARDS PUBLICADOS
    cy.get('#tab-minhas-vagas').click();

    // Confirma que a vaga apareceu na listagem
    cy.contains('h3', tituloOriginal).should('be.visible');

    // ==========================================
    // ETAPA 2: EDITAR A VAGA
    // ==========================================
    cy.intercept('PUT', '/api/vagas/*').as('editarVaga');

    // Encontra o card da vaga criada e clica no botão Editar
    cy.contains('h3', tituloOriginal)
        .closest('.job-card-top')
        .parent()
        .find('.editar-vaga-btn')
        .first()
        .click();

    // Se ao clicar em "Editar" a tela mudar de aba ou abrir o formulário, limpa o título e digita o novo
    cy.get('#editarTitulo, #titulo, [name="titulo"], #vagaTitulo')
        .filter(':visible')
        .first()
        .clear()
        .type(tituloEditado);

    // Clica no botão de salvar visível
    cy.get('button[type="submit"]')
        .filter(':visible')
        .last()
        .click();

    cy.wait('@editarVaga').then((intercept) => {
        expect(intercept.response.statusCode).to.eq(
        200,
        `Erro ao editar vaga: ${JSON.stringify(intercept.response.body)}`
        );
    });

    //  Garante que estamos na aba "Minhas vagas" para ver o card atualizado
    cy.get('#tab-minhas-vagas').click();

    cy.contains('h3', tituloEditado).should('be.visible');

    // ==========================================
    // ETAPA 3: EXCLUIR A VAGA
    // ==========================================
    cy.intercept('DELETE', '/api/vagas/*').as('excluirVaga');

    cy.on('window:confirm', () => true);

    cy.contains('h3', tituloEditado)
        .closest('.job-card-top')
        .parent()
        .find('.excluir-vaga-btn')
        .first()
        .click();

    cy.wait('@excluirVaga').its('response.statusCode').should('be.oneOf', [200, 204]);

    // Confirma que o card sumiu da aba "Minhas vagas"
    cy.contains('h3', tituloEditado).should('not.exist');
    });

});