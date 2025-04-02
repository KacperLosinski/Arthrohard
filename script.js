document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksA = document.querySelectorAll(".nav-links li a");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  // Hamburger menu
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Active link setting
  function setActiveLink() {
    navLinksA.forEach(link => {
      link.classList.remove("active");
      if (window.location.href.includes(link.getAttribute("href"))) {
        link.classList.add("active");
      }
    });
  }

  setActiveLink();

  navLinksA.forEach(link => {
    link.addEventListener("click", function () {
      navLinksA.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});


// === PRODUKTY ===
const productGrid = document.getElementById('productGrid');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupId = document.getElementById('popupId');
const popupText = document.getElementById('popupText');
const popupImage = document.getElementById('popupImage');
const pageSizeSelect = document.getElementById('pageSize');
const loader = document.getElementById('loader');
const produktySection = document.getElementById('produkty');

let page = 1;
let pageSize = parseInt(pageSizeSelect.value);
let loading = false;
let produktyLoaded = false;

async function fetchProducts(reset = false) {
  if (loading) return;
  loading = true;
  loader.style.display = 'block';

  if (reset) {
    productGrid.innerHTML = '';
    page = 1;
  }

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
  } catch (e) {
    console.error('Błąd wczytywania:', e);
  } finally {
    loader.style.display = 'none';
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

// Infinite scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && produktyLoaded) {
    fetchProducts();
  }
});

// PageSize change
pageSizeSelect.addEventListener('change', () => {
  pageSize = parseInt(pageSizeSelect.value);
  fetchProducts(true); // true = reset
});

// Lazy load (initial fetch when user scrolls to section)
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !produktyLoaded) {
      produktyLoaded = true;
      fetchProducts();
      obs.unobserve(produktySection);
    }
  });
}, {
  threshold: 0.3
});

observer.observe(produktySection);
