describe('Fluxo de Cadastro de Usuários', () => {

  // Gera dados únicos para não esbarrar no "unique: true" do Mongoose
    const emailCandidato = `novo.candidato.${Date.now()}@email.com`;
    const emailEmpresa = `nova.empresa.${Date.now()}@tech.com`;
  const cnpjDinamico = `12.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-99`;

    it('Deve escolher o perfil e cadastrar um novo CANDIDATO com sucesso', () => {
    // 1. Acessa a página inicial de escolha (ajuste se o nome não for cadastro.html ou index.html)
    cy.visit('/cadastro.html');

    // 2. Clica no botão "Cadastrar como candidato" e verifica se foi para candidato.html
    cy.contains('a.btn-primary', 'Cadastrar como candidato').click();
    cy.url().should('include', '/candidato.html');

    // 3. Espião para capturar a resposta do Back-end
    cy.intercept('POST', '/api/candidatos').as('criacaoCandidato');

    // 4. Preenche os dados obrigatórios do Schema de Candidato
    cy.get('input[name="nome"]').type('Carlos Silva');
    cy.get('input[name="email"]').type(emailCandidato);
    cy.get('input[name="senha"]').type('12345678');
    cy.get('input[name="telefone"]').type('(11) 98888-7777');
    cy.get('input[name="dataNascimento"]').type('2000-05-20');
    cy.get('input[name="perfil"]').type('Desenvolvedor Front-end');
    cy.get('#candidatoExperiencia').type('2 anos com React e Cypress');
    
    // 5. Submete o formulário
    cy.get('button[type="submit"]').click();

    // 6. Aguarda a resposta da API e valida
    cy.wait('@criacaoCandidato').then((intercept) => {
        const status = intercept.response.statusCode;
        const erroDoBackend = intercept.response.body;
        
        expect([200, 201]).to.include(status, `Erro na API: ${JSON.stringify(erroDoBackend)}`);
    });
    });

    it('Deve escolher o perfil e cadastrar uma nova EMPRESA com sucesso', () => {
    // 1. Acessa a página inicial de escolha
    cy.visit('/cadastro.html');

    // 2. Clica no botão "Cadastrar empresa" e verifica se foi para empresa.html
    cy.contains('a.btn-primary', 'Cadastrar empresa').click();
    cy.url().should('include', '/empresa.html');

    // 3. Espião para capturar a resposta do Back-end
    cy.intercept('POST', '/api/empresas').as('criacaoEmpresa');

    // 4. Preenche os dados obrigatórios do Schema de Empresa
    cy.get('input[name="nome"]').type('Inovação S/A');
    cy.get('input[name="email"]').type(emailEmpresa);
    cy.get('input[name="senha"]').type('12345678');
    cy.get('input[name="cnpj"]').type(cnpjDinamico);
    cy.get('input[name="telefone"]').type('(11) 3000-4000');
    cy.get('input[name="setor"]').type('Tecnologia da Informação');
    cy.get('input[name="cidade"]').type('São Paulo');
    cy.get('input[name="estado"]').type('SP');

    // 5. Submete o formulário
    cy.get('button[type="submit"]').click();

    // 6. Aguarda a resposta da API e valida
    cy.wait('@criacaoEmpresa').then((intercept) => {
        const status = intercept.response.statusCode;
        const erroDoBackend = intercept.response.body;
        
        expect([200, 201]).to.include(status, `Erro na API: ${JSON.stringify(erroDoBackend)}`);
    });
    });

});