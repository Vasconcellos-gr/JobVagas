// frontend/js/auth.js

function obterUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
}

function atualizarHeader() {
  const dados = obterUsuarioLogado();
  const headerActions = document.querySelector('.header-actions');
  const mainNav = document.querySelector('.main-nav');

// 1. Função para verificar se o usuário está logado
function obterUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
}

// 2. Proteção contra o botão "Voltar" do navegador (Cache do Histórico)
window.addEventListener('pageshow', (event) => {
  // Se a página foi carregada do cache do navegador (quando clica em "Voltar")
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    const dados = obterUsuarioLogado();
    // Se não houver dados, força o redirecionamento imediato para o login
    if (!dados) {
      window.location.href = 'login.html';
    }
  }
});

  // Se não estiver logado, não altera o HTML estático padrão
  if (!dados || !dados.usuario) return;

  // === PERFIL: EMPRESA ===
  if (dados.tipo === 'empresa') {
    // Insere as opções de Empresa no menu principal
    if (mainNav) {
      mainNav.innerHTML = `
        <a href="index.html">Início</a>
        <a href="vagas.html">Vagas</a>
        <a href="home_empresa.html#nova-vaga">Publicar vaga</a>
        <a href="home_empresa.html#candidatos">Candidatos</a>
      `;
    }

    // Atualiza as ações do usuário logado no topo
    if (headerActions) {
      headerActions.innerHTML = `
        <a class="btn btn-muted" href="home_empresa.html">🏢 ${dados.usuario.nome}</a>
        <button id="btnSairHeader" class="btn btn-primary" type="button">Sair</button>
      `;
    }
  } 
  
  // === PERFIL: CANDIDATO ===
  else if (dados.tipo === 'candidato') {
    if (mainNav) {
      mainNav.innerHTML = `
        <a href="index.html">Início</a>
        <a href="vagas.html">Vagas</a>
        <a href="home_candidato.html#minhas-candidaturas">Minhas Candidaturas</a>
      `;
    }

    if (headerActions) {
      headerActions.innerHTML = `
        <a class="btn btn-muted" href="home_candidato.html">👤 ${dados.usuario.nome}</a>
        <button id="btnSairHeader" class="btn btn-primary" type="button">Sair</button>
      `;
    }
  }

  // Evento de Logout
  const btnSair = document.getElementById('btnSairHeader');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', atualizarHeader);