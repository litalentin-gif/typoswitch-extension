# CLAUDE.md - TypoSwitch

## Project Overview
TypoSwitch is a Chrome extension (Manifest V3) that fixes Hebrew/English keyboard layout mistakes in text fields. Users can convert mistyped text via a keyboard shortcut, popup button, or right-click context menu.

## Project Structure
- `manifest.json` — MV3 manifest (permissions, commands, content scripts)
- `background.js` — Service worker handling keyboard commands, popup messages, and context menu
- `content.js` — Content script injected into all pages; handles text conversion logic
- `popup.html/css/js` — Extension popup UI
- `settings.html/js` — Options page for user preferences
- `icons/` — Extension icons (16, 48, 128px) — not yet added to manifest

## Key Concepts
- **Character mapping**: `enToHe` maps English keys to Hebrew characters; `heToEn` is the inverse. Both are defined in `content.js`.
- **Fix trigger**: The `FIX_LAYOUT` message is sent from background.js to content.js. It converts selected text or the last typed word.
- **Input support**: Works with `<input>`, `<textarea>`, and `contentEditable` elements.
- **Keyboard shortcut**: `Ctrl+Shift+Y` (defined in manifest.json `commands`).

## Development
- Load as an unpacked extension in `chrome://extensions/` with Developer mode enabled.
- No build step or dependencies — plain JS, HTML, CSS.
- Settings are stored via `chrome.storage.sync`.

## Known TODOs
- Icons are not yet declared in `manifest.json` (pending final icon designs)
- `autoFix` setting exists in the UI but is not yet implemented
