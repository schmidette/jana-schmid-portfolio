document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".js-email-link").forEach((link) => {
    const address = `${link.dataset.user}@${link.dataset.domain}`;
    link.href = `mailto:${address}`;
    link.textContent = address;
  });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const galleryImages = Array.from(
    document.querySelectorAll(".case-figure-img, .case-gallery img")
  );

  if (galleryImages.length) {
    initLightbox(galleryImages);
  }
});

function initLightbox(images) {
  let current = 0;
  let triggerEl = null;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Bildansicht");
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Schliessen">&times;</button>
    <button class="lightbox-prev" aria-label="Vorheriges Bild">&#8592;</button>
    <img class="lightbox-image" src="" alt="" />
    <button class="lightbox-next" aria-label="Nächstes Bild">&#8594;</button>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox-image");
  const closeBtn = overlay.querySelector(".lightbox-close");
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");
  const focusable = [prevBtn, nextBtn, closeBtn];

  function show(index) {
    current = (index + images.length) % images.length;
    imgEl.src = images[current].currentSrc || images[current].src;
    imgEl.alt = images[current].alt || "";
  }

  function open(index, trigger) {
    triggerEl = trigger;
    show(index);
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (triggerEl) triggerEl.focus();
  }

  images.forEach((img, index) => {
    img.classList.add("is-zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.addEventListener("click", () => open(index, img));
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(index, img);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);

    if (event.key === "Tab") {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
