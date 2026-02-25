# Implementation Plan
## Phase 1: Gemini CLI Terminal Action Detection
- [x] Task: Re-implement TerminalMonitor for real-time stream analysis. (1f736b4)
- [x] Task: Create AgentRegistry and GeminiActionMapper. (1f736b4)
- [x] Task: Integrate with PixelQuestViewProvider. (1f736b4)
- [x] Task: Conductor - User Manual Verification 'Gemini CLI Terminal Monitoring' (Protocol in workflow.md)

## Phase 2: Framework for Codex & Claude Code
- [~] Task: Abstract the parsing logic into a plugin-based system.
    - [ ] Decouple `AgentRegistry` from `GeminiMapper`.
    - [ ] Implement `registerMapper` in `AgentRegistry`.
    - [ ] Inject mappers from `extension.ts`.
- [ ] Task: Conductor - User Manual Verification 'Multi-Agent Framework' (Protocol in workflow.md)