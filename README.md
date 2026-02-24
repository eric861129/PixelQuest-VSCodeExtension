# PixelQuest (VS Code Extension)

PixelQuest is a VS Code extension that transforms your terminal activities into pixel-art RPG battle scenes. It listens to your development commands (e.g., `npm install`, `git commit`) and synchronizes them with corresponding game actions in the sidebar.

## 🎯 Core Features
- **Terminal Monitoring**: Real-time detection and filtering of terminal output data.
- **Action Mapping**: Transform development behaviors (Save, Shop, Train, etc.) into RPG states.
- **Pixel Canvas (PoC)**: Instant visual feedback of your current dev status in a Webview.

## 🚀 Testing Guide (Developer Mode)
Since this extension utilizes Proposed APIs, please follow these steps for testing:

1. Ensure Node.js is installed.
2. Run `npm install`.
3. Press `F5` in VS Code to launch the Extension Development Host.
4. Open the **PixelQuest** icon in the sidebar of the new window.
5. Execute `npm install` or `git commit` in the terminal to observe the changes.

## 🌐 Internationalization
This project defaults to an English UI and supports Traditional Chinese (繁體中文). You can adjust your language preferences in VS Code settings.

---
*Driven by GeminiCLI.*