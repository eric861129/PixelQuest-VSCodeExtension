import { AgentConfig } from './types';

export const AGENT_CONFIGS: AgentConfig[] = [
    {
        agentId: 'gemini',
        detectionPatterns: ['gemini-cli'],
        rules: [
            {
                // git commit/push -> Saving
                pattern: '✓\\\\s+git\\\\s+(commit|push|pull|branch|checkout|add)',
                state: 'WORKING',
                category: 'GIT',
                statusTexts: ['Saving at Bonfire...', 'Resting at Sanctuary...', 'Writing Chronicle...'],
                logTemplate: 'Save Point: Progress secured via Git {{match1}}'
            },
            {
                // npm install -> Shopping
                pattern: '✓?\\\\s?(npm|yarn|pnpm|pip|cargo|brew)\\\\s+(install|add|get|update)',
                state: 'WORKING',
                category: 'SHOPPING',
                statusTexts: ['Buying Healing Potions...', 'Upgrading Excalibur...', 'Restocking Supplies...', 'Hiring Mercenaries...'],
                logTemplate: 'Shop: Acquiring {{match1}} packages for the journey'
            },
            {
                // File operations -> Attacking
                pattern: '(✓\\\\s+)?(WriteFile|Edit|replace|create_or_update_file)',
                state: 'WORKING',
                category: 'FILE_WRITE',
                statusTexts: ['Sword Slash!', 'Magic Missile!', 'Critical Hit!', 'Backstab!'],
                logTemplate: 'Combat: Dealt damage to {{target}}'
            },
            {
                // Shell -> Ultimate Skill
                pattern: '✓\\\\s+(Shell|run_shell_command|command)',
                state: 'WORKING',
                category: 'SYSTEM_CMD',
                statusTexts: ['ULTIMATE RELEASE!', 'Final Heaven!', 'Omnislash!', 'Cataclysm!'],
                logTemplate: 'Special: System Shockwave unleashed'
            },
            {
                // Read -> Observing
                pattern: '(✓\\\\s+)?(ReadManyFiles|ReadFile|read_file|get_file_contents)',
                state: 'WORKING',
                category: 'FILE_READ',
                statusTexts: ['Scanning Weakness...', 'Inspecting Loot...', 'Reading Bestiary...'],
                logTemplate: 'Scan: Analyzing {{match2}} data'
            },
            {
                // Investigation -> Tracking
                pattern: '(✓\\\\s+)?(grep_search|search_code|list_directory|ReadFolder)',
                state: 'WORKING',
                category: 'SEARCH',
                statusTexts: ['Hunting Tracks...', 'Following Scent...', 'Scanning Horizons...'],
                logTemplate: 'Track: Seeking target via {{match2}}'
            },
            {
                // Interactive prompts -> Waiting
                pattern: '(Action Required|Apply this change\\\\?|●\\\\s+\\\\d+\\\\.)',
                state: 'WAITING',
                category: 'COMMUNICATION',
                statusTexts: ['Awaiting Orders...', "King's Decision..."],
                logTemplate: 'Tactics: Waiting for player direction'
            },
            {
                // AI generating -> Thinking
                pattern: 'Thinking\\\\.\\\\.\\\\.',
                state: 'THINKING',
                category: 'COMMUNICATION',
                statusTexts: ['Chanting Spells...', 'Meditating...', 'Strategizing...'],
                logTemplate: 'Tactics: Planning next tactical move'
            },
            {
                // Task Complete or Summary -> Success
                // Including common AI ending phrases for conversational agents
                pattern: '(task_complete|Exit Code: 0|Summary of changes|Files changed:|Done in \\\\d+ms|✨\\\\s+Done|I have finished|Let me know if you need|Happy coding|Hope this helps|Is there anything else)',
                state: 'SUCCESS',
                category: 'UNKNOWN',
                statusTexts: ['BOSS DEFEATED!', 'LEVEL UP!', 'QUEST CLEAR!'],
                logTemplate: 'Victory: The realm is safe'
            },
            {
                // Shell Prompt Detection -> Implicit Success
                // Matches standard Windows/Unix prompts appearing after agent activity
                pattern: '^([a-zA-Z]:\\\\\\\\.*>|\\\\$|\\\\%|\\\\>|➜\\\\s+.*\\\\s+)',
                state: 'SUCCESS',
                category: 'UNKNOWN',
                statusTexts: ['Boss Escaped...', 'Mission Concluded.', 'Peace Restored.'],
                logTemplate: 'Victory: Agent returned the realm to the player'
            }
        ]
    }
];
