// Lightweight client-side handlers.
// IMPORTANT: This example assumes real auth/transactions are handled on the server.
// Do NOT keep real credentials or transaction logic entirely in front-end code.

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const sendForm = document.getElementById("send-form");

  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (sendForm) sendForm.addEventListener("submit", handleSendMoney);
});

function handleLogin(event) {
  event.preventDefault();

  const username = (document.getElementById("username") || {}).value?.trim() || "";
  const password = (document.getElementById("password") || {}).value || "";
  const messageEl = document.getElementById("login-message");

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Show loading message first
  messageEl.style.color = "blue";
  messageEl.textContent = "Checking credentials...";

  // Simulate server delay (e.g., 1.5 seconds)
  setTimeout(() => {
    if (username === "John Williams" && password === "Password123") {
      messageEl.style.color = "green";
      messageEl.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "dashboard.html"; // redirect after a short pause
      }, 1000); // 1 second delay before redirect
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = "Invalid username or password.";
    }
  }, 1500); // 1.5 seconds loading
}


function handleLogout(event) {
  // If you use server-side sessions, call logout endpoint first (optional).
  // Example:
  // await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  window.location.href = "index.html";
}

async function handleSendMoney(event) {
  event.preventDefault();
  const recipientEl = document.getElementById("recipient");
  const amountEl = document.getElementById("amount");

  const recipient = recipientEl?.value?.trim() || "";
  const rawAmount = amountEl?.value?.trim() || "";
  const amount = parseFloat(rawAmount);

  if (!recipient) {
    alert("Please enter a recipient.");
    return;
  }
  if (!rawAmount || Number.isNaN(amount) || !isFinite(amount) || amount <= 0) {
    alert("Please enter a valid positive amount.");
    return;
  }

  // Optional client-side confirmation
  const confirmMsg = `Send $${amount.toFixed(2)} to ${recipient}?`;
  if (!confirm(confirmMsg)) return;

  // POST to server to perform transaction securely
  try {
    const res = await fetch("/api/transactions/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ recipient, amount }),
    });

    if (!res.ok) {
      const error = await res.text();
      alert("Sending failed: " + error);
      return;
    }

    const data = await res.json();
    if (data && data.success) {
      alert(`$${amount.toFixed(2)} sent to ${recipient}!`);
      if (recipientEl) recipientEl.value = "";
      if (amountEl) amountEl.value = "";
    } else {
      alert("Transaction failed: " + (data?.message || "unknown error"));
    }
  } catch (err) {
    console.error("Transaction error:", err);
    alert("An error occurred while sending money.");
  }
}
