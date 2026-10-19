
// Aguarda o carregamento completo do HTML antes de executar o código.
document.addEventListener('DOMContentLoaded', () => {

  // Localiza todos os componentes que possuem abas de conta.
  // O atributo data-account-tabs identifica cada conjunto de abas.
  document.querySelectorAll('[data-account-tabs]').forEach((tabs) => {

    // Busca todos os botões de abas dentro do componente.
    // Array.from transforma a lista de elementos em um array.
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));

    // Localiza os painéis associados aos botões.
    // O atributo aria-controls informa o ID do painel correspondente.
    // filter(Boolean) remove os painéis que não foram encontrados.
    const panels = buttons
      .map((button) =>
        document.getElementById(button.getAttribute('aria-controls'))
      )
      .filter(Boolean);

    // Ativa o painel selecionado e desativa os demais.
    // updateHash indica se o endereço da página deve ser atualizado.
    function activate(panel, updateHash = false) {

      // Verifica se o painel recebido pertence a este conjunto de abas.
      // Se não pertencer, interrompe a função.
      if (!panels.includes(panel)) return;

      // Percorre todos os painéis para definir qual ficará visível.
      panels.forEach((item) => {

        // Verifica se o painel atual é o painel selecionado.
        const active = item === panel;

        // Exibe o painel ativo e oculta os demais.
        item.hidden = !active;

        // Localiza o botão associado ao painel atual.
        const button = buttons.find(
          (tab) => tab.getAttribute('aria-controls') === item.id
        );

        // Atualiza os atributos do botão, caso ele exista.
        if (button) {

          // Informa aos recursos de acessibilidade
          // se a aba está selecionada.
          button.setAttribute('aria-selected', String(active));

          // Permite a navegação por Tab somente na aba ativa.
          // As demais abas podem ser acessadas pelas setas do teclado.
          button.tabIndex = active ? 0 : -1;
        }
      });

      // Atualiza o fragmento da URL quando solicitado
      // e quando o painel possui um hash configurado.
      if (updateHash && panel.dataset.tabHash) {
        history.replaceState(null, '', panel.dataset.tabHash);
      }
    }

    // Configura os eventos de interação de cada botão de aba.
    buttons.forEach((button, index) => {

      // Evento executado quando o usuário clica em uma aba.
      button.addEventListener('click', () => {

        // Recupera o painel associado ao botão clicado.
        const panel = document.getElementById(
          button.getAttribute('aria-controls')
        );

        // Ativa o painel e atualiza o endereço da página.
        activate(panel, true);
      });

      // Evento executado quando o usuário pressiona uma tecla
      // enquanto o botão da aba está em foco.
      button.addEventListener('keydown', (event) => {

        // Permite a navegação por teclado apenas com as setas
        // para a esquerda e para a direita.
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }

        // Impede o comportamento padrão das setas do navegador.
        event.preventDefault();

        // Define a direção da navegação:
        // direita avança uma aba e esquerda volta uma aba.
        const direction = event.key === 'ArrowRight' ? 1 : -1;

        // Calcula o índice da próxima aba.
        // O operador % permite voltar ao início ou ao fim
        // quando o usuário ultrapassa os limites do conjunto.
        const nextIndex =
          (index + direction + buttons.length) % buttons.length;

        // Coloca o foco do teclado no próximo botão.
        buttons[nextIndex].focus();

        // Ativa o painel correspondente à nova aba
        // e atualiza o endereço da página.
        activate(
          document.getElementById(
            buttons[nextIndex].getAttribute('aria-controls')
          ),
          true
        );
      });
    });

    // Ativa a aba correspondente ao fragmento presente na URL.
    // Exemplo: pagina.html#experiencia
    function activateFromLocation() {

      // Lê o fragmento da URL, remove o caractere #
      // e procura o elemento que possui esse ID.
      // decodeURIComponent interpreta caracteres codificados na URL.
      const target = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1))
      );

      // Procura o painel de abas que contém o elemento encontrado.
      const panel = target && target.closest('.account-tab-panel');

      // Ativa o painel somente se ele pertencer a este conjunto de abas.
      if (panel && panels.includes(panel)) {
        activate(panel);
      }
    }

    // Observa os cliques em links que possuem um fragmento na URL.
    // Isso permite abrir a aba correta quando um link aponta
    // para uma seção localizada dentro de um painel.
    document.addEventListener('click', (event) => {

      // Verifica se o alvo do clique é um elemento HTML.
      // Em seguida, procura o link mais próximo que contenha # no href.
      const link = event.target instanceof Element
        ? event.target.closest('a[href*="#"]')
        : null;

      // Interrompe a execução se o clique não ocorreu em um link válido.
      if (!link) return;

      // Converte o endereço do link em um objeto URL.
      // Isso permite consultar o caminho e o fragmento separadamente.
      const destination = new URL(link.href, window.location.href);

      // Ignora links que apontam para outra página
      // ou que não possuem um fragmento.
      if (
        destination.pathname !== window.location.pathname ||
        !destination.hash
      ) {
        return;
      }

      // Localiza o elemento indicado pelo fragmento do link.
      const target = document.getElementById(
        decodeURIComponent(destination.hash.slice(1))
      );

      // Identifica o painel de abas que contém o elemento de destino.
      const panel = target && target.closest('.account-tab-panel');

      // Ativa o painel caso ele pertença ao conjunto atual de abas.
      if (panel && panels.includes(panel)) {
        activate(panel);
      }
    });

    // Detecta alterações no fragmento da URL, como quando o usuário
    // navega pelo histórico do navegador ou altera o hash.
    window.addEventListener('hashchange', activateFromLocation);

    // Define a aba inicial.
    // Primeiro, procura o painel cujo botão já esteja selecionado.
    // Se nenhum estiver selecionado, utiliza o primeiro painel.
    activate(
      panels.find((panel) =>
        buttons.find(
          (button) => button.getAttribute('aria-controls') === panel.id
        )
        ?.getAttribute('aria-selected') === 'true'
      ) || panels[0]
    );

    // Verifica se a URL atual aponta para um elemento dentro de outra aba.
    // Se houver um destino válido, ativa o painel correspondente.
    activateFromLocation();
  });
});
