document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksA = document.querySelectorAll(".nav-links li a");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  // Obsługa otwierania i zamykania menu
  hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
      navLinks.classList.remove("active");
      overlay.classList.remove("active");
  });

  // Funkcja ustawiania aktywnego linku
  function setActiveLink() {
      navLinksA.forEach(link => {
          link.classList.remove("active");
          if (window.location.href.includes(link.getAttribute("href"))) {
              link.classList.add("active");
          }
      });
  }

  // Ustawienie aktywnego linku przy załadowaniu strony
  setActiveLink();

  // Obsługa kliknięcia w link nawigacji - zmiana aktywnego linku
  navLinksA.forEach(link => {
      link.addEventListener("click", function () {
          navLinksA.forEach(l => l.classList.remove("active"));
          this.classList.add("active");
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    const header = document.querySelector("header");

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down - hide header
            header.classList.add("header-hidden");
        } else {
            // Scrolling up - show header
            header.classList.remove("header-hidden");
        }

        lastScrollTop = scrollTop;
    });
});

const productGrid = document.getElementById('productGrid');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupId = document.getElementById('popupId');
const popupText = document.getElementById('popupText');
const popupImage = document.getElementById('popupImage');
const pageSizeSelect = document.getElementById('pageSize');

let page = 1;
let pageSize = parseInt(pageSizeSelect.value);
let loading = false;

async function fetchProducts() {
  if (loading) return;
  loading = true;
  try {
    const res = await fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${page}&pageSize=${pageSize}`);
    const data = await res.json();

    data.data.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product-item';
      div.innerHTML = `<img src="${product.image}" alt=""><p>ID: ${product.id}</p>`;
      div.addEventListener('click', () => openPopup(product));
      productGrid.appendChild(div);
    });

    page++;
    loading = false;
  } catch (e) {
    console.error('Błąd wczytywania:', e);
    loading = false;
  }
}

function openPopup(product) {
  popupId.textContent = product.id;
  popupText.textContent = product.text;
  popupImage.src = product.image;
  popupOverlay.classList.add('active');
}

popupClose.addEventListener('click', () => {
  popupOverlay.classList.remove('active');
});

// Ładowanie przy przewijaniu do dołu
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    fetchProducts();
  }
});

// Zmiana liczby na stronie
pageSizeSelect.addEventListener('change', () => {
  pageSize = parseInt(pageSizeSelect.value);
  page = 1;
  productGrid.innerHTML = '';
  fetchProducts();
});

// Start
fetchProducts();
