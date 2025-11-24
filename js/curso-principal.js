document.addEventListener("DOMContentLoaded", () => {
  const trilha = document.querySelector(".trilha-invex");
  const cursos = document.querySelectorAll(".conteudo-curso");

  cursos.forEach(curso => (curso.style.display = "none"));

  // Função para abrir curso
  window.abrirCurso = function (numero) {
    cursos.forEach(curso => (curso.style.display = "none"));
    trilha.style.display = "none";

    const cursoAtivo = document.getElementById(`curso${numero}`);
    if (cursoAtivo) {
      cursoAtivo.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.error(`Curso ${numero} não encontrado!`);
    }
    const titulo = document.getElementById("tituloTrilha");
    const icone = document.getElementById("iconeTrilha");

    if (titulo) titulo.style.display = "none";
    if (icone) icone.style.display = "none";

  };

  // Voltar para trilha
  window.voltarParaTrilha = function () {
    cursos.forEach(curso => (curso.style.display = "none"));
    trilha.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
    const titulo = document.getElementById("tituloTrilha");
    const icone = document.getElementById("iconeTrilha");

    if (titulo) titulo.style.display = "block";
    if (icone) icone.style.display = "block";
  };

  function comecarCurso(numCurso) {
    // Salva o número do curso atual
    localStorage.setItem("cursoAtual", numCurso);

    // Redireciona para o arquivo do curso específico
    window.location.href = `curso${numCurso}.html`;
  }


  // abrir/fechar módulos
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const panel = btn.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});


function atualizarProgresso(curso) {
  const modulos = curso.querySelectorAll(".panel");
  const concluidos = curso.querySelectorAll(".progresso-circulo.concluido");
  const progresso = (concluidos.length / modulos.length) * 100;

  // adiciona barra de progresso se não existir
  let barraContainer = curso.querySelector(".progresso-container");
  if (!barraContainer) {
    barraContainer = document.createElement("div");
    barraContainer.classList.add("progresso-container");
    const barra = document.createElement("div");
    barra.classList.add("progresso-barra");
    barraContainer.appendChild(barra);
    curso.insertBefore(barraContainer, curso.querySelector("h1").nextSibling);
  }

  const barra = curso.querySelector(".progresso-barra");
  barra.style.width = progresso + "%";
}

// mapa de rotas
const cursoFiles = {
  1: 'curso1.html',
  2: 'curso2.html',
  3: 'curso3.html',
  4: 'curso4.html'
};

// chamar para iniciar um curso: salva cursoAtual e vai para a página correta
function comecarCurso(numCurso) {
  // guarda qual curso o usuário está abrindo (opcional, mas útil)
  localStorage.setItem('cursoAtual', numCurso);

  // determina o arquivo alvo - usa o mapa; se não existir, tenta o padrão curso{n}.html
  const alvo = cursoFiles[numCurso] || `curso${numCurso}.html`;

  console.log(`[comecarCurso] curso ${numCurso} -> ${alvo}`);
  window.location.href = alvo;
}

//  SISTEMA DE PROGRESSO DE CURSOS 

// Salva progresso de um curso
function salvarProgresso(numCurso, numModulo) {
  localStorage.setItem(`curso${numCurso}_progresso`, numModulo);
}

// Mostra módulo específico e atualiza progresso
function mostrarModulo(num, cursoId = 1) {
  const modulos = document.querySelectorAll('.modulo');
  const botoes = document.querySelectorAll('.modulo-btn');
  const progresso = document.querySelector('.progresso-barra');

  modulos.forEach(m => m.classList.remove('ativo'));
  botoes.forEach(b => b.classList.remove('ativo'));

  const moduloAtual = document.getElementById(`modulo${num}`);
  if (moduloAtual) moduloAtual.classList.add('ativo');

  if (botoes[num - 1]) botoes[num - 1].classList.add('ativo');

  // Atualiza barra de progresso
  if (progresso) {
    const progressoPercent = (num / modulos.length) * 100;
    progresso.style.width = `${progressoPercent}%`;
  }

  // Salva progresso
  salvarProgresso(cursoId, num);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Carrega progresso salvo ao abrir o curso
function carregarProgresso(cursoId = 1) {
  const salvo = localStorage.getItem(`curso${cursoId}_progresso`);
  if (salvo) {
    mostrarModulo(parseInt(salvo), cursoId);
  } else {
    mostrarModulo(1, cursoId);
  }
}

// Avançar manualmente para o próximo módulo
function proximoModulo(num, cursoId = 1) {
  mostrarModulo(num, cursoId);
}

//VOLTAR OU ENTRAR NO CURSO 

// Vai para a página do curso
function comecarCurso(numCurso) {
  window.location.href = `curso${numCurso}.html`;
}

// Voltar à trilha
function voltarParaTrilha() {
  window.location.href = "trilha.html";
}


// TELA DA TRILHA 

// Atualiza botões “Começar” / “Continuar” na tela principal
function atualizarTrilha() {
  for (let i = 1; i <= 4; i++) {
    const botao = document.querySelector(`#curso${i} .comecar-trilha`);
    const progresso = localStorage.getItem(`curso${i}_progresso`);

    if (botao) {
      if (progresso && parseInt(progresso) > 1) {
        botao.textContent = '⏩ Continuar';
      } else {
        botao.textContent = '▶️ Começar';
      }
    }
  }
}

// Executa automaticamente se a trilha estiver aberta
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector('.trilha-invex')) {
    atualizarTrilha();
  }
});
