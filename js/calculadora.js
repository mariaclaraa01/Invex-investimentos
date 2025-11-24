//
// Função principal: realiza o cálculo dos juros compostos diários
// 
function calcular(quantiaInicial, aporteMensal, taxaAnual, anos) {
  // Converte a taxa anual em taxa diária (dividindo por 365)
  const taxaDiaria = taxaAnual / 100 / 365;

  // Calcula o total de dias do investimento
  const diasTotais = Math.round(anos * 365);

  // Define os valores iniciais
  let saldo = quantiaInicial;     // Saldo acumulado atual
  let totalInvestido = quantiaInicial; // Soma de todo o valor investido

  // Vetor que armazenará o histórico mensal de resultados
  const resultadosMensais = [];

  let saldoAnterior = quantiaInicial; // Guarda o saldo do mês anterior
  let lucroAcumulado = 0; // Total de lucro acumulado até o momento

  // 
  // Loop principal - simula o investimento dia a dia
  // 
  for (let dia = 1; dia <= diasTotais; dia++) {

    // No início de cada mês (a cada 30 dias), adiciona o aporte mensal
    // Obs: o primeiro mês não recebe aporte extra
    if (dia % 30 === 1 && dia > 1) {
      saldo += aporteMensal;
      totalInvestido += aporteMensal;
    }

    //  Aplica os juros compostos diários
    saldo *= (1 + taxaDiaria);

    // Ao final de cada mês (a cada 30 dias), calcula o lucro
    if (dia % 30 === 0) {
      let lucroMes;

      // No primeiro mês, não desconta o aporte (pois ainda não houve)
      if (resultadosMensais.length === 0) {
        lucroMes = saldo - saldoAnterior;
      } else {
        lucroMes = saldo - saldoAnterior - aporteMensal;
      }

      // Atualiza o lucro acumulado
      lucroAcumulado += lucroMes;

      // Adiciona os dados do mês ao histórico
      resultadosMensais.push({
        mes: resultadosMensais.length + 1,
        saldo,
        totalInvestido,
        lucroMes,
        lucroAcumulado
      });

      // Atualiza o saldo anterior para o próximo cálculo
      saldoAnterior = saldo;
    }
  }

  // Calcula os totais finais
  const montanteFinal = saldo;
  const jurosGerados = montanteFinal - totalInvestido;

  // Retorna um objeto com os resultados do investimento
  return { montanteFinal, totalInvestido, jurosGerados, resultadosMensais };
}

//
// Parte responsável pela interação com a página (DOM)
//
document.addEventListener('DOMContentLoaded', () => {
  // Referências aos elementos do formulário e da tela
  const campoQuantiaInicial = document.getElementById('quantiaInicial');
  const campoAporteMensal = document.getElementById('aporteMensal');
  const campoTaxaAnual = document.getElementById('taxaAnual');
  const campoAnos = document.getElementById('anos');
  const botaoCalcular = document.getElementById('botaoCalcular');
  const botaoLimpar = document.getElementById('botaoLimpar');
  const areaResultado = document.getElementById('resultado');
  const valorFinalEl = document.getElementById('valorFinal');
  const totalInvestidoEl = document.getElementById('totalInvestido');
  const jurosGeradosEl = document.getElementById('jurosGerados');
  const mostrarTabela = document.getElementById('mostrarTabela');
  const areaTabela = document.getElementById('areaTabela');

  // 
  // Evento do botão Calcular
  //
  botaoCalcular.addEventListener('click', () => {
    // Lê e converte os valores digitados
    const q = parseFloat(campoQuantiaInicial.value) || 0;
    const a = parseFloat(campoAporteMensal.value) || 0;
    const t = parseFloat(campoTaxaAnual.value) || 0;
    const y = Math.min(parseFloat(campoAnos.value) || 0, 200); // limite de 200 anos

    // Executa o cálculo principal
    const { montanteFinal, totalInvestido, jurosGerados, resultadosMensais } = calcular(q, a, t, y);

    // Exibe os resultados no HTML formatados como moeda
    valorFinalEl.textContent = formatarMoeda(montanteFinal);
    totalInvestidoEl.textContent = formatarMoeda(totalInvestido);
    jurosGeradosEl.textContent = formatarMoeda(jurosGerados);

    // Torna a área de resultado visível
    areaResultado.style.display = 'block';

    // Se o usuário quiser ver a tabela detalhada
    if (mostrarTabela.checked) {
      renderizarTabela(resultadosMensais);
    } else {
      areaTabela.innerHTML = '';
    }
  });

  // 
  // Evento do botão "Limpar"
  // 
  botaoLimpar.addEventListener('click', () => {
    // Limpa todos os campos e resultados
    campoQuantiaInicial.value = '';
    campoAporteMensal.value = '';
    campoTaxaAnual.value = '';
    campoAnos.value = '';
    areaResultado.style.display = 'none';
    areaTabela.innerHTML = '';
  });

  // 
  // Evento do checkbox "Mostrar tabela"
  // 
  mostrarTabela.addEventListener('change', () => {

    if (areaResultado.style.display === 'none') return;

    // Recalcula e exibe a tabela se marcado
    if (mostrarTabela.checked) {
      const q = parseFloat(campoQuantiaInicial.value) || 0;
      const a = parseFloat(campoAporteMensal.value) || 0;
      const t = parseFloat(campoTaxaAnual.value) || 0;
      const y = parseFloat(campoAnos.value) || 0;
      const { resultadosMensais } = calcular(q, a, t, y);
      renderizarTabela(resultadosMensais);
    } else {

      areaTabela.innerHTML = '';
    }
  });


  function renderizarTabela(resultadosMensais) {

    let html = `
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Saldo (R$)</th>
            <th>Investido (R$)</th>
            <th>Lucro do mês</th>
            <th>Lucro acumulado</th>
          </tr>
        </thead>
        <tbody>
    `;


    resultadosMensais.forEach(l => {
      html += `
        <tr>
          <td style="text-align:left">${l.mes}</td>
          <td>${formatarMoeda(l.saldo)}</td>
          <td>${formatarMoeda(l.totalInvestido)}</td>
          <td>${formatarMoeda(l.lucroMes)}</td>
          <td>${formatarMoeda(l.lucroAcumulado)}</td>
        </tr>`;
    });


    html += '</tbody></table>';
    areaTabela.innerHTML = html;
  }
});
