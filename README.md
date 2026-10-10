# JobVagas

Aplicação para gerenciamento de vagas de emprego, com cadastro de vagas, empresas, candidatos e candidaturas.

## Objetivo
O projeto tem como objetivo criar uma plataforma simples para:
- listar vagas disponíveis
- cadastrar empresas
- cadastrar candidatos
- registrar candidaturas

## Tecnologias
- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript

## Estrutura do projeto
```bash
JobVagas/
├── config/
│   └── DataBase.js
├── frontend/
│   ├── index.html
│   ├── vagas.html
│   ├── candidato.html
│   ├── empresa.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── servicos/
│   ├── vagas/
│   │   ├── vagasModel.js
│   │   └── vagasSrc.js
│   ├── empresas/
│   ├── candidatos/
│   └── candidaturas/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md