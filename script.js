// Create floating elements
const floatingContainer = document.getElementById("floatingElements");
for (let i = 0; i < 15; i++) {
  const element = document.createElement("div");
  element.classList.add("floating-element");

  // Random size and position
  const size = Math.random() * 60 + 20;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const delay = Math.random() * 15;

  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.left = `${posX}%`;
  element.style.top = `${posY}%`;
  element.style.animationDelay = `${delay}s`;

  floatingContainer.appendChild(element);
}

// Logo click functionality
const logo = document.getElementById("logo");
const infoPanel = document.getElementById("infoPanel");
let isInfoPanelOpen = false;

logo.addEventListener("click", () => {
  isInfoPanelOpen = !isInfoPanelOpen;
  infoPanel.classList.toggle("active", isInfoPanelOpen);

  // Close mobile menu if open
  navLinks.classList.remove("active");
  menuToggle.querySelector("i").classList.add("fa-bars");
  menuToggle.querySelector("i").classList.remove("fa-times");
});

// Close info panel when clicking outside
document.addEventListener("click", (e) => {
  if (
    !logo.contains(e.target) &&
    !infoPanel.contains(e.target) &&
    isInfoPanelOpen
  ) {
    infoPanel.classList.remove("active");
    isInfoPanelOpen = false;
  }
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

// Check for saved theme or prefer-color-scheme
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.querySelector("i").classList.toggle("fa-bars");
  menuToggle.querySelector("i").classList.toggle("fa-times");

  // Close info panel if open
  if (isInfoPanelOpen) {
    infoPanel.classList.remove("active");
    isInfoPanelOpen = false;
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle.querySelector("i").classList.add("fa-bars");
    menuToggle.querySelector("i").classList.remove("fa-times");
  });
});

// Set active navigation link based on scroll position
const sections = document.querySelectorAll("section");
const navLinksAll = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === current) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // If it's the about text, animate paragraphs sequentially
      if (entry.target.classList.contains("about-text")) {
        const paragraphs = entry.target.querySelectorAll("p");
        paragraphs.forEach((p, index) => {
          setTimeout(() => {
            p.classList.add("visible");
          }, index * 300);
        });
      }

      // If it's skills container, animate skill cards sequentially
      if (entry.target.classList.contains("skills-container")) {
        const skillCards = entry.target.querySelectorAll(".skill-card");
        skillCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, index * 100);
        });
      }

      // If it's contact info, animate items sequentially
      if (entry.target.classList.contains("contact-info")) {
        const contactItems = entry.target.querySelectorAll(".contact-item");
        contactItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("visible");
          }, index * 200);
        });
      }
    }
  });
}, observerOptions);

// Observe all sections and elements that should animate on scroll
document
  .querySelectorAll(
    ".section, .about-text, .skills-container, .contact-info, .contact-form"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Animate project cards with a delay
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const projectCards = entry.target.querySelectorAll(".project-card");
      projectCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 200);
      });
    }
  });
}, observerOptions);

document.querySelectorAll("#projects").forEach((section) => {
  projectObserver.observe(section);
});

// Form submission
const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simple form validation
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (name && email && subject && message) {
    // In a real application, you would send this data to a server
    alert("Thank you for your message! I will get back to you soon.");
    contactForm.reset();
  } else {
    alert("Please fill in all fields.");
  }
});
