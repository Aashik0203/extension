const sidebarContainer = document.getElementById("sidebar-container");
const toggleBtn = document.getElementById("toggle-button");
const hoverZone = document.getElementById("hover-zone");
const logoutBtn = document.getElementById("logout-btn");

let isCollapsed = false;
let hoverTimeout;

function updateUI() {
  document.body.classList.toggle("collapsed", isCollapsed);
  toggleBtn.innerText = isCollapsed ? "⇥" : "⇤";
  toggleBtn.title = isCollapsed ? "Expand ⇥" : "Collapse ⇤";
}

// Manual toggle
toggleBtn.addEventListener("click", () => {
  isCollapsed = !isCollapsed;
  updateUI();
});

// Hover to expand
hoverZone.addEventListener("mouseenter", () => {
  clearTimeout(hoverTimeout);
  if (isCollapsed) {
    isCollapsed = false;
    updateUI();
  }
});

// Auto-collapse on mouse leave
sidebarContainer.addEventListener("mouseleave", () => {
  hoverTimeout = setTimeout(() => {
    isCollapsed = true;
    updateUI();
  }, 500);
});

// Logout
logoutBtn?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "LOGOUT" });
  parent.document.getElementById("my-extension-sidebar")?.remove();
});
