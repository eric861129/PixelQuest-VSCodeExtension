# AI Agent 動作冒險映射表 (Boss Battle Edition)

| AI Agent 動作 | RPG 冒險動作 | 狀態類別 | 視覺表現 (Pixel Art) |
| :--- | :--- | :--- | :--- |
| **npm/yarn install** | **商店補給 (Shopping)** | `SHOPPING` | 勇者在商店挑選藥水/裝備 |
| **WriteFile / Edit** | **攻擊 Boss (Attack)** | `FILE_WRITE` | 隨機觸發近戰砍擊或魔法彈 |
| **ReadFile / ReadMany**| **看穿弱點 (Observe)** | `FILE_READ` | 勇者使用偵測術或翻閱地圖 |
| **Shell Command** | **釋放必殺技 (Skill)** | `SYSTEM_CMD` | 全螢幕特效大招 (如閃電、火球) |
| **Git Commit/Push** | **聖火存檔 (Save)** | `GIT` | 勇者在聖火或噴泉前祈禱存檔 |
| **Thinking...** | **戰術沉思 (Tactics)** | `THINKING` | 角色靜止，出現思考或詠唱特效 |
| **Action Required** | **領主待命 (Wait)** | `WAITING` | 勇者收刀待命，等待玩家下令 |
| **Task Success** | **擊敗 Boss (Victory)** | `SUCCESS` | Boss 消失，勇者擺出勝利姿勢 |
| **Task Failure** | **撤退/敗北 (Defeat)** | `FAILURE` | 勇者單膝跪地或撤退 |

---
*所有動作皆由動作排程器 (Sequencer) 控制，確保每個動作至少展示 1.2 秒。*
