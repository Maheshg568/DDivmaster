# Div Master Chrome Extension

## Installation Instructions

1. **Build the Project**: Run `npm run build` in the root directory.
2. **Open Chrome Extensions**: Go to `chrome://extensions/` in your browser.
3. **Enable Developer Mode**: Toggle the switch in the top right corner.
4. **Load Unpacked**: Click "Load unpacked" and select the **`dist`** folder from the root of this project.

**CRITICAL**: 
- Do NOT load the `chrome-extension` folder.
- Do NOT load the `public` folder.
- You MUST load the **`dist`** folder. 

The `manifest.json` is automatically placed in the `dist` folder during the build process. If you don't see a `dist` folder, make sure you have run `npm run build` successfully.
