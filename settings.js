const autoFix = document.getElementById("autoFix");
const showToast = document.getElementById("showToast");
const saveBtn = document.getElementById("saveBtn");

chrome.storage.sync.get(["autoFix", "showToast"], (data) => {
  autoFix.checked = data.autoFix || false;
  showToast.checked = data.showToast !== false;
});

saveBtn.addEventListener("click", () => {
  chrome.storage.sync.set({
    autoFix: autoFix.checked,
    showToast: showToast.checked
  }, () => {
    alert("Saved!");
  });
});