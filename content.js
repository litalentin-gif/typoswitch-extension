(() => {
  console.log("TypoSwitch content.js loaded");

  const enToHe = {
    "q": "/", "w": "'", "e": "ק", "r": "ר", "t": "א", "y": "ט", "u": "ו", "i": "ן", "o": "ם", "p": "פ",
    "[": "]", "]": "[", "\\": "\\",
    "a": "ש", "s": "ד", "d": "ג", "f": "כ", "g": "ע", "h": "י", "j": "ח", "k": "ל", "l": "ך", ";": "ף", "'": ",",
    "z": "ז", "x": "ס", "c": "ב", "v": "ה", "b": "נ", "n": "מ", "m": "צ", ",": "ת", ".": "ץ", "/": "."
  };

  const heToEn = Object.fromEntries(
    Object.entries(enToHe).map(([en, he]) => [he, en])
  );

  function convertChar(ch) {
    const lower = ch.toLowerCase();
    const isUpper = ch !== lower;

    if (enToHe[lower]) return enToHe[lower];
    if (heToEn[ch]) return heToEn[ch];

    const enChar = heToEn[lower];
    if (enChar) return isUpper ? enChar.toUpperCase() : enChar;

    return ch;
  }

  function convertText(text) {
    return [...text].map(convertChar).join("");
  }

  function isTextInput(el) {
    if (!el) return false;

    const tag = el.tagName?.toLowerCase();
    return (
      tag === "textarea" ||
      (tag === "input" &&
        ["text", "search", "email", "url", "tel", "password"].includes(el.type || "text"))
    );
  }

  function replaceSelectedTextInInput(el) {
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start == null || end == null || start === end) return false;

    const value = el.value;
    const selected = value.slice(start, end);
    const converted = convertText(selected);

    el.value = value.slice(0, start) + converted + value.slice(end);
    el.selectionStart = start;
    el.selectionEnd = start + converted.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));

    return true;
  }

  function replaceLastWordInInput(el) {
    const pos = el.selectionStart;
    if (pos == null) return false;

    const value = el.value;
    const before = value.slice(0, pos);
    const after = value.slice(pos);

    const match = before.match(/([^\s]+)$/);
    if (!match) return false;

    const word = match[1];
    const wordStart = pos - word.length;
    const converted = convertText(word);

    el.value = value.slice(0, wordStart) + converted + after;
    el.selectionStart = el.selectionEnd = wordStart + converted.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));

    return true;
  }

  function replaceSelectionInContentEditable() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return false;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return false;

    const converted = convertText(selectedText);
    range.deleteContents();
    range.insertNode(document.createTextNode(converted));
    selection.removeAllRanges();

    return true;
  }

  function replaceLastWordInContentEditable() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    if (!range.collapsed) return false;

    const node = selection.anchorNode;
    const offset = selection.anchorOffset;

    if (!node || node.nodeType !== Node.TEXT_NODE) return false;

    const text = node.nodeValue || "";
    const before = text.slice(0, offset);
    const after = text.slice(offset);

    const match = before.match(/([^\s]+)$/);
    if (!match) return false;

    const word = match[1];
    const wordStart = offset - word.length;
    const converted = convertText(word);

    node.nodeValue = text.slice(0, wordStart) + converted + after;

    const newOffset = wordStart + converted.length;
    const newRange = document.createRange();
    newRange.setStart(node, newOffset);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);
    return true;
  }

  function handleFix() {
    const el = document.activeElement;
    let fixed = false;

    if (isTextInput(el)) {
      fixed = replaceSelectedTextInInput(el) || replaceLastWordInInput(el);
    } else if (el?.isContentEditable) {
      fixed = replaceSelectionInContentEditable() || replaceLastWordInContentEditable();
    }

    if (fixed) {
      chrome.storage.sync.get(["showToast"], (data) => {
        if (data.showToast !== false) {
          showToast("TypoSwitch applied ✨");
        }
      });
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "FIX_LAYOUT") {
      handleFix();
    }
  });
  function showToast(text) {
    const el = document.createElement("div");
    el.textContent = text;

    Object.assign(el.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#222",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "10px",
      fontSize: "13px",
      zIndex: 999999,
      opacity: 0,
      transition: "opacity 0.3s"
    });

    document.body.appendChild(el);

    setTimeout(() => (el.style.opacity = 1), 10);

    setTimeout(() => {
      el.style.opacity = 0;
      setTimeout(() => el.remove(), 300);
    }, 1500);
  }
})();