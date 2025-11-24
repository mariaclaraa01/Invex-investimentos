//  Função para alternar entre módulos 
function mostrarModulo(num) {
  // Encontra o curso atualmente visível (ativo)
  const cursoAtivo = document.querySelector('.curso.ativo') || document;

  // Seleciona apenas os módulos e botões DENTRO do curso ativo
  const modulos = cursoAtivo.querySelectorAll('.modulo');
  const botoes = cursoAtivo.querySelectorAll('.modulo-btn');
  const progresso = cursoAtivo.querySelector('.progresso-barra');

  // Remove estados anteriores
  modulos.forEach(m => m.classList.remove('ativo'));
  botoes.forEach(b => b.classList.remove('ativo'));

  // Ativa o módulo e botão clicado
  const moduloAtual = cursoAtivo.querySelector(`#modulo${num}`);
  if (moduloAtual) moduloAtual.classList.add('ativo');
  if (botoes[num - 1]) botoes[num - 1].classList.add('ativo');

  // Atualiza barra de progresso (caso exista)
  if (progresso && modulos.length > 0) {
    const progressoPercent = (num / modulos.length) * 100;
    progresso.style.width = `${progressoPercent}%`;
  }

  // Volta ao topo suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

//  Avançar para o próximo módulo 
function proximoModulo(num) {
  mostrarModulo(num);
}

//  Salvar progresso no navegador 
function salvarProgresso(numCurso, numModulo) {
  localStorage.setItem(`curso${numCurso}_progresso`, numModulo);
}


