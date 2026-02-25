import { AgentConfig } from './types';

export const AGENT_CONFIGS: AgentConfig[] = [
    {
        agentId: 'gemini',
        detectionPatterns: ['gemini-cli'],
        rules: [
            {
                pattern: 'git\s+(commit|push|pull|branch|checkout|add)',
                state: 'WORKING',
                category: 'GIT',
                statusTexts: ['Saving at Bonfire...', 'Resting at Fountain...', 'Updating World Map...'],
                logTemplate: 'Save: {{match2}} - Progress secured'
            },
            {
                pattern: '(npm|yarn|pnpm|pip|cargo|brew)\s+(install|add|get)',
                state: 'WORKING',
                category: 'SHOPPING',
                statusTexts: ['Buying Potions...', 'Upgrading Gear...', 'Restocking Supplies...'],
                logTemplate: 'Shop: Acquiring dependencies via {{match1}}'
            },
            {
                pattern: '(WriteFile|Edit|replace|create_or_update_file)',
                state: 'WORKING',
                category: 'FILE_WRITE',
                statusTexts: ['Sword Slash!', 'Magic Missile!', 'Critical Hit!', 'Backstab!'],
                logTemplate: 'Combat: Dealt damage to {{target}}'
            },
            {
                pattern: '(Shell|run_shell_command|command)',
                state: 'WORKING',
                category: 'SYSTEM_CMD',
                statusTexts: ['ULTIMATE RELEASE!', 'Final Heaven!', 'Omnislash!', 'Cataclysm!'],
                logTemplate: 'Special: System Shockwave unleashed'
            },
            {
                pattern: '(ReadManyFiles|ReadFile|read_file|get_file_contents)',
                state: 'WORKING',
                category: 'FILE_READ',
                statusTexts: ['Scanning Weakness...', 'Inspecting Loot...', 'Reading Bestiary...'],
                logTemplate: 'Scan: Analyzing {{match1}} data'
            },
            {
                pattern: '(Action Required|Apply this change)',
                state: 'WAITING',
                category: 'COMMUNICATION',
                statusTexts: ['Awaiting Command...', 'King', s, Decision, ..."],",
                    logTemplate, 'Tactics: Waiting for player direction'],
                logTemplate: ''
            },
            {
                pattern: 'Thinking\.\.\.',
                state: 'THINKING',
                category: 'COMMUNICATION',
                statusTexts: ['Chanting Spells...', 'Meditating...', 'Strategizing...'],
                logTemplate: 'Tactics: Planning next tactical move'
            },
            {
                pattern: '(task_complete|Exit Code: 0)',
                state: 'SUCCESS',
                category: 'UNKNOWN',
                statusTexts: ['BOSS DEFEATED!', 'LEVEL UP!', 'QUEST CLEAR!'],
                logTemplate: 'Victory: The realm is safe'
            }
        ]
    },
    {
        agentId: 'claude-code',
        detectionPatterns: ['claude\s+code', 'call:default_api:'],
        rules: [
            {
                pattern: 'write_file|replace',
                state: 'WORKING',
                category: 'FILE_WRITE',
                statusTexts: ['Claude: Quick Strike!', 'Refining Arcana...'],
                logTemplate: 'Claude Attack: Modifying file'
            },
            {
                pattern: 'grep_search',
                state: 'WORKING',
                category: 'SEARCH',
                statusTexts: ['Claude: Scanning Horizon...', 'Tracking Prey...'],
                logTemplate: 'Claude Search: Investigating patterns'
            },
            {
                pattern: 'task_complete',
                state: 'SUCCESS',
                category: 'UNKNOWN',
                statusTexts: ['CLAUDE TRIUMPH!'],
                logTemplate: 'Victory: Claude finished the mission'
            }
        ]
    }
];
