document.addEventListener('DOMContentLoaded', () => {
  const formCandidato = document.getElementById('formCandidato');
  const mensagemCandidato = document.getElementById('mensagemCandidato');

  if (formCandidato) {
    formCandidato.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Função auxiliar para capturar e limpar o valor dos campos
      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };

      const dadosCandidato = {
        nome: getVal('candidatoNome'),
        email: getVal('candidatoEmail'),
        senha: getVal('candidatoSenha'),
        telefone: getVal('candidatoTelefone'),
        dataNascimento: getVal('candidatoNascimento'),
        perfil: getVal('candidatoPerfil'),
        experiencia: getVal('candidatoExperiencia'),
        linkedin: getVal('candidatoLinkedin')
      };

      try {
        const resposta = await fetch('/api/candidatos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosCandidato)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
          // Redireciona para a página de login informando o sucesso no cadastro
          window.location.href = 'login.html?cadastrado=true';
        } else {
          // Exibe a mensagem de erro caso o cadastro falhe
          const txtErro = resultado.erro || resultado.mensagem || 'Erro ao cadastrar candidato.';
          if (mensagemCandidato) {
            mensagemCandidato.textContent = txtErro;
            mensagemCandidato.style.color = 'red';
            mensagemCandidato.hidden = false;
          }
        }
      } catch (error) {
        console.error('Erro na requisição Fetch:', error);
        if (mensagemCandidato) {
          mensagemCandidato.textContent = 'Erro de conexão com o servidor.';
          mensagemCandidato.style.color = 'red';
          mensagemCandidato.hidden = false;
        }
      }
    });
  }
});