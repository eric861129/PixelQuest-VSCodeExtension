import { IAgentMapper, AgentAction } from './types';

export class GeminiMapper implements IAgentMapper {
    public readonly agentId = 'gemini';

    public detect(input: string): boolean {
        // Detect gemini-cli start, specific headers, or the action checkmarks
        return /gemini-cli/i.test(input) || /✓\s+(WriteFile|Shell|ReadFile|ReadFolder)/.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        // 1. Tool Execution (WORKING) based on visual terminal output
        
        // WriteFile
        if (/(✓\s+)?WriteFile/i.test(input)) {
            const pathMatch = input.match(/Writing to\s+(.*)/i);
            const path = pathMatch ? pathMatch[1].substring(0, 20) : '';
            return { 
                state: 'WORKING', 
                statusText: 'Writing file...', 
                logText: `Action: WriteFile ${path}` 
            };
        }

        // Shell
        if (/(✓\s+)?Shell/i.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Executing shell...', 
                logText: 'Action: Shell Command' 
            };
        }

        // ReadFolder / list_directory
        if (/(✓\s+)?ReadFolder|list_directory/i.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Listing files...', 
                logText: 'Action: ReadFolder' 
            };
        }

        // ReadFile
        if (/(✓\s+)?ReadFile|read_file/i.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Reading file...', 
                logText: 'Action: ReadFile' 
            };
        }

        // 2. Thinking
        if (/Thinking\.\.\./i.test(input)) {
            return { state: 'THINKING', statusText: 'Thinking...', logText: 'Gemini is thinking' };
        }

        // 3. Success
        if (/task_complete|Exit Code: 0/i.test(input)) {
            return { state: 'SUCCESS', statusText: 'Task Accomplished!', logText: 'Gemini finished' };
        }

        return undefined;
    }
}