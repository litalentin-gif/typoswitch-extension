const fixBtn = document.getElementById("fixBtn");
const statusEl = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");

if (fixBtn) {
  fixBtn.addEventListener("click", () => {
    statusEl.textContent = "Working...";

    chrome.runtime.sendMessage({ type: "POPUP_FIX_LAYOUT" }, (response) => {
      if (chrome.runtime.lastError) {
        statusEl.textContent = "Could not run on this page";
        return;
      }

      if (response?.ok) {
        statusEl.textContent = "Done ✨";
      } else {
        statusEl.textContent = "Could not run on this page";
      }
    });
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
}