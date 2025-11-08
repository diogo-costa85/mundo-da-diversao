const WHATSAPP_NUMBER = '5511978252488'; // Número oficial com DDI +55 e DDD 11

function buildWhatsAppLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const text = encodeURIComponent(message);
  return `${base}?text=${text}`;
}

function getSelectedToys() {
  return Array.from(document.querySelectorAll('input[name="brinquedos"]:checked')).map(i => i.value);
}

function composeMessageFromForm() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const data = document.getElementById('data_evento').value;
  const local = document.getElementById('local').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const brinquedos = getSelectedToys();

  const linhas = [
    `Olá! Gostaria de solicitar um orçamento.`,
    `Nome: ${nome || '-'}`,
    `Telefone: ${telefone || '-'}`,
    `Data do evento: ${data || '-'}`,
    `Local: ${local || '-'}`,
    `Brinquedos desejados: ${brinquedos.length ? brinquedos.join(', ') : '-'}`,
    mensagem ? `Observações: ${mensagem}` : null,
  ].filter(Boolean);

  return linhas.join('\n');
}

function validateForm() {
  const requiredIds = ['nome', 'telefone', 'data_evento', 'local'];
  for (const id of requiredIds) {
    const el = document.getElementById(id);
    if (!el || !el.value || !el.value.trim()) return false;
  }
  return true;
}

// Smooth scroll for internal anchors
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function wireWhatsAppButtons() {
  const defaultMsg = 'Olá! Quero um orçamento para minha festa infantil.';
  const heroBtn = document.getElementById('whatsappHeroBtn');
  const heroBtn2 = document.getElementById('whatsappHeroBtn2');
  const directBtn = document.getElementById('whatsappDirectBtn');
  const footerLink = document.getElementById('footerWhatsApp');

  [heroBtn, heroBtn2, directBtn, footerLink].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = buildWhatsAppLink(defaultMsg);
      window.open(url, '_blank');
    });
  });
}

function wireFormSubmission() {
  const form = document.getElementById('budgetForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const msg = composeMessageFromForm();
    const url = buildWhatsAppLink(msg);
    window.open(url, '_blank');
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const brinquedosList = document.getElementById("brinquedos-list");

  enableSmoothScroll();
  wireWhatsAppButtons();
  wireFormSubmission();

  const galleryGrid = document.querySelector('.gallery-grid');

  async function loadToys() {
    // Don't run toy loading logic if the gallery isn't on the page
    if (!galleryGrid) return;

    try {
      const response = await fetch('brinquedos.json');
      const toys = await response.json();
      renderToys(toys);
    } catch (error) {
      console.error('Erro ao carregar brinquedos:', error);
    }
  }

  function renderToys(toys) {
    galleryGrid.innerHTML = '';
    toys.forEach(toy => {
      if (toy.available) {
        const toyElement = document.createElement('article');
        toyElement.classList.add('item-card');
        toyElement.innerHTML = `
          <img src="${toy.image}" alt="${toy.alt}" loading="lazy" decoding="async" onerror="this.src='assets/placeholder-toy.webp'" />
          <div class="item-info">
            <h3>${toy.name}</h3>
            <p>${toy.description}</p>
          </div>
        `;
        galleryGrid.appendChild(toyElement);
      }
    });
  }

  // Carregar informações do site
  const localSiteInfo = localStorage.getItem('siteInfo');

  if (localSiteInfo) {
    const data = JSON.parse(localSiteInfo);
    updateFooter(data);
  } else {
    fetch("site-info.json")
      .then((response) => response.json())
      .then((data) => {
        updateFooter(data);
      });
  }

  function updateFooter(data) {
    // Contato
    const whatsappLink = document.getElementById("whatsapp-link");
    whatsappLink.href = `https://wa.me/${data.contact.whatsapp_link}`;
    whatsappLink.textContent = data.contact.whatsapp;

    const emailLink = document.getElementById("email-link");
    emailLink.href = `mailto:${data.contact.email}`;
    emailLink.textContent = data.contact.email;

    document.getElementById("attendance").textContent = data.contact.attendance;

    // Redes sociais
    document.getElementById("instagram-link").href = data.social.instagram;
    document.getElementById("facebook-link").href = data.social.facebook;
    document.getElementById("tiktok-link").href = data.social.tiktok;
  }

  loadToys();
});