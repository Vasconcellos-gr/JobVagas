
document.addEventListener('DOMContentLoaded', async () => {
  // Define as configurações específicas para cada tipo de perfil.
  // Cada perfil possui um endpoint da API e uma lista de campos.
  const configuracoes = {
    candidato: {
      endpoint: 'candidatos',
      campos: [
        'nome',
        'email',
        'telefone',
        'dataNascimento',
        'perfil',
        'experiencia',
        'linkedin'
      ]
    },
    empresa: {
      endpoint: 'empresas',
      campos: [
        'nome',
        'cnpj',
        'email',
        'telefone',
        'setor',
        'endereco',
        'bairro',
        'cidade',
        'estado',
        'website',
        'descricao'
      ]
    }
  };

  // Identifica o tipo de perfil definido no elemento body do HTML.
  const tipo = document.body.dataset.profileType;

  // Recupera a configuração correspondente ao perfil atual.
  const config = configuracoes[tipo];

  // Busca os elementos HTML responsáveis por exibir mensagens.
  const mensagem = document.getElementById('mensagemPerfil');
  const mensagemEdicao = document.getElementById('mensagemEdicaoPerfil');

  // Recupera o formulário utilizado para editar os dados do perfil.
  const form = document.getElementById('formPerfil');

  // Interrompe a execução caso o tipo de perfil ou algum elemento
  // obrigatório não exista na página.
  if (!config || !mensagem || !mensagemEdicao || !form) return;

  // Exibe uma mensagem na tela e define se ela representa um erro.
  function mostrarMensagem(elemento, texto, erro = false) {
    // Define o conteúdo da mensagem sem interpretar o texto como HTML.
    elemento.textContent = texto;

    // Oculta o elemento quando não existe mensagem para exibir.
    elemento.hidden = !texto;

    // Adiciona ou remove a classe CSS utilizada para destacar erros.
    elemento.classList.toggle('is-error', erro);
  }

  // Formata os valores recebidos para exibição na página.
  function formatarValor(campo, valor) {
    // Exibe um texto padrão quando o campo não possui valor.
    if (!valor) return 'Não informado';

    // Trata especificamente o campo de data de nascimento.
    if (campo === 'dataNascimento') {
      const data = new Date(valor);

      // Verifica se a data é válida e a formata no padrão brasileiro.
      // O fuso UTC ajuda a evitar alterações de dia na exibição.
      return Number.isNaN(data.getTime())
        ? 'Não informado'
        : new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'UTC'
          }).format(data);
    }

    // Converte os demais valores para texto.
    return String(valor);
  }

  // Preenche os campos do formulário e as informações exibidas
  // na página com os dados recebidos da API.
  function preencherPerfil(perfil) {
    // Percorre todos os campos configurados para o tipo de perfil.
    config.campos.forEach((campo) => {
      // Busca o campo correspondente dentro do formulário.
      const input = form.elements.namedItem(campo);

      // Busca o elemento HTML que exibe o valor desse campo.
      const texto = document.querySelector(
        `[data-profile-value="${campo}"]`
      );

      // Recupera o valor do perfil ou utiliza uma string vazia.
      const valor = perfil[campo] || '';

      // Preenche o campo do formulário, exceto o campo de senha.
      if (input && campo !== 'senha') {
        // Quando o campo é uma data, converte o valor para
        // o formato YYYY-MM-DD utilizado pelo input type="date".
        // Para os demais campos, utiliza o valor recebido da API.
        input.value = campo === 'dataNascimento' && valor
          ? new Date(valor).toISOString().slice(0, 10)
          : valor;
      }

      // Atualiza o texto exibido na página com o valor formatado.
      if (texto) {
        texto.textContent = formatarValor(campo, valor);
      }
    });

    // Localiza o elemento que apresenta o nome no cabeçalho do perfil.
    const nomeHeader = document.querySelector('.candidate-header-name');

    // Atualiza o cabeçalho quando o nome está disponível.
    // Utiliza um ícone diferente para candidatos e empresas.
    if (nomeHeader && perfil.nome) {
      nomeHeader.textContent =
        `${tipo === 'empresa' ? '🏢' : '👤'} ${perfil.nome}`;
    }

    // Localiza o elemento responsável pela saudação da página.
    // O ID muda conforme o tipo de perfil.
    const nomeSaudacao = document.getElementById(
      tipo === 'empresa' ? 'nomeEmpresa' : 'nomeCandidato'
    );

    // Atualiza a saudação com o nome do usuário.
    if (nomeSaudacao && perfil.nome) {
      nomeSaudacao.textContent = perfil.nome;
    }
  }

  // Declara a variável que armazenará os dados da sessão.
  let sessao;

  try {
    // Recupera a sessão do usuário armazenada no localStorage.
    // Caso a chave não exista, utiliza null.
    // JSON.parse converte o texto armazenado em um objeto JavaScript.
    sessao = JSON.parse(
      localStorage.getItem('usuarioLogado') || 'null'
    );
  } catch (error) {
    // Registra o erro no console caso os dados não sejam
    // um JSON válido.
    console.error('Não foi possível ler os dados da conta:', error);

    // Informa ao usuário que os dados da sessão não puderam ser lidos.
    mostrarMensagem(
      mensagem,
      'Não foi possível ler os dados da sua conta.',
      true
    );

    // Interrompe a execução para evitar operações sem uma sessão válida.
    return;
  }

  // Recupera o objeto do usuário.
  // A sessão pode armazenar os dados dentro de "usuario"
  // ou diretamente no objeto principal.
  const usuario = sessao && (sessao.usuario || sessao);

  // Obtém o identificador do usuário.
  // Aceita tanto a propriedade "id" quanto "_id".
  const usuarioId = usuario && (usuario.id || usuario._id);

  // Verifica se existe uma sessão, se o tipo de perfil corresponde
  // à página atual e se o usuário possui um identificador.
  if (!sessao || sessao.tipo !== tipo || !usuarioId) {
    // Solicita que o usuário entre na conta antes de continuar.
    mostrarMensagem(
      mensagem,
      'Entre na sua conta para visualizar e editar o perfil.',
      true
    );

    // Interrompe a execução quando a sessão não é válida.
    return;
  }

  // Declara a variável que armazenará os dados completos do perfil.
  let perfil;

  try {
    // Faz uma requisição GET para buscar os dados do usuário na API.
    // encodeURIComponent protege o ID ao utilizá-lo na URL.
    const resposta = await fetch(
      `/api/${config.endpoint}/${encodeURIComponent(usuarioId)}`
    );

    // Converte o corpo da resposta para um objeto JavaScript.
    const resultado = await resposta.json();

    // Verifica se a resposta HTTP indica falha.
    // Se houver erro, utiliza a mensagem retornada pela API
    // ou uma mensagem padrão.
    if (!resposta.ok) {
      throw new Error(
        resultado.erro || 'Não foi possível carregar o perfil.'
      );
    }

    // Verifica se a API retornou algum resultado.
    if (!resultado) {
      throw new Error('A conta não foi encontrada.');
    }

    // Armazena os dados recebidos da API.
    perfil = resultado;

    // Preenche o formulário e as informações exibidas na página.
    preencherPerfil(perfil);

    // Limpa a mensagem de carregamento ou de erro anterior.
    mostrarMensagem(mensagem, '');
  } catch (error) {
    // Registra no console qualquer erro ocorrido durante a consulta.
    console.error('Erro ao carregar o perfil:', error);

    // Exibe a mensagem de erro na página.
    // Caso não exista uma mensagem específica, utiliza a padrão.
    mostrarMensagem(
      mensagem,
      error.message || 'Erro de conexão ao carregar o perfil.',
      true
    );

    // Interrompe a execução porque o perfil não foi carregado.
    return;
  }

  // Adiciona um evento ao formulário para tratar o envio dos dados.
  form.addEventListener('submit', async (event) => {
    // Impede o envio tradicional do formulário e o recarregamento
    // da página, permitindo enviar os dados por meio da API.
    event.preventDefault();

    // Recupera todos os campos do formulário e transforma
    // os pares nome/valor em um objeto JavaScript.
    const dados = Object.fromEntries(
      new FormData(form).entries()
    );

    // Se a senha estiver vazia, remove a propriedade do objeto.
    // Assim, a API pode manter a senha atual sem receber
    // uma senha vazia para substituí-la.
    if (!dados.senha) {
      delete dados.senha;
    }

    try {
      // Envia as alterações do perfil para a API usando PUT.
      const resposta = await fetch(
        `/api/${config.endpoint}/${encodeURIComponent(usuarioId)}`,
        {
          method: 'PUT',

          // Informa que os dados enviados estão no formato JSON.
          headers: {
            'Content-Type': 'application/json'
          },

          // Converte o objeto com os dados do formulário
          // para uma string JSON antes de enviá-lo.
          body: JSON.stringify(dados)
        }
      );

      // Converte a resposta da API para um objeto JavaScript.
      const resultado = await resposta.json();

      // Verifica se a API retornou um status HTTP de erro.
      if (!resposta.ok) {
        throw new Error(
          resultado.erro || 'Não foi possível salvar as alterações.'
        );
      }

      // Verifica se a API retornou os dados atualizados do perfil.
      if (!resultado) {
        throw new Error('A conta não foi encontrada.');
      }

      // Atualiza a variável com os dados retornados pela API.
      perfil = resultado;

      // Atualiza os campos do formulário e as informações da página
      // com os dados mais recentes.
      preencherPerfil(perfil);

      // Limpa o campo de senha após salvar as alterações.
      // Isso evita manter a senha visível no formulário.
      form.elements.namedItem('senha').value = '';

      // Atualiza o nome e o e-mail na sessão local.
      // Os demais dados existentes no objeto do usuário são mantidos.
      sessao.usuario = {
        ...usuario,
        nome: perfil.nome,
        email: perfil.email
      };

      // Salva a sessão atualizada no localStorage.
      localStorage.setItem(
        'usuarioLogado',
        JSON.stringify(sessao)
      );

      // Informa que as alterações foram salvas com sucesso.
      mostrarMensagem(
        mensagemEdicao,
        'Perfil atualizado com sucesso.'
      );
    } catch (error) {
      // Registra no console os erros ocorridos durante a atualização.
      console.error('Erro ao salvar o perfil:', error);

      // Exibe uma mensagem informando que não foi possível
      // salvar as alterações.
      mostrarMensagem(
        mensagemEdicao,
        error.message || 'Erro de conexão ao salvar o perfil.',
        true
      );
    }
  });
});
