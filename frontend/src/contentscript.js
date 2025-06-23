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
