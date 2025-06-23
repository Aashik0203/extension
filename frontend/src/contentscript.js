// On initial load: check JWT and show sidebar
chrome.storage.local.get("jwt", ({ jwt }) => {
  if (jwt) showSidebar();
});

// Handle popup messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_SIDEBAR") {
    showSidebar();
  } else if (msg.type === "LOGOUT" ) {
    chrome.storage.local.remove("jwt", removeSidebar);
  }
});

// Inject the sidebar iframe
function showSidebar() {
  if (document.getElementById("my-extension-sidebar")) return;

  const iframe = document.createElement("iframe");
  iframe.id = "my-extension-sidebar";
  iframe.name = "my-extension-sidebar";
  iframe.src = chrome.runtime.getURL("sidebar/sidebar.html");

  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "300px",
    height: "100vh",
    border: "none",
    zIndex: "999999",
    transition: "transform 0.3s ease",
    transform: "translateX(0)"
  });

  document.body.appendChild(iframe);
}


// Collapse or remove the sidebar
function removeSidebar() {
  document.getElementById("my-extension-sidebar").remove();
}


// Listen for iframe postMessages
window.addEventListener("message", (event) => {
  if (event.source !== window.frames["my-extension-sidebar"]) return;

  const iframe = document.getElementById("my-extension-sidebar");
  if (!iframe) return;

  if (event.data === "COLLAPSE_SIDEBAR") {
    iframe.style.transform = "translateX(260px)";
  }

  if (event.data === "EXPAND_SIDEBAR") {
    iframe.style.transform = "translateX(0)";
  }

  if (event.data === "LOGOUT_FROM_SIDEBAR") {
    chrome.storage.local.remove("jwt", removeSidebar);
  }
});




// Inject floating button
const dashboardBtn = document.createElement("div");
dashboardBtn.id = "dashboard-btn";
dashboardBtn.innerHTML = "📚";
document.body.appendChild(dashboardBtn);

// Inject dashboard container
const dashboardContainer = document.createElement("div");
dashboardContainer.id = "dashboard-container";
dashboardContainer.classList.add("hidden");
dashboardContainer.innerHTML = `
  <div id="dashboard-header">
    <h3>🧠 Saved Knowledge</h3>
    <button id="close-dashboard">✖</button>
  </div>
  <div id="dashboard-content">
    <p>Loading snippets...</p>
  </div>
`;
document.body.appendChild(dashboardContainer);

// Show/hide toggle
dashboardBtn.addEventListener("click", () => {
  dashboardContainer.classList.toggle("hidden");
});

// Close button
dashboardContainer.querySelector("#close-dashboard").addEventListener("click", () => {
  dashboardContainer.classList.add("hidden");
});

// Simulated fetch (replace with real API call)
const dummySnippets = [
  { code: "console.log('Hello World')", purpose: "Basic logging", tech: "JS" },
  { code: "useState()", purpose: "React state hook", tech: "React" }
];

// Render logic
function renderSnippets(snippets) {
  const container = dashboardContainer.querySelector("#dashboard-content");
  container.innerHTML = "";
  if (snippets.length === 0) {
    container.innerHTML = "<p>No snippets yet.</p>";
    return;
  }
  snippets.forEach(({ code, purpose, tech }) => {
    const snippetDiv = document.createElement("div");
    snippetDiv.className = "snippet-card";
    snippetDiv.innerHTML = `
      <pre><code>${code}</code></pre>
      <p><strong>Purpose:</strong> ${purpose}</p>
      <p><strong>Technology:</strong> ${tech}</p>
    `;
    container.appendChild(snippetDiv);
  });
}

// Initial render (simulate)
renderSnippets(dummySnippets);
