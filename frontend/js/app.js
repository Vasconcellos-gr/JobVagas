const demoJobs = [
  {
    titulo: "Desenvolvedor Backend",
    empresa: "Tech Solutions",
    local: "São Paulo - SP",
    tipo: "CLT",
    modalidade: "Remoto",
    area: "Tecnologia",
    tags: ["Backend", "Node.js", "APIs"],
    descricao: "Desenvolvimento de APIs e serviços escaláveis com Node.js."
  },
  {
    titulo: "Product Designer",
    empresa: "Studio Nuvem",
    local: "São Paulo - SP",
    tipo: "PJ",
    modalidade: "Híbrido",
    area: "Design",
    tags: ["UI/UX", "Figma", "Produto"],
    descricao: "Criação de experiências digitais centradas nas pessoas."
  },
  {
    titulo: "Analista de Marketing Digital",
    empresa: "Viva Comércio",
    local: "Curitiba - PR",
    tipo: "CLT",
    modalidade: "Presencial",
    area: "Marketing",
    tags: ["Marketing", "Conteúdo", "SEO"],
    descricao: "Planejamento de campanhas e análise de resultados digitais."
  }
];

const vacancyList = document.querySelector("#listaVagas");
const isHomePage = document.body.dataset.page === "home";

if (vacancyList) {
  const filterForm = document.querySelector("#filtrosVagas");
  const searchInput = document.querySelector("#buscaVagas");
  if (!isHomePage && searchInput) {
    searchInput.value = new URLSearchParams(window.location.search).get("busca") || "";
  }
  const locationFilter = document.querySelector("#filtroLocalizacao");
  const areaFilter = document.querySelector("#filtroArea");
  const modalityFilter = document.querySelector("#filtroModalidade");
  const resultCount = document.querySelector("#contagemVagas");
  const notice = document.querySelector("#mensagemVagas");
  const reloadButton = document.querySelector("#carregarVagas");
  let jobs = [];

  function safeText(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
  }

  function getArea(job) {
    if (job.area) return safeText(job.area, "Outras áreas");
    const content = `${job.titulo || ""} ${job.descricao || ""}`.toLocaleLowerCase("pt-BR");
    if (/design|ux|ui|produto/.test(content)) return "Design";
    if (/marketing|seo|conteúdo|conteudo/.test(content)) return "Marketing";
    if (/venda|comercial|negócio|negocio/.test(content)) return "Vendas";
    if (/rh|recursos humanos|recrutamento/.test(content)) return "Recursos Humanos";
    if (/desenvol|tecnologia|software|dados|backend|frontend|program/.test(content)) {
      return "Tecnologia";
    }
    return "Outras áreas";
  }

  function updateSelect(select, values) {
    const currentValue = select.value;
    const options = document.createDocumentFragment();
    const anyOption = document.createElement("option");
    anyOption.value = "";
    anyOption.textContent = "Qualquer";
    options.append(anyOption);

    [...new Set(values.filter(Boolean))]
      .sort((first, second) => first.localeCompare(second, "pt-BR"))
      .forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        options.append(option);
      });

    select.replaceChildren(options);
    if ([...select.options].some((option) => option.value === currentValue)) {
      select.value = currentValue;
    }
  }

  function updateFilters() {
    if (isHomePage) return;
    updateSelect(locationFilter, jobs.map((job) => safeText(job.local)));
    updateSelect(areaFilter, jobs.map(getArea));
    updateSelect(
      modalityFilter,
      jobs.map((job) => safeText(job.modalidade || job.tipo))
    );
  }

  function createJobCard(job) {
    const item = document.createElement("li");
    item.className = "job-card";

    const top = document.createElement("div");
    top.className = "job-card-top";
    const identity = document.createElement("div");
    identity.className = "job-identity";

    const icon = document.createElement("span");
    icon.className = "company-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = safeText(job.empresa, "E").trim().charAt(0).toUpperCase() || "E";

    const titleCompany = document.createElement("div");
    titleCompany.className = "job-title-company";
    const title = document.createElement("h3");
    title.textContent = safeText(job.titulo, "Vaga disponível");
    const company = document.createElement("p");
    company.className = "company-name";
    company.textContent = safeText(job.empresa, "Empresa");
    titleCompany.append(title, company);
    identity.append(icon, titleCompany);

    const status = document.createElement("span");
    status.className = "job-status";
    status.textContent = "Ativa";
    top.append(identity, status);

    const meta = document.createElement("div");
    meta.className = "job-meta";
    const location = document.createElement("span");
    location.textContent = safeText(job.local, "Localização não informada");
    const modality = document.createElement("span");
    modality.textContent = safeText(job.modalidade || job.tipo, "Modalidade não informada");
    meta.append(location, modality);

    const tags = document.createElement("div");
    tags.className = "job-tags";
    const jobTags = [
      getArea(job),
      ...(Array.isArray(job.tags) ? job.tags.slice(0, 3).map((tag) => safeText(tag)) : [])
    ];
    if (!job.tags && job.tipo) jobTags.push(safeText(job.tipo));
    [...new Set(jobTags)].forEach((tag) => {
      const badge = document.createElement("span");
      badge.textContent = tag;
      tags.append(badge);
    });

    const footer = document.createElement("div");
    footer.className = "job-card-footer";
    if (job.salario) {
      const salary = document.createElement("span");
      salary.className = "job-salary";
      salary.textContent = safeText(job.salario);
      footer.append(salary);
    }

    if (isHomePage) {
      const detailsLink = document.createElement("a");
      detailsLink.className = "details-link";
      detailsLink.href = `vagas.html?busca=${encodeURIComponent(
        safeText(job.titulo)
      )}`;
      detailsLink.textContent = "Ver vaga →";
      footer.append(detailsLink);
      item.append(top, meta, tags, footer);
      return item;
    }

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-link";
    detailsButton.type = "button";
    detailsButton.setAttribute("aria-expanded", "false");
    detailsButton.textContent = "Ver detalhes";

    const description = document.createElement("p");
    description.className = "job-description";
    description.hidden = true;
    description.textContent = safeText(
      job.descricao,
      "Mais informações sobre esta vaga serão disponibilizadas pela empresa."
    );
    detailsButton.addEventListener("click", () => {
      const expanded = detailsButton.getAttribute("aria-expanded") === "true";
      detailsButton.setAttribute("aria-expanded", String(!expanded));
      detailsButton.textContent = expanded ? "Ver detalhes" : "Ocultar detalhes";
      description.hidden = expanded;
    });
    footer.append(detailsButton);

    item.append(top, meta, tags, footer, description);
    return item;
  }

  function renderJobs(event) {
    if (event) event.preventDefault();
    if (isHomePage) {
      const featuredJobs = jobs.slice(0, 3);
      vacancyList.replaceChildren(...featuredJobs.map(createJobCard));
      if (featuredJobs.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent = "Ainda não há vagas publicadas. Volte em breve para conferir as novidades.";
        vacancyList.append(emptyState);
      }
      return;
    }

    const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    const selectedLocation = locationFilter.value;
    const selectedArea = areaFilter.value;
    const selectedModality = modalityFilter.value;

    const filteredJobs = jobs.filter((job) => {
      const searchableText = [
        job.titulo,
        job.empresa,
        job.local,
        job.descricao,
        ...(Array.isArray(job.tags) ? job.tags : [])
      ]
        .map((value) => safeText(value))
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return (
        (!term || searchableText.includes(term)) &&
        (!selectedLocation || job.local === selectedLocation) &&
        (!selectedArea || getArea(job) === selectedArea) &&
        (!selectedModality ||
          safeText(job.modalidade || job.tipo) === selectedModality)
      );
    });

    vacancyList.replaceChildren(...filteredJobs.map(createJobCard));
    resultCount.textContent = `${filteredJobs.length} ${
      filteredJobs.length === 1 ? "vaga encontrada" : "vagas encontradas"
    }`;

    if (filteredJobs.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "empty-state";
      emptyState.textContent =
        "Nenhuma vaga encontrada. Tente ajustar sua busca ou seus filtros.";
      vacancyList.append(emptyState);
    }
  }

  async function loadJobs() {
    if (reloadButton) {
      reloadButton.disabled = true;
      reloadButton.textContent = "Carregando...";
    }
    if (resultCount) resultCount.textContent = "Carregando vagas...";

    try {
      const response = await fetch("/api/vagas");
      if (!response.ok) {
        throw new Error(`A API respondeu com status ${response.status}.`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("A resposta da API não contém uma lista de vagas.");
      }

      jobs = data;
      notice.hidden = true;
    } catch (error) {
      console.error("Não foi possível carregar as vagas da API:", error);
      jobs = demoJobs;
      notice.textContent =
        "Não foi possível conectar à API. Exibindo vagas de demonstração.";
      notice.hidden = false;
    } finally {
      if (reloadButton) {
        reloadButton.disabled = false;
        reloadButton.textContent = "Atualizar vagas";
      }
    }

    updateFilters();
    renderJobs();
  }

  if (filterForm) filterForm.addEventListener("submit", renderJobs);
  if (locationFilter) locationFilter.addEventListener("change", renderJobs);
  if (areaFilter) areaFilter.addEventListener("change", renderJobs);
  if (modalityFilter) modalityFilter.addEventListener("change", renderJobs);
  if (reloadButton) reloadButton.addEventListener("click", loadJobs);
  loadJobs();
}