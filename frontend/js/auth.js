function obterUsuarioLogado() {
  const usuario = localStorage.getItem('usuarioLogado');
  return usuario ? JSON.parse(usuario) : null;
}

function renderizarConta(headerActions, usuario, tipo) {
  const icone = tipo === 'empresa' ? '🏢' : '👤';
  const nome = document.createElement('span');
  nome.className = 'candidate-header-name';
  nome.textContent = `${icone} ${usuario.nome || 'Minha conta'}`;

  const sair = document.createElement('button');
  sair.id = 'btnSairHeader';
  sair.className = 'btn btn-primary';
  sair.type = 'button';
  sair.textContent = 'Sair';

  headerActions.replaceChildren(nome, sair);
}

function atualizarHeader() {
  const dados = obterUsuarioLogado();
  const headerActions = document.querySelector('.header-actions');
  const mainNav = document.querySelector('.main-nav');

  if (!dados || !dados.usuario) return;

  if (dados.tipo === 'empresa') {
    if (mainNav) {
      mainNav.innerHTML = `
        <a href="home_empresa.html#nova-vaga">Publicar vaga</a>
        <a href="candidaturas_empresa.html">Candidatos</a>
      `;
    }

    if (headerActions) renderizarConta(headerActions, dados.usuario, dados.tipo);
  } else if (dados.tipo === 'candidato') {
    if (mainNav) {
      mainNav.innerHTML = `
        <a href="index.html">Início</a>
        <a href="vagas.html">Vagas</a>
        <a href="home_candidato.html#minhas-candidaturas">Minhas Candidaturas</a>
      `;
    }

    if (headerActions) renderizarConta(headerActions, dados.usuario, dados.tipo);
  }

  const btnSair = document.getElementById('btnSairHeader');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    });
  }
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    if (!obterUsuarioLogado()) {
      window.location.href = 'login.html';
    }
  }
});

document.addEventListener('DOMContentLoaded', atualizarHeader);
