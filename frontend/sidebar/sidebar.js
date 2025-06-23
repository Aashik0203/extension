document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const logoutBtn = document.getElementById("logout-btn");

  let isCollapsed = false;

  toggleBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    parent.postMessage(isCollapsed ? "COLLAPSE_SIDEBAR" : "EXPAND_SIDEBAR", "*");
  });

  logoutBtn.addEventListener("click", () => {
    parent.postMessage("LOGOUT_FROM_SIDEBAR", "*");
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toggleKnowledgeBtn = document.getElementById("toggle-knowledge-btn");
  const knowledgeSection = document.getElementById("add-knowledge-section");

  toggleKnowledgeBtn.addEventListener("click", () => {
    knowledgeSection.classList.toggle("hidden");
  });
});
