 
        // Google Apps Script Web App URL - REPLACE THIS WITH YOUR URL
        const GOOGLE_SCRIPT_URL =
            "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

        // Notification system
        function showNotification(message, type = "info") {
            const notification = document.getElementById("notification");
            notification.textContent = message;
            notification.className = `notification ${type} show`;

            setTimeout(() => {
                notification.classList.remove("show");
            }, 5000);
        }

        // Create floating elements
        const floatingContainer = document.getElementById("floatingElements");
        for (let i = 0; i < 15; i++) {
            const element = document.createElement("div");
            element.classList.add("floating-element");

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

        logo.addEventListener("click", (e) => {
            e.stopPropagation();
            isInfoPanelOpen = !isInfoPanelOpen;
            infoPanel.classList.toggle("active", isInfoPanelOpen);

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

        // Contact Form Submission
        const contactForm = document.getElementById("contactForm");
        const submitBtn = document.getElementById("submitBtn");

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value,
            };

            // Validate form
            if (
                !formData.name ||
                !formData.email ||
                !formData.subject ||
                !formData.message
            ) {
                showNotification("Please fill in all fields", "error");
                return;
            }

            // Show loading state
            submitBtn.innerHTML = '<span class="loading"></span>Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (result.result === "success") {
                    showNotification(
                        "Message sent successfully! I'll get back to you soon.",
                        "success"
                    );
                    contactForm.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                showNotification(
                    "Failed to send message. Please try again later.",
                    "error"
                );
            } finally {
                // Reset button state
                submitBtn.innerHTML = "Send Message";
                submitBtn.disabled = false;
            }
        });

        // Theme Toggle
        const themeToggle = document.getElementById("themeToggle");
        const themeIcon = themeToggle.querySelector("i");

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

            if (isInfoPanelOpen) {
                infoPanel.classList.remove("active");
                isInfoPanelOpen = false;
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", (e) => {
                // Close mobile menu
                navLinks.classList.remove("active");
                menuToggle.querySelector("i").classList.add("fa-bars");
                menuToggle.querySelector("i").classList.remove("fa-times");

                // Smooth scroll to section
                const href = link.getAttribute("href");
                if (href.startsWith("#")) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Set active navigation link based on scroll position
        const sections = document.querySelectorAll("section");
        const navLinksAll = document.querySelectorAll(".nav-links a");

        window.addEventListener("scroll", () => {
            let current = "";
            const headerHeight = document.querySelector('header').offsetHeight;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollY >= sectionTop - headerHeight - 100) {
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

                    if (entry.target.classList.contains("about-text")) {
                        const paragraphs = entry.target.querySelectorAll("p");
                        paragraphs.forEach((p, index) => {
                            setTimeout(() => {
                                p.classList.add("visible");
                            }, index * 300);
                        });
                    }

                    if (entry.target.classList.contains("skills-container")) {
                        const skillCards = entry.target.querySelectorAll(".skill-card");
                        skillCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add("visible");
                            }, index * 100);
                        });
                    }

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

        document
            .querySelectorAll(
                ".section, .about-text, .skills-container, .contact-info, .contact-form"
            )
            .forEach((el) => {
                observer.observe(el);
            });

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
