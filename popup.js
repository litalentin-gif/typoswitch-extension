const fixBtn = document.getElementById("fixBtn");
const statusEl = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");

console.log("fixBtn:", fixBtn);
console.log("statusEl:", statusEl);
console.log("settingsBtn:", settingsBtn);

if (fixBtn) {
  fixBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "POPUP_FIX_LAYOUT" }, (response) => {
      if (statusEl) {
        if (response?.ok) {
          statusEl.textContent = "Done";
        } else {
          statusEl.textContent = "Could not run on this page";
        }
      }
    });
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
}