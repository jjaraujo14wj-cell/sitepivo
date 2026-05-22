/* ================================================
   PIVÔ SHOP — script.js
   
   Funcionalidades:
   1. Header fixo com fundo ao rolar
   2. Menu hambúrguer (mobile)
   3. Animações de entrada ao rolar
   4. Filtro de produtos por categoria
   5. Formulário de contato com feedback
   6. Botão voltar ao topo
   7. Fechar menu ao clicar em link
   ================================================ */


/* ===== AGUARDA O HTML CARREGAR COMPLETAMENTE ===== */
document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     1. HEADER — adiciona fundo quando rolar
     ============================================ */
  const header = document.getElementById('header');

  window.addEventListener('scroll', function () {
    // Se rolou mais de 50px, adiciona a classe "scrolled"
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  /* ============================================
     2. MENU HAMBÚRGUER (mobile)
     ============================================ */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  menuToggle.addEventListener('click', function () {
    // Alterna entre aberto e fechado
    const estaAberto = nav.classList.contains('aberto');

    if (estaAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  function abrirMenu() {
    nav.classList.add('aberto');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-label', 'Fechar menu');
  }

  function fecharMenu() {
    nav.classList.remove('aberto');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }

  // Fecha o menu ao clicar em qualquer link de navegação
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', fecharMenu);
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', function (e) {
    const clicouFora = !nav.contains(e.target) && !menuToggle.contains(e.target);
    if (clicouFora && nav.classList.contains('aberto')) {
      fecharMenu();
    }
  });


  /* ============================================
     3. ANIMAÇÕES DE ENTRADA AO ROLAR
     
     Usamos IntersectionObserver — ele "observa"
     os elementos e dispara quando ficam visíveis.
     ============================================ */
  const elementosAnimados = document.querySelectorAll('[data-animate]');

  // Opções do observer
  const observerOptions = {
    threshold: 0.1,         // dispara quando 10% do elemento estiver visível
    rootMargin: '0px 0px -50px 0px'  // ignora os últimos 50px da tela
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Pega o delay definido no HTML (data-delay="200")
        const delay = entry.target.dataset.delay || 0;

        setTimeout(function () {
          entry.target.classList.add('animado');
        }, parseInt(delay));

        // Para de observar depois que o elemento entrou
        // (para a animação não repetir ao rolar de volta)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Registra cada elemento para ser observado
  elementosAnimados.forEach(function (elemento) {
    observer.observe(elemento);
  });


  /* ============================================
     4. FILTRO DE PRODUTOS POR CATEGORIA
     ============================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const produtosCards = document.querySelectorAll('.produto-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filtroSelecionado = this.dataset.filter;

      // Atualiza o botão ativo
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Mostra/oculta os produtos
      produtosCards.forEach(function (card) {
        const categoriaCard = card.dataset.categoria;

        if (filtroSelecionado === 'todos' || categoriaCard === filtroSelecionado) {
          // Mostra o card com animação suave
          card.classList.remove('oculto');
          card.style.animation = 'none';
          // Força repintura para re-disparar animação
          card.offsetHeight;
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.classList.add('oculto');
        }
      });
    });
  });

  // Adiciona animação CSS dinamicamente (para o filtro)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);


  /* ============================================
     5. FORMULÁRIO DE CONTATO
     
     Simula o envio (sem backend).
     Para envio real: use Formspree.io (gratuito)
     ============================================ */
  const form = document.getElementById('contatoForm');
  const btnText = document.getElementById('btnText');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // impede o recarregamento da página

      // Simula carregamento
      btnText.textContent = 'Enviando...';
      form.querySelector('button[type="submit"]').disabled = true;

      // Simula delay de envio (1.5 segundos)
      setTimeout(function () {
        // Sucesso!
        feedback.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        feedback.className = 'form__feedback sucesso';

        // Reseta o formulário
        form.reset();
        btnText.textContent = 'Enviar Mensagem';
        form.querySelector('button[type="submit"]').disabled = false;

        // Esconde o feedback depois de 5 segundos
        setTimeout(function () {
          feedback.className = 'form__feedback';
        }, 5000);

      }, 1500);

      /* 
        Para envio real com Formspree:
        1. Crie conta em formspree.io
        2. Crie um novo formulário e copie o ID
        3. No HTML, mude action="https://formspree.io/f/SEU_ID"
        4. Substitua o código acima por:
        
        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            feedback.textContent = '✅ Mensagem enviada!';
            feedback.className = 'form__feedback sucesso';
            form.reset();
          } else {
            throw new Error('Erro no envio');
          }
        })
        .catch(() => {
          feedback.textContent = '❌ Erro ao enviar. Tente pelo WhatsApp!';
          feedback.className = 'form__feedback erro';
        });
      */
    });
  }


  /* ============================================
     6. BOTÃO VOLTAR AO TOPO
     ============================================ */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('visivel');
    } else {
      backToTop.classList.remove('visivel');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================
     7. LINK ATIVO NO MENU AO ROLAR
     
     Destaca o link do menu correspondente
     à seção que está sendo visualizada.
     ============================================ */
  const secoes = document.querySelectorAll('section[id]');
  const linksNav = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', function () {
    let secaoAtual = '';

    secoes.forEach(function (secao) {
      const topo = secao.offsetTop - 120; // compensa o header
      if (window.scrollY >= topo) {
        secaoAtual = secao.getAttribute('id');
      }
    });

    linksNav.forEach(function (link) {
      link.classList.remove('ativo');
      if (link.getAttribute('href') === '#' + secaoAtual) {
        link.classList.add('ativo');
      }
    });
  });


  /* ============================================
     EXTRA: Confirmação visual ao clicar
     nos botões de WhatsApp nos produtos
     ============================================ */
  const botoesWpp = document.querySelectorAll('.produto-card .btn--primary');
  botoesWpp.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const textoOriginal = this.innerHTML;
      this.innerHTML = '<i class="ri-check-line"></i> Abrindo WhatsApp...';
      setTimeout(() => {
        this.innerHTML = textoOriginal;
      }, 2000);
    });
  });

}); // fim do DOMContentLoaded