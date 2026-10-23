describe('Fluxo de Login com Escolha de Perfil', () => {
  // O E-mail precisa ser gerado dinamicamente para não dar erro de "e-mail já existe" se rodar o teste 2 vezes
    const emailCandidato = `maria.${Date.now()}@email.com`;
    const emailEmpresa = `rh.${Date.now()}@techsolutions.com`;

    const cnpjDinamico = `12.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-99`;

  //  Injeta os usuários no banco de dados via API
    before(() => {
    // 1. Cria o candidato
    cy.request({
        method: 'POST',
        url: '/api/candidatos', // Ajuste para a sua rota real (ex: /api/usuarios ou /api/auth/register)
        body: {
        nome: 'Maria Silva',
        email: emailCandidato,
        senha: '12345678',
        telefone: '(51) 99767-0990',
        dataNascimento: '2005-11-12',
        perfil: 'Desenvolvedora',
        experiencia: 'Node.js',
        tipoPerfil: 'candidato'
        },
      failOnStatusCode: false // Impede que o Cypress pare se o usuário já existir
    });

    // 2. Cria a empresa
cy.request({
        method: 'POST',
        url: '/api/empresas',
        body: {
        nome: 'Tech Solutions',
        cnpj: cnpjDinamico,
        email: emailEmpresa,
        senha: '12345678',
        telefone: '(11) 4002-8922', 
        setor: 'Tecnologia',
        bairro: 'vila boa',
        cidade: 'São Paulo',        
        estado: 'SP',
        website: '',
        descricao: '',       
        },
        failOnStatusCode: true
    });
    });

  // OS TESTES DE TELA
    it('Deve logar como CANDIDATO com sucesso', () => {
    cy.visit('/login.html');
    cy.get('#tipoUsuario').select('candidato'); 
    
    // Usa o email dinâmico que acabámos de criar no before()
    cy.get('input[name="email"]').type(emailCandidato);
    cy.get('input[name="senha"]').type('12345678');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home_candidato.html');
    });

    it('Deve logar como EMPRESA com sucesso', () => {
    cy.visit('/login.html');
    cy.get('#tipoUsuario').select('empresa'); 
    
    cy.get('input[name="email"]').type(emailEmpresa);
    cy.get('input[name="senha"]').type('12345678');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home_empresa.html');
    });

});