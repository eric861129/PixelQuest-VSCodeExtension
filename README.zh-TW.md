# PixelQuest (VS Code 擴充功能)

PixelQuest 是一個將 VS Code 終端機活動轉化為像素風格 RPG 戰鬥畫面的擴充功能。它能即時監聽您的開發指令（如 `npm install`, `git commit` 等），並在側邊欄同步呈現對應的遊戲動作。

## 🎯 核心功能
- **終端機監控**：自動偵測並過濾終端機輸出數據。
- **動作映射**：將開發行為（存檔、購物、訓練等）轉換為 RPG 狀態。
- **像素畫布 (PoC)**：在 Webview 中即時反饋當前開發狀態。

## 🚀 測試指南 (開發者模式)
由於此套件使用提案 API (Proposed API)，請依照以下步驟進行測試：

1. 確保已安裝 Node.js。
2. 執行 `npm install`。
3. 在 VS Code 中按下 `F5` 啟動擴充功能開發主機。
4. 在新視窗中開啟側邊欄的 **PixelQuest** 圖示。
5. 在終端機執行 `npm install` 或 `git commit` 觀察變化。

## 🌐 國際化
本專案預設使用英文 UI，並支援繁體中文。您可以在 VS Code 設定中調整偏好語系。

---
*本專案由 GeminiCLI 指令驅動開發。*