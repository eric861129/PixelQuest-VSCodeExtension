import { IAgentMapper, AgentAction } from './types';

export class GeminiMapper implements IAgentMapper {
    public readonly agentId = 'gemini';

    private static readonly PATTERNS = {
        DETECTION: /gemini-cli/i,
        TOOL_CALL: /(✓\s+)?(WriteFile|Shell|ReadFile|ReadFolder|list_directory|read_file)/i,
        WRITE_FILE: /(✓\s+)?WriteFile/i,
        SHELL: /(✓\s+)?Shell/i,
        READ_DIR: /(✓\s+)?(ReadFolder|list_directory)/i,
        READ_FILE: /(✓\s+)?(ReadFile|read_file)/i,
        THINKING: /Thinking\.\.\./i,
        SUCCESS: /task_complete|Exit Code: 0/i,
    };

    public detect(input: string): boolean {
        return GeminiMapper.PATTERNS.DETECTION.test(input) || 
               GeminiMapper.PATTERNS.TOOL_CALL.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        // 1. Tool Execution (WORKING)
        
        if (GeminiMapper.PATTERNS.WRITE_FILE.test(input)) {
            const pathMatch = input.match(/(?:Writing to|path:)\s+([^\s,]+)/i);
            const path = pathMatch ? pathMatch[1].split(/[\\/]/).pop() : 'file';
            return { 
                state: 'WORKING', 
                statusText: 'Forging File...', 
                logText: `Action: WriteFile -> ${path}` 
            };
        }

        if (GeminiMapper.PATTERNS.SHELL.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Casting Shell...', 
                logText: 'Action: Shell Command executed' 
            };
        }

        if (GeminiMapper.PATTERNS.READ_DIR.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Scouting Area...', 
                logText: 'Action: List Directory' 
            };
        }

        if (GeminiMapper.PATTERNS.READ_FILE.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Consulting Grimoire...', 
                logText: 'Action: Read File content' 
            };
        }

        // 2. Thinking
        if (GeminiMapper.PATTERNS.THINKING.test(input)) {
            return { 
                state: 'THINKING', 
                statusText: 'Focusing Mana...', 
                logText: 'Gemini is planning next move' 
            };
        }

        // 3. Success
        if (GeminiMapper.PATTERNS.SUCCESS.test(input)) {
            return { 
                state: 'SUCCESS', 
                statusText: 'Victory!', 
                logText: 'Mission accomplished' 
            };
        }

        return undefined;
    }
}