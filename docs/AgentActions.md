# AI Agent 動作列表 (Agent Actions)

本文件詳述了 PixelQuest 如何將不同 AI Agent CLI 工具的終端機輸出映射至 RPG 遊戲動作。

## 1. 監控機制 (Monitoring Mechanism)
PixelQuest 透過監聽 `onDidWriteTerminalData` 獲取終端機串流。系統會自動識別當前活躍的 Agent，並依據其特有的輸出格式（如 Gemini 的勾選符號）進行狀態切換。

## 2. 核心狀態分類 (Agent States)

| 狀態 (State) | 語義 | 視覺表現 |
| :--- | :--- | :--- |
| **THINKING** | AI 正在思考或生成內容。 | 角色出現思考泡泡，畫布色調冷冽。 |
| **WORKING** | AI 正在執行具體工具或指令。 | 角色進入戰鬥/工作姿態，畫布產生動作特效。 |
| **SUCCESS** | AI 完成了當前任務。 | 角色 Victory Pose，顯示結算獎勵。 |
| **WAITING** | AI 正在等待使用者回覆。 | 角色休息或頭上出現問號。 |

## 3. Gemini CLI 特定映射 (Gemini Focus)

| 終端機標記 (Visual Marker) | 對應動作 | 遊戲行為描述 |
| :--- | :--- | :--- |
| `✓ WriteFile` | **Writing file** | 角色對著鐵砧或代碼塊進行強力打擊。 |
| `✓ Shell` | **Executing shell** | 角色進行魔法蓄力或準備大招。 |
| `✓ ReadFolder` / `✓ ReadFile` | **Reading** | 角色打開巨大地圖或翻閱百科卷軸。 |
| `Thinking...` | **Thinking** | 角色進入沈思狀態，頭上讀條。 |
| `Task complete` | **Success** | 任務圓滿達成，Boss 消失。 |

## 4. 未來擴充計畫 (Extended Agents)

### A. Codex CLI
- 預計捕捉：代碼块生成標記、檔案清單列出等行為。

### B. Claude Code CLI
- 預計捕捉：`write_file`, `grep_search` 等 JSONL 格式風格的終端機輸出。

## 5. 處理邏輯
1.  **Buffer Flush**: 當偵測到 `\r` 或 `\n` 時，將緩衝內容送入 Mapper 解析。
2.  **Visual Sync**: 每一行動作偵測成功後，Webview 畫布將觸發閃爍效果以示同步。

---
*最後更新：2026-02-25*  
*版本：v0.0.3 (Multi-Agent Support)*