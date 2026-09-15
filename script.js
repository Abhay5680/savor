const menuItems = [
  { category: "starters", name: "Classic Bruschetta", description: "Toasted bread with fresh tomatoes, basil and olive oil", price: "₹320", image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=85", alt: "Classic bruschetta with tomatoes and basil" },
  { category: "starters", name: "Truffle Arancini", description: "Crisp risotto bites, wild mushrooms and parmesan", price: "₹390", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85", alt: "Golden arancini rice balls with greens" },
  { category: "main-course", name: "Creamy Alfredo Pasta", description: "Rich and creamy pasta with Parmesan and herbs", price: "₹450", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=85", alt: "Creamy pasta topped with herbs" },
  { category: "main-course", name: "Grilled Salmon", description: "Perfectly grilled salmon with seasonal vegetables", price: "₹620", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=85", alt: "Grilled salmon with vegetables and lemon" },
  { category: "main-course", name: "Herb-Crusted Chicken", description: "Tender chicken, rosemary jus and roasted roots", price: "₹540", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=85", alt: "Herb-crusted roasted chicken with vegetables" },
  { category: "desserts", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center", price: "₹380", image: "https://cookingfromheart.com/wp-content/uploads/2017/07/Eggless-Choco-Lava-Cake-5.jpg", alt: "Chocolate lava cake dusted with sugar" },
  { category: "desserts", name: "Saffron Panna Cotta", description: "Silky vanilla cream with saffron and pistachio", price: "₹340", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85", alt: "Panna cotta with berries and pistachios" },
  { category: "beverages", name: "Rosemary Citrus Fizz", description: "Fresh citrus, rosemary and sparkling water", price: "₹240", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85", alt: "Citrus drink with rosemary and ice" }
];

const menuGrid = document.querySelector("#menu-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const backToTop = document.querySelector(".back-to-top");

function renderMenu(filter = "all") {
  const visibleItems = filter === "all" ? menuItems : menuItems.filter((item) => item.category === filter);
  menuGrid.innerHTML = visibleItems.map((item, index) => `
    <article class="menu-card" style="animation-delay: ${index * 45}ms">
      <div class="menu-card-image"><img src="${item.image}" alt="${item.alt}" loading="lazy"></div>
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <span class="price">${item.price}</span>
          <button class="add-button" type="button" aria-label="Add ${item.name} to your order">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.filter);
     // Clicked button ko automatically screen ke center mein scroll kara do
    button.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  });
});

function closeMobileMenu() {
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileMenu.classList.remove("open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.classList.toggle("open", isOpen);
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    closeMobileMenu();
  });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav .nav-link, .mobile-menu .nav-link");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%" });
sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver((entries, observerInstance) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observerInstance.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderMenu();

// ==========================================================
// Reservation form validation (single source of truth)
// ==========================================================
(function () {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  const fields = {
    name:   { el: document.getElementById('name'),   error: document.getElementById('name-error') },
    email:  { el: document.getElementById('email'),  error: document.getElementById('email-error') },
    date:   { el: document.getElementById('date'),   error: document.getElementById('date-error') },
    time:   { el: document.getElementById('time'),   error: document.getElementById('time-error') },
    guests: { el: document.getElementById('guests'), error: document.getElementById('guests-error') },
  };

  const successMsg = document.getElementById('reservation-success-message');
  const formMessage = document.getElementById('form-message');

  function showError(field, message) {
    fields[field].el.classList.add('input-error');
    if (fields[field].error) fields[field].error.textContent = message;
  }

  function clearError(field) {
    fields[field].el.classList.remove('input-error');
    if (fields[field].error) fields[field].error.textContent = '';
  }

  function validateName() {
    const value = fields.name.el.value.trim();
    if (!value) {
      showError('name', 'Please enter your name.');
      return false;
    }
    if (!/^[A-Za-z ]+$/.test(value)) {
      showError('name', 'Only letters and spaces allowed.');
      return false;
    }
    clearError('name');
    return true;
  }

  function validateEmail() {
    const value = fields.email.el.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      showError('email', 'Please enter your email.');
      return false;
    }
    if (!emailPattern.test(value)) {
      showError('email', 'Please enter a valid email address.');
      return false;
    }
    clearError('email');
    return true;
  }

  function validateDate() {
    const value = fields.date.el.value;
    if (!value) {
      showError('date', 'Please select a date.');
      return false;
    }
    const selected = new Date(value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showError('date', 'Date cannot be in the past.');
      return false;
    }
    clearError('date');
    return true;
  }

  function validateTime() {
    if (!fields.time.el.value) {
      showError('time', 'Please select a time.');
      return false;
    }
    clearError('time');
    return true;
  }

  function validateGuests() {
    if (!fields.guests.el.value) {
      showError('guests', 'Please select number of guests.');
      return false;
    }
    clearError('guests');
    return true;
  }

  fields.name.el.addEventListener('blur', validateName);
  fields.email.el.addEventListener('blur', validateEmail);
  fields.date.el.addEventListener('change', validateDate);
  fields.time.el.addEventListener('change', validateTime);
  fields.guests.el.addEventListener('change', validateGuests);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();
    const isGuestsValid = validateGuests();

    const allValid = isNameValid && isEmailValid && isDateValid && isTimeValid && isGuestsValid;

    if (!allValid) {
      if (formMessage) {
        formMessage.textContent = 'Please fix the errors above and try again.';
        formMessage.style.color = '#e57373';
      }
      const firstInvalid = form.querySelector('.input-error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (formMessage) {
      formMessage.textContent = '';
    }
    if (successMsg) {
      successMsg.style.display = 'block';
    }
    form.reset();

    setTimeout(() => {
      if (successMsg) successMsg.style.display = 'none';
    }, 4000);
  });
})();
