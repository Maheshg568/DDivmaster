# AI Dev Master - Chrome Extension

Intelligent AI-Powered Developer Assistant for coding, debugging, and code conversion.

## Features

- **AI Chat**: Interact with Gemini AI for coding help.
- **Code Debugger**: Analyze and fix code snippets.
- **Language Translator**: Translate code between different programming languages.
- **Code Scanner**: Scan and explain complex code structures.
- **Speech Integration**: Use voice commands and text-to-speech.

## How to Run (Development)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## How to Build and Install the Chrome Extension

1. **Build the Project**:
   ```bash
   npm run build
   ```
   This will generate a `dist` folder containing the compiled extension.

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Load unpacked**.
   - Select the `dist` folder from your project directory.

3. **Use the Extension**:
   - Click the extension icon in your browser toolbar to open the popup.

## Project Structure

- `src/`: Main application source code.
- `chrome-extension/`: Chrome extension specific files (manifest, popup entry).
- `dist/`: Build output (generated after `npm run build`).

## Technologies Used

- **React**: UI Library.
- **Vite**: Build Tool.
- **Tailwind CSS**: Styling.
- **Gemini AI**: AI Engine.
- **Lucide React**: Icons.
- **Motion**: Animations.
