
# 開發參考資料 (PixelQuest Extension)

## 1. VS Code API 核心參考 (關鍵技術實現)

### A. 終端機數據監聽 (Terminal Data Listener)

這是本套件最核心的技術點。我們需要讀取 GeminiCLI 的輸出流。

* **[Extension Terminal API](https://www.google.com/search?q=https://code.visualstudio.com/api/extension-capabilities/extending-workbench%23terminal)**: 了解 VS Code 如何處理終端機。
* **`vscode.window.onDidWriteTerminalData`**: **(重要)** 這是讀取終端機內容的關鍵事件。它允許套件獲取終端機中顯示的所有文字內容（包括 ANSI 轉義序列）。
* *提示：需注意此 API 可能需要 VS Code 較新的版本或在 `package.json` 中宣告相關權限。*



### B. 介面呈現 (Webview API)

用於顯示像素人物與戰鬥畫面。

* **[Webview API Guide](https://code.visualstudio.com/api/extension-guides/webview)**: 學習如何在側邊欄 (Sidebar) 建立 HTML/CSS/JS 的渲染區域。
* **[Webview View Provider](https://www.google.com/search?q=https://code.visualstudio.com/api/references/vscode-api%23WebviewViewProvider)**: 實現將像素畫面永久固定在側邊欄視窗，而非佔用編輯器分頁。

### C. 狀態欄回饋 (StatusBar Item)

用於顯示微型狀態（例如：當前任務類型或簡易血條）。

* **[StatusBarItem API](https://www.google.com/search?q=https://code.visualstudio.com/api/references/vscode-api%23StatusBarItem)**: 提供輕量級的 UI 回饋。

---

## 2. GeminiCLI 整合參考

由於 GeminiCLI 是透過終端機執行，開發者需參考其 CLI 的行為模式：

* **輸出模式識別**：GeminiCLI 在任務執行中通常會有串流 (Streaming) 輸出的特性，這對應到 RPG 中的「持續攻擊」。
* **錯誤碼攔截**：監測 GeminiCLI 的 `Exit Code`。
* `0`: 任務成功 -> 角色勝利動畫。
* `>0`: 任務失敗/中斷 -> 角色敗北動畫。



---

## 3. 像素動畫實作參考 (前端技術)

* **Canvas API**: 在 Webview 內建議使用原生的 HTML5 Canvas 來繪製像素，效能最高。
* **Sprite Sheet 動畫**:
* **原理**：將所有動作（Idle, Attack, Hit）放在一張長圖中，透過 CSS `background-position` 或 Canvas `drawImage` 切換。


* **開源像素資源 (推薦給 AI 尋找素材方向)**：
* [Itch.io Free Asset](https://itch.io/game-assets/free/tag-pixel-art): 許多開源的 RPG 像素腳色素材。
* [OpenGameArt.org](https://opengameart.org/): 搜尋 "RPG Pixel Hero" 或 "Boss Monster"。



---

## 4. 有效開發範例 (Boilerplate)

* **[VS Code Extension Samples](https://github.com/microsoft/vscode-extension-samples)**:
* 搜尋 `webview-view-sample`: 了解如何製作側邊欄工具。
* 搜尋 `terminal-sample`: 了解如何控制與讀取終端機。


* **[Ansi-to-HTML/Text](https://www.npmjs.com/package/ansi-to-json)**: 處理終端機原始數據時，需要過濾掉 ANSI 顏色編碼才能正確識別 `git`, `npm` 等關鍵字。

---

## 5. 開發規範 (給 GeminiCLI 的指令指引)

在將任務交給 GeminiCLI 時，請務必強調以下規範：

1. **語言**：統一使用 **TypeScript** 開發。
2. **架構**：採用 **MVC 模式**。
* **Controller**: 負責監聽終端機數據並過濾關鍵字。
* **Model**: 儲存當前角色狀態 (HP, Level, Action)。
* **View**: Webview 內的渲染邏輯。


3. **效能限制**：Webview 的動畫更新率限制在 30 FPS 即可，像素風格不需要高更新率，以節省開發者的電腦資源。
4. **低耦合**：不要直接修改使用者的終端機環境，僅做「唯讀監聽 (Passive Listening)」。
