// js/vagas.js

// Variáveis globais para controlar a edição
let idVagaEmEdicao = null;
let cardEmEdicao = null;

// ==========================================
// 1. RENDERIZAR E LISTAR VAGAS
// ==========================================
function renderizarVagasDaEmpresa(vagas) {
  const container = document.getElementById('listaVagasEmpresa');
  if (!container) return;
  
  container.innerHTML = ''; 

  if (vagas.length === 0) {
    container.innerHTML = '<p class="notice">Ainda não publicou nenhuma vaga.</p>';
    return;
  }

  vagas.forEach(vaga => {
    const card = document.createElement('li');
    card.className = 'job-card';
    
    // Guarda os dados no elemento
    card.dataset.id = vaga._id;
    card.dataset.titulo = vaga.titulo;
    card.dataset.local = vaga.localizacao || vaga.local || '';
    card.dataset.tipo = vaga.tipo || 'CLT';
    card.dataset.salario = vaga.salario || '';
    card.dataset.tags = vaga.tags ? vaga.tags.join(', ') : '';

    card.innerHTML = `
    <div class="job-card-top">
        <div class="job-identity">
        <span class="company-icon" aria-hidden="true">${(vaga.titulo || 'V').charAt(0).toUpperCase()}</span>
        <div class="job-title-company">
            <h3>${vaga.titulo}</h3>
        </div>
        </div>
        <span class="job-status">Ativa</span>
    </div>
    <div class="job-meta">
        <span>${vaga.localizacao || vaga.local || 'Não informado'}</span>
        <span>${vaga.tipo || 'CLT'}</span>
    </div>
    <div class="job-tags">
        ${(vaga.tags || []).map(tag => `<span>${tag}</span>`).join('')}
    </div>
    <div class="job-card-footer">
        <span class="job-salary">${vaga.salario || 'A combinar'}</span>
        <div style="display: flex; gap: 10px;">
            <button class="details-link editar-vaga-btn" type="button">Editar</button>
            <button class="details-link excluir-vaga-btn" type="button" style="color: #ef4444; border-color: #ef4444;">Excluir</button>
        </div>
    </div>
    `;

    container.appendChild(card);
  });

  // Ativa os eventos dos botões recém-criados
  ativarBotoesEdicao();
  ativarBotoesExclusao();
}

async function carregarVagasDaEmpresa() {
  const dadosSessao = localStorage.getItem('usuarioLogado');
  if (!dadosSessao) return;
  
  const sessao = JSON.parse(dadosSessao);
  const empresaId = sessao.usuario.id || sessao.usuario._id;

  try {
    const resposta = await fetch(`/api/vagas/empresa/${empresaId}`);
    if (resposta.ok) {
      const vagas = await resposta.json();
      renderizarVagasDaEmpresa(vagas);
    } else {
      const container = document.getElementById('listaVagasEmpresa');
      if(container) container.innerHTML = '<p class="notice">Erro ao carregar as vagas.</p>';
    }
  } catch (erro) {
    console.error('Erro de conexão:', erro);
    const container = document.getElementById('listaVagasEmpresa');
    if(container) container.innerHTML = '<p class="notice">Erro de ligação com o servidor.</p>';
  }
}

