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

## Estrutura do projeto

```bash
JobVagas/
├── config/
│   └── DataBase.js
├── frontend/
│   ├── css/
│   ├── js/
│   ├── candidato.html
│   ├── empresa.html
│   ├── index.html
│   └── vagas.html
├── servicos/
│   ├── candidatos/
│   ├── candidaturas/
│   ├── empresas/
│   └── vagas/
├── .env_exemplo
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── README.md
└── LICENSE (se existir no ambiente local)
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

Projeto desenvolvido por Vasconcellos-gr.

## Licença

O projeto utiliza a licença definida no `package.json` e pode ser ajustada conforme a necessidade da organização ou do mantenedor.
