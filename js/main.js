
/**
 * Formata um número como moeda em reais (BRL - Real brasileiro)
 * 
 * @param {number} valor 
 * @returns {string}
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

//  MENU LATERAL 
//

/**
 * Aguarda o carregamento completo do DOM antes de executar
 */
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o botão do menu (ícone de abrir/fechar)
  const menuBotao = document.getElementById('menuBotao');

  // Seleciona o menu lateral (painel que abre e fecha)
  const menuLateral = document.getElementById('menuLateral');

  // Garante que ambos os elementos existam na página antes de aplicar eventos
  if (menuBotao && menuLateral) {

    // Adiciona o comportamento de abrir/fechar o menu ao clicar no botão
    menuBotao.addEventListener('click', () => {
      menuLateral.classList.toggle('ativo');
    });

    // Fecha o menu caso o usuário clique fora dele
    document.addEventListener('click', (e) => {

      if (!menuLateral.contains(e.target) && !menuBotao.contains(e.target)) {
        menuLateral.classList.remove('ativo');
      }
    });
  }
});

// Atualiza automaticamente o ano do footer
document.addEventListener("DOMContentLoaded", () => {
  const anoFooter = document.getElementById("ano-footer");
  if (anoFooter) {
    anoFooter.textContent = new Date().getFullYear();
  }
});