// ==========================================
// 2. AÇÕES NAS VAGAS (EDITAR E EXCLUIR)
// ==========================================
function ativarBotoesEdicao() {
  const editarVagaSection = document.getElementById('editar-vaga');
  
  document.querySelectorAll('.editar-vaga-btn').forEach((botao) => {
    botao.addEventListener('click', (event) => {
      cardEmEdicao = event.target.closest('.job-card');
      idVagaEmEdicao = cardEmEdicao.dataset.id; 

      document.getElementById('editarTitulo').value = cardEmEdicao.dataset.titulo;
      document.getElementById('editarLocal').value = cardEmEdicao.dataset.local;
      document.getElementById('editarTipo').value = cardEmEdicao.dataset.tipo;
      document.getElementById('editarSalario').value = cardEmEdicao.dataset.salario;
      document.getElementById('editarTags').value = cardEmEdicao.dataset.tags;

      if (editarVagaSection) {
        editarVagaSection.style.display = 'block';
        editarVagaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function ativarBotoesExclusao() {
  document.querySelectorAll('.excluir-vaga-btn').forEach((botao) => {
    botao.addEventListener('click', async (event) => {
      const card = event.target.closest('.job-card');
      const idDaVaga = card.dataset.id;
      const tituloDaVaga = card.dataset.titulo;

      // Confirmação nativa do navegador
      if (confirm(`Tem certeza que deseja excluir permanentemente a vaga "${tituloDaVaga}"?`)) {
        try {
          const resposta = await fetch(`/api/vagas/${idDaVaga}`, {
            method: 'DELETE'
          });

          if (resposta.ok) {
            carregarVagasDaEmpresa(); // Recarrega a lista sem a vaga apagada
          } else {
            alert('Erro ao excluir a vaga.');
          }
        } catch (error) {
          alert('Erro de conexão ao tentar excluir.');
        }
      }
    });
  });
}

// ==========================================
// 3. INICIALIZAÇÃO E FORMULÁRIOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  carregarVagasDaEmpresa();

  // --- LÓGICA DE EDITAR VAGA ---
  const formEditarVaga = document.getElementById('formEditarVaga');
  const editarVagaSection = document.getElementById('editar-vaga');
  const cancelarEdicao = document.getElementById('cancelarEdicao');

  if (cancelarEdicao) {
    cancelarEdicao.addEventListener('click', () => {
      if (editarVagaSection) editarVagaSection.style.display = 'none';
      if (formEditarVaga) formEditarVaga.reset();
      cardEmEdicao = null;
      idVagaEmEdicao = null;
    });
  }

  if (formEditarVaga) {
    formEditarVaga.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!idVagaEmEdicao) return;

      const dadosAtualizados = {
        titulo: document.getElementById('editarTitulo').value.trim(),
        localizacao: document.getElementById('editarLocal').value.trim(),
        tipo: document.getElementById('editarTipo').value,
        salario: document.getElementById('editarSalario').value.trim(),
        tags: document.getElementById('editarTags').value.trim().split(',').map(tag => tag.trim()).filter(Boolean)
      };

      try {
        const resposta = await fetch(`/api/vagas/${idVagaEmEdicao}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosAtualizados)
        });

        const msgEdicao = document.getElementById('mensagemEditarVaga');

        if (resposta.ok) {
          if (msgEdicao) {
            msgEdicao.textContent = 'Vaga atualizada com sucesso!';
            msgEdicao.style.color = '#10b981';
            msgEdicao.hidden = false;
          }
          
          setTimeout(() => {
            if (editarVagaSection) editarVagaSection.style.display = 'none';
            formEditarVaga.reset();
            if (msgEdicao) msgEdicao.hidden = true;
            cardEmEdicao = null;
            idVagaEmEdicao = null;
            carregarVagasDaEmpresa(); 
          }, 1500);

        } else {
          if (msgEdicao) {
            msgEdicao.textContent = 'Erro ao atualizar a vaga.';
            msgEdicao.style.color = '#ef4444';
            msgEdicao.hidden = false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  // --- LÓGICA DE PUBLICAR NOVA VAGA ---
  const formNovaVaga = document.getElementById('formNovaVaga');
  if (formNovaVaga) {
    formNovaVaga.addEventListener('submit', async (event) => {
      event.preventDefault();

      const dadosSessao = localStorage.getItem('usuarioLogado');
      if (!dadosSessao) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }
      
      const sessao = JSON.parse(dadosSessao);
      
      // 2. Monta a vaga com TODOS os campos necessários
      const dadosNovaVaga = {
        titulo: document.getElementById('vagaTitulo').value.trim(),
        localizacao: document.getElementById('vagaLocal').value.trim(), 
        tipo: document.getElementById('vagaTipo').value,
        salario: document.getElementById('vagaSalario').value.trim(),
        descricao: document.getElementById('vagaDescricao').value.trim(),
        
        // 🚀 LÊ AS TAGS, SEPARA POR VÍRGULA E LIMPA OS ESPAÇOS
        tags: document.getElementById('vagaTags').value.trim() 
                ? document.getElementById('vagaTags').value.split(',').map(tag => tag.trim()).filter(Boolean) 
                : [], 
                
        empresaId: sessao.usuario.id || sessao.usuario._id,
        empresaNome: sessao.usuario.nome || 'Empresa Confidencial' 
      };

      const btnSubmit = formNovaVaga.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.textContent = 'A publicar...';
      btnSubmit.disabled = true;

      try {
        const resposta = await fetch('/api/vagas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosNovaVaga)
        });

        const msgAviso = document.getElementById('mensagemNovaVaga');

        if (resposta.ok) {
          if (msgAviso) {
            msgAviso.textContent = 'Vaga publicada com sucesso!';
            msgAviso.style.color = '#10b981';
            msgAviso.hidden = false;
          }
          
          formNovaVaga.reset();
          carregarVagasDaEmpresa();

          setTimeout(() => { if(msgAviso) msgAviso.hidden = true; }, 3000);

        } else {
          const erro = await resposta.json();
          if (msgAviso) {
            msgAviso.textContent = 'Erro: ' + (erro.detalhes || erro.erro);
            msgAviso.style.color = '#ef4444';
            msgAviso.hidden = false;
          }
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      } finally {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
      }
    });
  }
});