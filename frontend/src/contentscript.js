// Run on page load
checkJWTAndShowSidebar();

// Listen for runtime messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SHOW_SIDEBAR") {
    checkJWTAndShowSidebar();
  } else if (message.type === "HIDE_SIDEBAR") {
    hideSidebar();
  } else if (message.type === "LOGOUT") {
    chrome.storage.local.remove("jwt");
    hideSidebar();
  }
});

function checkJWTAndShowSidebar() {
  chrome.storage.local.get(["jwt"], (result) => {
    if (result.jwt) {
      showSidebar();
    } else {
      hideSidebar();
    }
  });
}

function showSidebar() {
  if (document.getElementById("my-extension-sidebar")) return;

  const iframe = document.createElement("iframe");
  iframe.id = "my-extension-sidebar";
  iframe.src = chrome.runtime.getURL("sidebar/sidebar.html");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "300px",
    height: "100vh",
    border: "none",
    zIndex: "999999",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  });

  document.body.appendChild(iframe);
}

function hideSidebar() {
  document.getElementById("my-extension-sidebar")?.remove();
}
