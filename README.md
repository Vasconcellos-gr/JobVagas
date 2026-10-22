# JobVagas

Plataforma para busca e gerenciamento de vagas de emprego, conectando candidatos, empresas e oportunidades em um único sistema.

## Visão geral

O JobVagas é uma aplicação web em Node.js com Express que permite:
- listar vagas disponíveis;
- cadastrar empresas;
- cadastrar candidatos;
- registrar candidaturas;
- gerenciar cadastro, autenticação e fluxo de vagas.

A interface do sistema fica na pasta `frontend`, enquanto a lógica de negócio e acesso a dados ficam em `servicos` e `config`.

## Stack tecnológica

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript
- HTML, CSS e JavaScript para o frontend estático

## 📁 Estrutura de Diretórios

```text
JobVagas/
├── config/
│   └── DataBase.js            # Configuração e conexão com o banco de dados
├── frontend/                  # Interface do usuário (páginas e lógica de tela)
│   ├── css/
│   │   └── style.css          # Estilização global da aplicação
│   ├── js/
│   │   ├── app.js             # Script base/geral do frontend
│   │   ├── auth.js            # Lógica de autenticação e controle de sessão
│   │   ├── candidato.js       # Ações e manipulações do painel do candidato
│   │   ├── empresa.js         # Ações e manipulações do painel da empresa
│   │   ├── perfil.js          # Gerenciamento de exibição e edição de perfil
│   │   ├── tabs.js            # Controle de navegação por abas/abas dinâmicas
│   │   └── vagas.js           # Listagem, busca e detalhes de vagas
│   ├── cadastro.html          # Tela de cadastro (candidatos e empresas)
│   ├── candidato.html         # Página de visualização de perfil de candidato
│   ├── candidaturas_empresa.html # Visualização de inscritos por parte da empresa
│   ├── curriculo.html         # Formulário/visualização de currículo
│   ├── empresa.html           # Perfil público ou detalhes da empresa
│   ├── home_candidato.html    # Dashboard principal do candidato
│   ├── home_empresa.html      # Dashboard principal da empresa
│   ├── index.html             # Página inicial do sistema
│   ├── login.html             # Tela de acesso/login
│   ├── vaga_detalhes.html     # Exibição detalhada de uma oportunidade
│   └── vagas.html             # Listagem geral e busca de vagas abertas
├── servicos/                  # Módulos de domínio, regras de negócio e persistência
│   ├── candidatos/
│   │   ├── candidatosModel.js # Esquema/definição de dados de candidatos
│   │   └── candidatosSrc.js   # Regras de negócio e comunicação de candidatos
│   ├── candidaturas/
│   │   ├── candidaturasModel.js # Esquema/definição de dados de candidaturas
│   │   └── candidaturasSrc.js   # Controle de envios e status de candidaturas
│   ├── empresas/
│   │   ├── empresasModel.js   # Esquema/definição de dados de empresas
│   │   └── empresasSrs.js     # Regras de negócio e operações de empresas
│   └── vagas/
│       ├── vagasModel.js      # Esquema/definição de dados de vagas
│       └── vagasSrc.js        # Operações de criação, edição e busca de vagas
├── .env                       # Variáveis de ambiente locais (ignorado no git)
├── .env_exemplo               # Modelo de exemplo para preenchimento de variáveis
├── .gitignore                 # Arquivos e diretórios ignorados pelo controle de versão
├── package.json               # Gerenciador de dependências e scripts do projeto
├── package-lock.json          # Trava de versões exatas das dependências instaladas
├── README.md                  # Documentação descritiva do projeto
└── server.js                  # Ponto de entrada do backend e inicialização do servidor
```

## Funcionalidades principais

### Vagas
- criação, listagem, atualização e exclusão de vagas;
- busca por empresa;
- filtros e listagem para a interface pública.

### Empresas
- cadastro de empresas;
- autenticação via login;
- relacionamento com as vagas publicadas.

### Candidatos
- cadastro de candidatos;
- autenticação via login;
- atualização de currículo;
- consulta de candidaturas.

### Candidaturas
- inscrição do candidato em uma vaga;
- prevenção de múltiplas inscrições duplicadas;
- atualização de status da candidatura.

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:
- Node.js
- MongoDB local ou uma URI de conexão válida
- npm

## Configuração do ambiente

1. Clone o repositório:

```bash
git clone https://github.com/Vasconcellos-gr/JobVagas.git
cd JobVagas
```

2. Crie o arquivo `.env` com base no exemplo:

```bash
cp .env_exemplo .env
```

3. Ajuste as variáveis de ambiente conforme o seu banco:

```env
MONGODB_URI=mongodb://localhost:27017/jobvagas
NODE_ENV=development
PORT=3000
```

## Instalação

```bash
npm install
```

## Execução

Para iniciar a aplicação:

```bash
npm start
```

ou

```bash
node server.js
```

O servidor será iniciado na porta configurada (por padrão `3000`) e a aplicação estará disponível em:

```bash
http://localhost:3000
```

## APIs principais

A aplicação expõe rotas REST para cada domínio principal:

### Vagas
- `GET /api/vagas`
- `GET /api/vagas/:id`
- `POST /api/vagas`
- `PUT /api/vagas/:id`
- `DELETE /api/vagas/:id`

### Empresas
- `GET /api/empresas`
- `GET /api/empresas/:id`
- `POST /api/empresas`
- `PUT /api/empresas/:id`
- `DELETE /api/empresas/:id`
- `POST /api/empresas/login`

### Candidatos
- `GET /api/candidatos`
- `GET /api/candidatos/:id`
- `POST /api/candidatos`
- `PUT /api/candidatos/:id`
- `DELETE /api/candidatos/:id`
- `POST /api/candidatos/login`

### Candidaturas
- `GET /api/candidaturas`
- `GET /api/candidaturas/:id`
- `POST /api/candidaturas`
- `PUT /api/candidaturas/:id`
- `PUT /api/candidaturas/:id/status`
- `DELETE /api/candidaturas/:id`

## Observações

- O frontend é estático e servido diretamente pelo Express.
- O arquivo `server.js` centraliza a configuração das rotas e a inicialização da aplicação.
- A conexão com o MongoDB está em `config/DataBase.js`.
- O projeto foi estruturado em módulos por domínio para facilitar manutenção e escalabilidade.

## Autor

Projeto desenvolvido por:

Gustavo,
Davi,
João Vitor
