/* ==========================================================================
   JOSUÉ SANTOS IA // APP LOGIC & INTERACTIONS
   - FAQ Accordion
   - WhatsApp Briefing Formatter & Sender
   - Multi-language (PT/EN) Switcher
   - Smooth Navigation
   ========================================================================== */

(function () {
  'use strict';

  // 1. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fechar outros itens abertos para manter visual limpo
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      if (!isExpanded) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });

  // 2. TRANSMISSÃO DE BRIEFING VIA WHATSAPP DIRECT
  const briefingForm = document.getElementById('briefingForm');
  if (briefingForm) {
    briefingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const brief = document.getElementById('projectBrief').value.trim();

      if (!name || !service || !brief) return;

      const whatsappNumber = '5561982116291';
      
      const message = 
        `⚡ *TRANSMISSÃO DE BRIEFING // JOSUÉ SANTOS IA*\n\n` +
        `👤 *Cliente / Empresa:* ${name}\n` +
        `🎯 *Capacidade de Interesse:* ${service}\n` +
        `📝 *Detalhes do Projeto:*\n${brief}\n\n` +
        `_Enviado através do terminal interativo em josuesantosia.com.br_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 3. SISTEMA DE IDIOMA (PT / EN)
  const langButtons = document.querySelectorAll('.lang-btn');
  const translations = {
    pt: {
      nav01: 'SERVIÇOS',
      nav02: 'SISTEMA',
      nav03: 'PROCESSO',
      nav04: 'SOBRE',
      nav05: 'FAQ',
      heroEyebrow: 'CREATIVE INTELLIGENCE / V4',
      heroH1_1: 'O MUNDO SE TORNA',
      heroH1_2: 'CINEMATOGRÁFICO.',
      heroSub: 'Uma camada de inteligência e direção humana para marcas que exigem impacto visual, velocidade e excelência estética em cada frame.',
      btnExplore: 'EXPLORAR SISTEMA',
      btnShowreel: 'VER FLUXO DE PRODUÇÃO',
      statusText: 'Disponível para novos projetos e campanhas de alto impacto'
    },
    en: {
      nav01: 'SERVICES',
      nav02: 'SYSTEM',
      nav03: 'PROCESS',
      nav04: 'ABOUT',
      nav05: 'FAQ',
      heroEyebrow: 'CREATIVE INTELLIGENCE / V4',
      heroH1_1: 'THE WORLD BECOMES',
      heroH1_2: 'CINEMATIC.',
      heroSub: 'An intelligence and human direction layer for brands that demand visual impact, agility and aesthetic excellence in every frame.',
      btnExplore: 'EXPLORE SYSTEM',
      btnShowreel: 'VIEW PRODUCTION FLOW',
      statusText: 'Available for high-impact projects and campaigns'
    }
  };

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      langButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (translations[lang]) {
        const t = translations[lang];
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length >= 5) {
          navLinks[0].childNodes[1].nodeValue = ' ' + t.nav01;
          navLinks[1].childNodes[1].nodeValue = ' ' + t.nav02;
          navLinks[2].childNodes[1].nodeValue = ' ' + t.nav03;
          navLinks[3].childNodes[1].nodeValue = ' ' + t.nav04;
          navLinks[4].childNodes[1].nodeValue = ' ' + t.nav05;
        }

        const heroSub = document.querySelector('.hero-subtitle');
        if (heroSub) heroSub.textContent = t.heroSub;

        const heroH1 = document.querySelector('.hero-title');
        if (heroH1) {
          heroH1.innerHTML = `${t.heroH1_1} <br><span class="text-glow">${t.heroH1_2}</span>`;
        }

        const statusText = document.querySelector('.status-text');
        if (statusText) statusText.textContent = t.statusText;
      }
    });
  });

  // 4. CONTROLE DE ÁUDIO PARA TODOS OS VÍDEOS DO SITE
  function setupVideoAudioToggle(btnId, videoId) {
    const btn = document.getElementById(btnId);
    const video = document.getElementById(videoId);

    if (btn && video) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const stateEl = btn.querySelector('.audio-state');

        if (video.muted) {
          // Mutar os outros vídeos para evitar áudios sobrepostos
          document.querySelectorAll('video').forEach((v) => {
            if (v !== video) v.muted = true;
          });
          document.querySelectorAll('.video-audio-toggle').forEach((b) => {
            if (b !== btn) {
              b.classList.remove('is-playing-audio');
              const s = b.querySelector('.audio-state');
              if (s) s.textContent = 'DESATIVADO';
              b.setAttribute('aria-label', 'Ativar áudio do vídeo');
            }
          });

          video.muted = false;
          video.volume = 1.0;
          video.play().catch(() => {});
          btn.classList.add('is-playing-audio');
          if (stateEl) stateEl.textContent = 'ATIVADO';
          btn.setAttribute('aria-label', 'Desativar áudio do vídeo');
        } else {
          video.muted = true;
          btn.classList.remove('is-playing-audio');
          if (stateEl) stateEl.textContent = 'DESATIVADO';
          btn.setAttribute('aria-label', 'Ativar áudio do vídeo');
        }
      });
      // Permite clicar diretamente no vídeo para ativar/desativar áudio
      video.addEventListener('click', () => {
        btn.click();
      });
      video.style.cursor = 'pointer';
    }
  }

  setupVideoAudioToggle('audioToggleHero', 'heroVideo');
  setupVideoAudioToggle('audioToggleAuthor', 'authorDirectorVideo');
  setupVideoAudioToggle('audioToggleDirector', 'directorVideo');

})();
