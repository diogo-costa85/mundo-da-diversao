document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const adminPanel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('login-form');
  const galleryManagement = document.getElementById('gallery-management');
  const saveChangesBtn = document.getElementById('save-changes');
  const changePasswordForm = document.getElementById('change-password-form');

  let toysData = []; // Armazenar os dados dos brinquedos
  const correctUser = 'admin';
  let correctPassword = 'admin'; // Senha para acessar o painel

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === correctUser && password === correctPassword) {
      loginSection.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      loadToys();
    } else {
      alert('Usuário ou senha incorretos!');
    }
  });

  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    if (newPassword) {
      correctPassword = newPassword; // Simulação de alteração de senha
      alert('Senha alterada com sucesso! (Simulação)');
      document.getElementById('new-password').value = '';
    } else {
      alert('Por favor, insira uma nova senha.');
    }
  });

  async function loadToys() {
    try {
      const response = await fetch('brinquedos.json');
      toysData = await response.json();
      renderToys(toysData);
    } catch (error) {
      console.error('Erro ao carregar brinquedos:', error);
    }
  }

  function renderToys(toys) {
    galleryManagement.innerHTML = '';
    toys.forEach((toy) => {
      const toyElement = document.createElement('div');
      toyElement.classList.add('toy-item');
      toyElement.dataset.id = toy.id;
      toyElement.innerHTML = `
        <h4>${toy.name}</h4>
        <img src="${toy.image}" alt="${toy.alt || toy.name}" width="100" />
        <div class="form-field">
          <label for="image-upload-${toy.id}">Nova Imagem</label>
          <input type="file" id="image-upload-${toy.id}" accept="image/*" />
        </div>
        <div class="form-field">
          <label for="available-${toy.id}">Disponível</label>
          <input type="checkbox" id="available-${toy.id}" ${toy.available ? 'checked' : ''} />
        </div>
      `;
      galleryManagement.appendChild(toyElement);

      const imageUpload = toyElement.querySelector(`#image-upload-${toy.id}`);
      imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = toyElement.querySelector('img');
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  saveChangesBtn.addEventListener('click', async () => {
    const updatedToys = [];
    const toyElements = document.querySelectorAll('.toy-item');

    toyElements.forEach((toyElement) => {
      const id = toyElement.dataset.id;
      const name = toyElement.querySelector('h4').textContent;
      const image = toyElement.querySelector('img').src; // Usar a imagem exibida
      const available = toyElement.querySelector(`#available-${id}`).checked;
      const originalToy = toysData.find(t => t.id == id);
      const alt = originalToy ? originalToy.alt : name;

      updatedToys.push({ id, name, image, alt, available });
    });

    // Esta é uma simulação. Em um projeto real, você enviaria os dados para um backend.
    console.log('Salvando alterações (simulação):', updatedToys);
    alert('Alterações salvas com sucesso! (Simulação)');
  });

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  // Carregar e gerenciar informações do site
  const siteInfoForm = document.getElementById("site-info-form");

  async function loadSiteInfo() {
    try {
      const response = await fetch("site-info.json");
      const data = await response.json();

      // Preencher formulário
      document.getElementById("whatsapp").value = data.contact.whatsapp;
      document.getElementById("whatsapp-link-input").value = data.contact.whatsapp_link;
      document.getElementById("email").value = data.contact.email;
      document.getElementById("attendance-input").value = data.contact.attendance;
      document.getElementById("instagram").value = data.social.instagram;
      document.getElementById("facebook").value = data.social.facebook;
      document.getElementById("tiktok").value = data.social.tiktok;
    } catch (error) {
      console.error("Erro ao carregar informações do site:", error);
    }
  }

  siteInfoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedInfo = {
      contact: {
        whatsapp: document.getElementById("whatsapp").value,
        whatsapp_link: document.getElementById("whatsapp-link-input").value,
        email: document.getElementById("email").value,
        attendance: document.getElementById("attendance-input").value,
      },
      social: {
        instagram: document.getElementById("instagram").value,
        facebook: document.getElementById("facebook").value,
        tiktok: document.getElementById("tiktok").value,
      },
    };

    // Simulação de salvamento (não salva no servidor)
    localStorage.setItem('siteInfo', JSON.stringify(updatedInfo));
    console.log("Salvando informações do site:", updatedInfo);
    alert("Informações do site salvas com sucesso! (Simulação)");
  });

  // Carregar brinquedos e informações do site ao entrar no painel admin
  if (sessionStorage.getItem("loggedIn")) {
    loginForm.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadBrinquedosAdmin();
    loadSiteInfo();
  }
});
