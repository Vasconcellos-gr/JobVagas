document.addEventListener('DOMContentLoaded', () => {
  const formEmpresa = document.getElementById('formEmpresa');
  const tabelaEmpresas = document.getElementById('tabelaEmpresas');

  // Buscar e listar todas as empresas com todos os dados
  async function carregarEmpresas() {
    try {
      const resposta = await fetch('/api/empresas');
      const empresas = await resposta.json();

      if (!tabelaEmpresas) return;
      tabelaEmpresas.innerHTML = '';

      empresas.forEach(empresa => {
        // Formatar o endereço e bairro
        const local = [empresa.endereco, empresa.bairro].filter(Boolean).join(' - ') || '-';
        
        // Formatar website para link se existir
        const siteLink = empresa.website 
          ? `<a href="${empresa.website}" target="_blank" rel="noopener noreferrer">Acessar</a>` 
          : '-';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${empresa.nome}</strong></td>
          <td>${empresa.cnpj || '-'}</td>
          <td>${empresa.email || '-'}</td>
          <td>${empresa.telefone || '-'}</td>
          <td>${local}</td>
          <td>${empresa.cidade || '-'}/${empresa.estado || '-'}</td>
          <td>${siteLink}</td>
          <td>
            <button class="button" onclick="deletarEmpresa('${empresa._id}')" style="color: red; border-color: red; padding: 0 10px; height: 30px; line-height: 30px;">Excluir</button>
          </td>
        `;
        tabelaEmpresas.appendChild(tr);
      });
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  }

  // Enviar novos dados ao cadastrar
  if (formEmpresa) {
    formEmpresa.addEventListener('submit', async (e) => {
      e.preventDefault();

      const dadosEmpresa = {
        nome: document.getElementById('nome').value,
        cnpj: document.getElementById('cnpj').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        website: document.getElementById('website').value
      };

      try {
        const resposta = await fetch('/api/empresas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosEmpresa)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
          alert('Empresa cadastrada com sucesso!');
          formEmpresa.reset();
          carregarEmpresas();
        } else {
          alert('Erro ao cadastrar: ' + (resultado.erro || 'Verifique os dados informados'));
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    });
  }

  // Excluir empresa
  window.deletarEmpresa = async (id) => {
    if (confirm('Deseja realmente excluir esta empresa?')) {
      try {
        const resposta = await fetch(`/api/empresas/${id}`, {
          method: 'DELETE'
        });

        if (resposta.ok) {
          alert('Empresa excluída com sucesso!');
          carregarEmpresas();
        } else {
          alert('Erro ao excluir empresa.');
        }
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
      }
    }
  };

  carregarEmpresas();
});