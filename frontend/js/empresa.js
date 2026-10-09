document.addEventListener('DOMContentLoaded', () => {
  const formEmpresa = document.getElementById('formEmpresa');
  const mensagemEmpresa = document.getElementById('mensagemEmpresa');

  if (formEmpresa) {
    formEmpresa.addEventListener('submit', async (e) => {
      e.preventDefault();

      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };

      const dadosEmpresa = {
        nome: getVal('empresaNome'),
        cnpj: getVal('empresaCnpj'),
        email: getVal('empresaEmail'),
        senha: getVal('empresaSenha'),
        telefone: getVal('empresaTelefone'),
        setor: getVal('empresaSetor'),
        endereco: getVal('empresaEndereco'),
        bairro: getVal('empresaBairro'),
        cidade: getVal('empresaCidade'),
        estado: getVal('empresaEstado'),
        website: getVal('empresaWebsite'),
        descricao: getVal('empresaDescricao')
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
          // Redireciona para a tela de login enviando o parâmetro de mensagem de sucesso na URL
          window.location.href = 'login.html?cadastrado=true';
        } else {
          // Em caso de erro, exibe na própria tela
          const txtErro = resultado.erro || resultado.mensagem || 'Erro ao cadastrar empresa.';
          if (mensagemEmpresa) {
            mensagemEmpresa.textContent = txtErro;
            mensagemEmpresa.style.color = 'red';
            mensagemEmpresa.hidden = false;
          }
        }
      } catch (error) {
        console.error('Erro na requisição Fetch:', error);
        if (mensagemEmpresa) {
          mensagemEmpresa.textContent = 'Erro de conexão com o servidor.';
          mensagemEmpresa.style.color = 'red';
          mensagemEmpresa.hidden = false;
        }
      }
    });
  }
});