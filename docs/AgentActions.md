# GeminiCLI AI Agent 動作列表 (Agent Actions)

本文件詳述了 PixelQuest 如何將 Gemini CLI 的各類開發行為映射至 RPG 遊戲動作，作為視覺化開發的核心參照。

## 1. 監控機制 (Monitoring Mechanism)
PixelQuest 透過即時監控 `.gemini/tmp/` 下的 `logs.json`。當 AI Agent 調用工具時，日誌會記錄 `call:default_api:<tool_name>`，我們會捕捉此事件進行轉換。

## 2. 深度動作映射表 (Detailed Mapping)

| 開發類別 | 偵測關鍵字 (Keywords) | RPG 遊戲動作 | 視覺表現 |
| :--- | :--- | :--- | :--- |
| **Git 操作** | `git commit`, `git push` | **存檔點 (Save Point)** | 角色在營火旁休息或於神像前祈禱，出現 Saving 文字。 |
| **依賴安裝** | `npm install`, `yarn`, `pnpm` | **商店購物 (Shopping)** | 出現 NPC 商人，角色正在購買或裝備道具。 |
| **單元測試** | `npm test`, `jest`, `vitest` | **競技場練習 (Arena)** | 角色與訓練假人對打，跳出大量 Combo 字樣。 |
| **修復錯誤** | `fix`, `debug`, `patch` | **施法解咒 (Dispel)** | 角色施放光屬性魔法，淨化畫面上的負面狀態（Bug）。 |
| **代碼重構** | `refactor` | **裝備鍛造 (Crafting)** | 出現鐵砧，角色揮動鐵鎚敲打，火花四濺。 |
| **檔案編輯** | `write_file`, `replace` | **物理攻擊 (Attack)** | 角色對著代碼塊揮劍或發射能量彈。 |
| **檔案讀取** | `read_file`, `list_directory` | **查閱百科 (Lore)** | 角色打開一本厚重的魔法書，或查閱巨大的世界地圖。 |
| **搜尋探索** | `grep_search`, `investigator` | **偵查路徑 (Scouting)** | 角色拿起望遠鏡或蹲下觀察足跡（搜尋路徑）。 |
| **執行腳本** | `run_shell_command` | **蓄力/吟唱 (Charging)** | 角色周身出現環繞氣流，準備發動大規模技能。 |
| **任務完成** | `task_complete`, `Exit Code: 0` | **大獲全勝 (Victory)** | Boss 倒地，角色擺出 Victory Pose，背景灑下金幣。 |

## 3. 狀態分類邏輯 (State Classification)

### 🟦 思考 (THINKING)
- **語義**：AI 正在處理您的請求，尚未決定要使用哪個工具。
- **視覺**：畫布色調轉為冷色系，角色出現思考泡泡 `...`。

### 🟧 工作中 (WORKING)
- **語義**：AI 正在主動執行工具（如寫檔、搜尋、執行 Shell）。
- **視覺**：畫布色調轉為暖色系或戰鬥場景，根據上述「深度動作映射表」切換具體動畫。

### 🟩 等待中 (WAITING)
- **語義**：AI 完成了一階段工作，正在等待使用者回覆（Human-in-the-loop）。
- **視覺**：角色坐在地上休息，或面向螢幕等待，頭上出現問號 `?`。

### 🟨 成功 (SUCCESS)
- **語義**：指令執行成功或任務圓滿結束。
- **視覺**：結算畫面，顯示獲得的「經驗值」（通常與代碼變更行數成正比）。

## 4. 偵測技術細節
為了避免輸入時的閃爍，系統採用以下邏輯：
1. **Buffer 緩衝**：暫存連續的日誌片段。
2. **Newline 觸發**：僅在日誌中出現換行符或完整的 JSON 對象結尾時，才解析狀態並更新 UI。
3. **ANSI 過濾**：自動剔除 `\u001b` 等終端機顏色代碼，確保關鍵字比對準確。

---
*文件更新日期：2026-02-24*  
*適用版本：PixelQuest v0.0.2 (I18n & Log Refined)*