const fixBtn = document.getElementById("fixBtn");
const statusEl = document.getElementById("status");
const settingsBtn = document.getElementById("settingsBtn");

fixBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "POPUP_FIX_LAYOUT" }, (response) => {
    if (response?.ok) {
      statusEl.textContent = "Done";
    } else {
      statusEl.textContent = "Could not run on this page";
    }
  });
});

settingsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});