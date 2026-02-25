# AI Agent 動作映射規範 (Agent Actions Mapping)

本文件定義了 PixelQuest 如何將 AI Agent 的技術操作轉化為 RPG 冒險世界中的視覺動作。

## 1. 核心映射邏輯 (Core Mapping)

| 分類 (Category) | RPG 冒險行為 | 技術標記 (Examples) | 視覺關鍵字 |
| :--- | :--- | :--- | :--- |
| **FILE_WRITE** | **攻擊 Boss (Attack)** | `WriteFile`, `Edit` | 揮劍、施放打擊、數字飄出 |
| **FILE_READ** | **觀察弱點 (Observe)** | `ReadFile`, `get_file` | 掃描特效、偵測數據 |
| **SEARCH** | **追蹤足跡 (Track)** | `grep_search`, `list_dir` | 尋找目標、追蹤線索 |
| **SYSTEM_CMD** | **必殺技 (Skill)** | `Shell`, `command` | 畫面震動、強力特效 |
| **GIT** | **存檔點 (Save Point)** | `git push`, `commit` | 水晶發光、進度保存 |
| **TESTING** | **防禦加固 (Shield)** | `npm test`, `check` | 護盾出現、格擋效果 |
| **COMMUNICATION**| **戰術擬定 (Tactics)** | `Thinking...`, `Prompt` | 思考動畫、等待指令 |
| **SUCCESS** | **擊敗 Boss (Victory)** | `task_complete` | Boss 消失、掉落獎勵 |

## 2. 狀態機流程 (State Machine)

1. **IDLE**: 角色在原點呼吸，等待事件。
2. **WORKING**: 根據 `ActionCategory` 播放循環動畫 (Loop Animation)。
3. **THINKING**: 播放思考動畫。
4. **WAITING**: 角色靜止並看向使用者。
5. **SUCCESS/FAILURE**: 播放結算動畫後回到 IDLE。

## 3. 擴展指南 (Extending)

若要新增動作，請遵循以下步驟：
1. 在 `src/agents/types.ts` 的 `ActionCategory` 加入新類別。
2. 在 `GeminiMapper.ts` (或其他 Mapper) 中定義正則表達式識別該動作。
3. 在 Webview 的繪圖邏輯中為該類別分配 `Sprite` 或顏色。

---
*Last Updated: 2026-02-25*
