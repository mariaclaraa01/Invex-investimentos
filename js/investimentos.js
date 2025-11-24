// Obtém a referência do elemento HTML que exibirá as ações recomendadas
const listaAcoes = document.getElementById("listaAcoes");

// Token de acesso à API da Brapi (usado para autenticar as requisições)
const token = "qhDre8CcDgWeytAb4kS5t5";

// Lista das ações recomendadas que serão exibidas inicialmente na página
const recomendadas = ["PETR4", "VALE3", "ITUB4", "ITSA4", "BBDC4", "BBAS3"];

/**
 * Função que busca os dados de uma ação específica na API da Brapi
 * Recebe o símbolo (ex: "PETR4") e retorna um objeto com as informações principais
 */
async function buscarDadosAcao(simbolo) {
  // Monta a URL da requisição para a API, incluindo o token
  const url = `https://brapi.dev/api/quote/${simbolo}?token=${token}`;

  try {
    // Faz a chamada HTTP para buscar os dados da ação
    const resposta = await fetch(url);

    // Verifica se a resposta foi bem-sucedida
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);

    // Converte o corpo da resposta para JSON
    const json = await resposta.json();

    // Caso não tenha resultados válidos, retorna null
    if (!json.results || json.results.length === 0) return null;

    // Extrai o primeiro resultado (a ação buscada)
    const acao = json.results[0];

    // Retorna apenas as informações relevantes que serão usadas no site
    return {
      simbolo: acao.symbol, // Código da ação (ex: PETR4)
      nomeCurto: acao.shortName, // Nome curto da empresa
      nomeCompleto: acao.longName || acao.shortName,
      logo: acao.logourl || `https://icons.brapi.dev/icons/${acao.symbol}.svg`,
      precoAtual: acao.regularMarketPrice ?? 0,
      variacaoPercentual: acao.regularMarketChangePercent ?? 0,
      precoLucro: acao.priceEarnings ?? null,
      lucroPorAcao: acao.earningsPerShare ?? null,
    };
  } catch (erro) {
    // Caso aconteça algum erro (ex: sem internet ou símbolo inválido)
    console.error(`Erro ao buscar dados da ação ${simbolo}:`, erro);
    return null;
  }
}

/**
 * Função que busca várias ações em sequência
 * Recebe um array de símbolos e retorna um array com os dados de cada uma
 */
async function buscarDadosAcoes(simbolos) {
  // Cria uma lista de promessas para buscar todas as ações ao mesmo tempo
  const promessas = simbolos.map((simbolo) => buscarDadosAcao(simbolo));

  // Espera todas as promessas terminarem
  const resultados = await Promise.all(promessas);

  // Remove possíveis resultados nulos (ações que não foram encontradas)
  return resultados.filter(Boolean);
}

/**
 * Função que carrega e exibe na tela as ações recomendadas
 */
async function carregarAcoesRecomendadas() {
  // Exibe uma mensagem temporária enquanto carrega
  listaAcoes.innerHTML = "<p>Carregando ações...</p>";

  // Busca os dados das ações recomendadas
  const dados = await buscarDadosAcoes(recomendadas);

  // Caso a API falhe ou retorne vazio
  if (!dados.length) {
    listaAcoes.innerHTML = "<p>Não foi possível carregar as ações.</p>";
    return;
  }

  // Limpa a lista antes de exibir os cards
  listaAcoes.innerHTML = "";

  // Cria dinamicamente um "card" para cada ação
  dados.forEach((acao) => {
    const card = document.createElement("div");
    card.className = "acao-card";

    // Define o conteúdo HTML interno do card
    card.innerHTML = `
      <img src="${acao.logo}" alt="${acao.simbolo}" class="acao-logo"
           onerror="this.src='https://via.placeholder.com/48?text=?'">
      <h3>${acao.simbolo}</h3>
      <p class="acao-nome">${acao.nomeCurto || acao.nomeCompleto}</p>

      <div class="tooltip">
        <div><strong>Preço atual:</strong> R$ ${acao.precoAtual.toFixed(2)}</div>
        <div><strong>Variação diária:</strong> ${acao.variacaoPercentual.toFixed(2)}%</div>
        ${acao.precoLucro
        ? `<div><strong>P/L:</strong> ${acao.precoLucro.toFixed(2)}</div>`
        : ""
      }
        ${acao.lucroPorAcao
        ? `<div><strong>LPA:</strong> ${acao.lucroPorAcao.toFixed(2)}</div>`
        : ""
      }
      </div>
    `;

    // Adiciona o evento de clique no card para abrir a página de detalhes
    card.addEventListener("click", () => {
      // Redireciona para detalhes.html passando o símbolo da ação na URL
      window.location.href = `detalhes.html?acao=${acao.simbolo}`;
    });

    // Adiciona o card criado dentro da lista na página
    listaAcoes.appendChild(card);
  });
}


carregarAcoesRecomendadas();

// Seleciona os elementos da barra de busca (campo de texto e botão)
const inputBusca = document.querySelector(".search-bar input");
const botaoBusca = document.querySelector(".search-bar button");

botaoBusca.addEventListener("click", () => {
  const simbolo = inputBusca.value.trim().toUpperCase();

  if (simbolo) {
    // Redireciona para a página de detalhes, enviando o código digitado
    window.location.href = `detalhes.html?acao=${simbolo}`;
  } else {
    alert("Digite o código de uma ação, ex: PETR4, VALE3...");
  }
});

inputBusca.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    botaoBusca.click();
  }
});
