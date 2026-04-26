/**
 * PETAL RUSH — Mobile Patch v7
 * ─────────────────────────────────────────────────────────────
 * Add this <script> block at the BOTTOM of every HTML panel
 * (admin.html, buyer.html, seller.html, delivery.html)
 * just before the closing </body> tag.
 *
 * This gives you:
 *  ✅ Sidebar slide-in / slide-out on mobile
 *  ✅ Overlay tap-to-close
 *  ✅ Table auto-wrap (prevents horizontal overflow)
 *  ✅ Active bottom-nav highlight
 *  ✅ Back-gesture / Escape key closes sidebar
 * ─────────────────────────────────────────────────────────────
 */

/* ══════════════════════════════════════════════════
   COPY EVERYTHING BELOW into a <script> tag in each HTML file
══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Sidebar toggle ── */
  const sidebar  = document.querySelector(".sidebar");
  const overlay  = document.querySelector(".sidebar-overlay");
  const hamBtn   = document.querySelector(".topbar-ham");

  function openSidebar() {
    sidebar?.classList.add("open");
    overlay?.classList.add("visible");
    document.body.style.overflow = "hidden"; // prevent background scroll
  }

  function closeSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  }

  hamBtn?.addEventListener("click", openSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  // Close sidebar when a nav-item is tapped on mobile
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* ── Auto-wrap tables that don't have .table-wrap ── */
  document.querySelectorAll(".data-table").forEach((table) => {
    if (!table.closest(".table-wrap")) {
      const wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    }
  });

  /* ── Bottom nav active state ── */
  // Reads data-page attribute from .bn-item buttons and syncs with active page
  const updateBottomNav = () => {
    const activePage = document.querySelector(".page.active")?.id;
    document.querySelectorAll(".bn-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === activePage);
    });
  };

  // Call once on load
  updateBottomNav();

  // Re-call whenever a page switches (observe DOM changes)
  const obs = new MutationObserver(updateBottomNav);
  document.querySelectorAll(".page").forEach((p) =>
    obs.observe(p, { attributes: true, attributeFilter: ["class"] })
  );

  /* ── Resize: auto-close sidebar on desktop ── */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeSidebar();
  });

})();


