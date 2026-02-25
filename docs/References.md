# 開發參考資料 (PixelQuest Extension)

## 1. VS Code API 核心參考

### A. 終端機串流監聽 (Terminal Stream Analysis)
本套件不監控實體日誌檔案，而是直接監聽 VS Code 終端機的輸出流，以達到最高跨平台相容性。

*   **`vscode.window.onDidWriteTerminalData`**: 核心 API，用於獲取終端機中產生的每一位元數據。
*   **ANSI 轉義序列過濾**: 需要使用 Regex (`/[\u001b\u009b].../g`) 剔除顏色與格式代碼，才能獲得純文字進行關鍵字比對。

### B. UI 與 國際化
*   **Webview View Provider**: 用於將像素畫布固定於側邊欄。
*   **Manual I18n**: 專案採用 `getStrings()` 機制實現英文為主、中文為輔的語系切換。

---

## 2. AI Agent CLI 輸出特徵參考

開發者需針對不同 Agent 的終端機輸出特徵進行 Mapper 實作：

*   **Gemini CLI**:
    - 特徵：輸出前綴常帶有 `✓` (勾選符號) 及大駝峰命名工具名。
    - 關鍵詞：`✓ WriteFile`, `✓ Shell`, `✓ ReadFolder`, `Thinking...`。
*   **Claude Code CLI**:
    - 特徵：具有特定的進度條與任務塊。
*   **Codex CLI**:
    - 特徵：輸出風格較為簡潔，注重代碼區塊。

---

## 3. 架構設計規範

1.  **AgentRegistry (註冊表模式)**:
    - 所有新的代理監控邏輯必須繼承 `IAgentMapper` 介面。
    - 透過 `AgentRegistry.process()` 統一派發數據。
2.  **Robust Buffering**:
    - 由於終端機數據常被切割發送，`TerminalMonitor` 必須實作緩衝區，確保關鍵字（如 `WriteFile`）跨封包時仍能被識別。
3.  **Passive Listening**:
    - 堅持唯讀監聽原則，絕不干預使用者的終端機輸入或執行過程。

---

## 4. 像素實作參考
*   **HTML5 Canvas**: 建議所有動畫透過 Canvas 2D API 繪製，以節省 DOM 節點開銷。
*   **Sprite Animation**: 角色狀態切換應與 `AgentState` (IDLE, THINKING, WORKING, SUCCESS) 同步。