

// Token de acesso da API Brapi 
const token = "qhDre8CcDgWeytAb4kS5t5";

// Lê os parâmetros da URL atual 
const urlParams = new URLSearchParams(window.location.search);

// Pega o valor do parâmetro acao
const simbolo = urlParams.get("acao");

// Elemento HTML onde os detalhes serão exibidos
const container = document.getElementById("detalhesAcao");

// 
// Se nenhuma ação foi passada na URL, exibe mensagem de aviso
// 
if (!simbolo) {
  container.innerHTML = "<p>Nenhuma ação selecionada.</p>";
} else {
  // Caso contrário, busca os detalhes da ação informada
  buscarDetalhes(simbolo);
}

// 
// Função principal: busca e exibe os dados da ação
// 
async function buscarDetalhes(simbolo) {
  // Monta a URL de requisição da API da Brapi
  const url = `https://brapi.dev/api/quote/${simbolo}?token=${token}`;

  try {
    // Faz a requisição para a API
    const resp = await fetch(url);

    // Converte a resposta para JSON
    const json = await resp.json();

    // A API retorna um objeto com o array "results"
    // Pega o primeiro elemento (a ação consultada)
    const acao = json.results?.[0];

    // Se não encontrar a ação, mostra mensagem de erro
    if (!acao) {
      container.innerHTML = "<p>Não foi possível carregar os dados da ação.</p>";
      return;
    }

    //
    // Monta o HTML com os dados retornados da API
    // 
    container.innerHTML = `
      <div class="detalhes-card">
        <!-- Logo da empresa -->
        <img src="${acao.logourl}" alt="${acao.symbol}" class="acao-logo-grande">

        <!-- Nome e símbolo -->
        <h1>${acao.shortName} (${acao.symbol})</h1>
        <h3>${acao.longName || ""}</h3>

        <!-- Dados financeiros principais -->
        <p><strong>Preço Atual:</strong> R$ ${acao.regularMarketPrice.toFixed(2)}</p>
        <p><strong>Variação Diária:</strong> ${acao.regularMarketChangePercent.toFixed(2)}%</p>
        <p><strong>P/L:</strong> ${acao.priceEarnings?.toFixed(2) || "—"}</p>
        <p><strong>LPA:</strong> ${acao.earningsPerShare?.toFixed(2) || "—"}</p>
        <p><strong>Volume:</strong> ${acao.regularMarketVolume?.toLocaleString("pt-BR") || "—"}</p>

        <!-- Faixa de preço do último ano -->
        <p><strong>Maior e menor preço (último ano):</strong> R$ ${acao.fiftyTwoWeekRange || "—"} </p>
      </div>
    `;
  } catch (erro) {
    // Em caso de erro na requisição, exibe uma mensagem de falha
    container.innerHTML = `<p>Erro ao buscar ação: ${erro.message}</p>`;
  }
}
