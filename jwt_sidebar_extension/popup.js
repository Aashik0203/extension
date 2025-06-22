document.addEventListener("DOMContentLoaded", () => {
  const showAuthForms = () => {
    document.getElementById("authForms").style.display = "block";
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loggedInView").style.display = "none";
  };

  const showLoggedInView = () => {
    document.getElementById("authForms").style.display = "none";
    document.getElementById("loggedInView").style.display = "flex";
  };

  chrome.storage.local.get("jwt", ({ jwt }) => {
    if (jwt) showLoggedInView();
    else showAuthForms();
  });

  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const status = document.getElementById("loginStatus");

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      chrome.storage.local.set({ jwt: data.token }, () => {
        showLoggedInView();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_SIDEBAR" });
        });
      });
    } else {
      status.textContent = data.message || "Login failed.";
    }
  });

  document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();
    const status = document.getElementById("registerStatus");

    if (!email || !password || !confirm) {
      status.textContent = "Please fill in all fields.";
      return;
    }

    if (password !== confirm) {
      status.textContent = "Passwords do not match.";
      return;
    }

    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      chrome.storage.local.set({ jwt: data.token }, () => {
        showLoggedInView();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: "SHOW_SIDEBAR" });
        });
      });
    } else {
      status.textContent = data.error || "Registration failed.";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.storage.local.remove("jwt", () => {
      showAuthForms();
    });
  });

  document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
  });

  document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
  });
});
