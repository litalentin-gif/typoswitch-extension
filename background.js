chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "fix-layout") return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    await chrome.tabs.sendMessage(tab.id, { type: "FIX_LAYOUT" });
    console.log("FIX_LAYOUT sent from command");
  } catch (error) {
    console.warn("Could not establish connection to content script:", error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "POPUP_FIX_LAYOUT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ ok: false });
        return;
      }

      try {
        await chrome.tabs.sendMessage(tab.id, { type: "FIX_LAYOUT" });
        sendResponse({ ok: true });
      } catch (error) {
        console.warn("Popup could not send message to content script:", error);
        sendResponse({ ok: false, error: String(error) });
      }
    });

    return true;
  }
});