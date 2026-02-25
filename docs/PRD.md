# 產品需求文件 (PRD)：PixelQuest VS Code Extension

## 1. 產品概述

**PixelQuest** 是一款開源的 VS Code 擴充功能，旨在將 **AI Agent CLI 工具**（如 Gemini CLI, Codex, Claude Code）的執行過程轉化為一場「像素風格的 RPG 戰鬥」。本套件透過監控終端機輸出流，即時辨識 AI Agent 的具體動作（如編輯檔案、執行指令、思考），並在側邊欄同步呈現對應的遊戲畫面。

## 2. 目標使用者

* 頻繁使用 AI Agent CLI 進行開發、重構或自動化任務的工程師。
* 喜愛像素藝術 (Pixel Art) 與 RPG 遊戲元素的技術愛好者。

## 3. 核心功能需求

### 3.1 多代理監控 (Multi-Agent Monitoring)

*   **智慧識別**：自動偵測當前終端機運行的 AI 工具類型（Gemini, Codex, Claude Code）。
*   **動作捕捉**：精確識別各代理特有的終端機標記（例如 Gemini 的 `✓ WriteFile` 或 `✓ Shell`）。
*   **流式處理**：使用緩衝機制過濾 ANSI 序列，確保在 AI 輸出執行紀錄時才觸發狀態變更，避免輸入過程中的閃爍。

### 3.2 動作映射與視覺化 (Action Mapping)

| 開發任務 | 偵測關鍵字 (例：Gemini) | RPG 遊戲動作 | 視覺表現 |
| :--- | :--- | :--- | :--- |
| **檔案操作** | `✓ WriteFile`, `replace` | **物理攻擊/鍛造** | 角色揮劍或敲擊鐵砧。 |
| **資料讀取** | `✓ ReadFile`, `ReadFolder` | **查閱百科** | 角色翻閱巨大魔法書。 |
| **系統執行** | `✓ Shell`, `command` | **能量蓄力** | 角色周身出現氣流特效。 |
| **思考狀態** | `Thinking...` | **沈思/讀條** | 角色出現思考泡泡。 |
| **任務完成** | `Task complete`, `Exit 0` | **大獲全勝** | Boss 消失，角色 Victory Pose。 |

### 3.3 UI/UX 規範

*   **Webview 側邊欄**：提供文字基礎的 PoC 介面（狀態列 + 活動日誌），未來將升級為 Canvas 像素渲染。
*   **國際化 (I18n)**：預設使用英文 UI 以利全球推廣，並完整支援繁體中文。

---

## 4. 系統架構 (System Architecture)

*   **Terminal Monitor**: 負責監聽 `onDidWriteTerminalData` 並進行數據清洗。
*   **Agent Registry**: 管理不同 AI 代理的識別與解析邏輯。
*   **Log Parser**: 執行具體的關鍵字比對與狀態轉換。
*   **Webview Provider**: 處理與前端介面的訊息傳遞。

---

## 5. 開發階段

1.  **第一階段：核心鏈路 (已完成)**：實作終端機監聽、ANSI 過濾與 Gemini 動作基礎映射。
2.  **第二階段：多代理框架 (進行中)**：抽象化解析邏輯，加入對多種 AI CLI 的擴充支援。
3.  **第三階段：視覺系統**：引入 Sprite Sheets，實現 Canvas 像素動畫。
4.  **第四階段：社群與優化**：開放自定義動作對應，發佈至 Marketplace。

---

## 6. 非功能性需求

*   **效能**：文字解析不應造成終端機延遲，Webview 資源消耗需低於 5% CPU。
*   **穩定性**：需處理跨行輸出的關鍵字匹配，確保狀態切換不遺漏。