
const API_KEY_NEWSAPI = "58a20cf83dcc4af8a5c1458ce300f8cc";
const QUERY_BUSINESS = "economia OR finanças OR bolsa OR moedas OR câmbio OR B3 OR IPCA OR SELIC OR inflação OR CDI OR dólar OR renda variável OR mercado de ações OR criptomoedas OR juros";
const API_URL_ATUAL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
  QUERY_BUSINESS
)}&language=pt&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY_NEWSAPI}`;

// FUNÇÃO: ATUALIZAR COTAÇÕES E INDICADORES
// 

async function carregarCotacoes() {
  const container = document.getElementById("cotacoes");

  if (!container) {
    console.error("Elemento #cotacoes não encontrado.");
    return;
  }

  try {
    // Carregar moedas, Bitcoin e Selic
    const [moedas, bitcoin, selic] = await Promise.all([
      fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CHF-BRL,ARS-BRL,CNY-BRL,MXN-BRL")
        .then(r => r.json()),
      fetch("https://economia.awesomeapi.com.br/json/last/BTC-BRL")
        .then(r => r.json()),
      fetch("https://brasilapi.com.br/api/taxas/v1/selic")
        .then(r => r.json())
    ]);

    // Formatação padrão BR com duas casas decimais
    const formatar = v =>
      Number(v).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    const cotacoes = [
      { nome: "Dólar", valor: ` R$ ${formatar(moedas.USDBRL.bid)}` },
      { nome: "Euro", valor: ` R$ ${formatar(moedas.EURBRL.bid)}` },
      { nome: "Libra", valor: ` R$ ${formatar(moedas.GBPBRL.bid)}` },
      { nome: "Iene", valor: ` R$ ${formatar(moedas.JPYBRL.bid)}` },
      { nome: "Franco Suíço", valor: ` R$ ${formatar(moedas.CHFBRL.bid)}` },
      { nome: "Peso Argentino", valor: ` R$ ${formatar(moedas.ARSBRL.bid)}` },
      { nome: "Yuan Chinês", valor: ` R$ ${formatar(moedas.CNYBRL.bid)}` },
      { nome: "Peso Mexicano", valor: ` R$ ${formatar(moedas.MXNBRL.bid)}` },
      { nome: "Bitcoin", valor: ` R$ ${formatar(bitcoin.BTCBRL.bid)}` },
      { nome: "Selic", valor: ` ${selic.valor}%` }
    ];

    // Duplica para criar efeito infinito
    const listaCompleta = cotacoes.concat(cotacoes);

    // Renderiza HTML
    container.innerHTML = listaCompleta
      .map(c => `<div class="cotacao-item"><span>${c.nome}:</span> ${c.valor}</div>`)
      .join("");

    iniciarCarrossel(container);

  } catch (erro) {
    console.error("Erro ao carregar cotações:", erro);
    container.innerHTML =
      "<div style='color:#ff4444;'>Erro ao carregar cotações</div>";
  }
}

function iniciarCarrossel(container) {
  let posicao = 0;
  let pausado = false;

  // Pausar quando passar o mouse
  container.addEventListener("mouseenter", () => {
    pausado = true;
  });

  container.addEventListener("mouseleave", () => {
    pausado = false;
  });

  function mover() {
    if (!pausado) {
      posicao -= 0.3;
      container.style.transform = `translateX(${posicao}px)`;

      if (Math.abs(posicao) >= container.scrollWidth / 2) {
        posicao = 0;
      }
    }

    requestAnimationFrame(mover);
  }

  mover();
}


carregarCotacoes();
setInterval(carregarCotacoes, 600000);

// Carrega EmailJS
(function () {
  emailjs.init("Zp45CnkJF0FBTMSRE");
})();

// Captura o formulário e envia
document.getElementById("formContato").addEventListener("submit", function (event) {
  event.preventDefault();

  emailjs.sendForm("service_o1bm7id", "template_axwp6rp", this)
    .then(() => {
      alert("Mensagem enviada com sucesso!");
      this.reset();
    })
    .catch((error) => {
      alert("Erro ao enviar: " + JSON.stringify(error));
    });
});

