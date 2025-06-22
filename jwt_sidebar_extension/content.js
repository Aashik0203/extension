function injectSidebar() {
  if (document.getElementById("custom-sidebar")) return;

  fetch(chrome.runtime.getURL("sidebar.html"))
    .then((res) => res.text())
    .then((html) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      const sidebar = document.getElementById("custom-sidebar");
      const toggleBtn = document.getElementById("toggleSidebarSize");
      const content = document.getElementById("sidebar-content");
      const logoutBtn = document.getElementById("logoutBtn");

      toggleBtn?.addEventListener("click", () => {
        const isCollapsed = sidebar.style.width === "60px";
        sidebar.style.width = isCollapsed ? "260px" : "60px";
        content.style.display = isCollapsed ? "block" : "none";
        toggleBtn.textContent = isCollapsed ? "⮜" : "⮞";
      });

      logoutBtn?.addEventListener("click", () => {
        chrome.storage.local.remove("jwt", () => {
          sidebar.remove();
        });
      });
    });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_SIDEBAR") {
    injectSidebar();
  }
});

chrome.storage.local.get("jwt", ({ jwt }) => {
  if (jwt) injectSidebar();
});
