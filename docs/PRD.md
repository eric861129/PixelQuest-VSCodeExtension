# 產品需求文件 (PRD)：PixelQuest VS Code Extension

## 1. 產品目標
**PixelQuest** 將枯燥的開發等待轉化為一場「像素風格的 RPG 冒險」。當開發者使用 AI Agent (如 Gemini CLI) 進行任務時，套件會將技術動作轉化為勇者攻略 Boss 的冒險歷程。

## 2. 核心冒險流程
1. **任務啟動**：AI Agent 啟動，勇者進入戰場。
2. **冒險中途**：
   - **攻擊 (Attack)**：AI 編輯或寫入檔案，對應勇者的近戰或魔法攻擊。
   - **觀察 (Observe)**：AI 讀取檔案，對應勇者分析 Boss 弱點。
   - **補給 (Shop)**：AI 安裝套件 (`npm install`)，對應勇者在商店購買藥水或升級裝備。
   - **存檔 (Save)**：AI 執行 `git commit/push`，對應勇者在聖火點保存進度。
   - **大招 (Skill)**：AI 執行系統指令，對應勇者釋放全螢幕必殺技。
3. **最終結果**：AI 任務完成，Boss 被擊敗，勇者獲得勝利並升級。

## 3. 技術架構
- **Terminal Monitor**: 攔截並清洗數據，移除打字雜訊。
- **Universal Mapper**: 讀取中央配置檔，將文字映射為冒險動作。
- **Action Sequencer**: 前端排程器，確保動作流暢，不閃爍。
- **Pixel Canvas**: 基於 HTML5 Canvas 的像素渲染引擎。
