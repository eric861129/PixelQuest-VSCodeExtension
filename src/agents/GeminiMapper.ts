import { IAgentMapper, AgentAction } from './types';

export class GeminiMapper implements IAgentMapper {
    public readonly agentId = 'gemini';

    public detect(input: string): boolean {
        // Detect gemini-cli start or specific headers
        return /gemini-cli/i.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        // 1. Tool Execution (WORKING)
        if (/write_file|replace/i.test(input)) {
            return { state: 'WORKING', statusText: 'Writing file...', logText: 'Executing write_file' };
        }
        if (/read_file|list_directory/i.test(input)) {
            return { state: 'WORKING', statusText: 'Reading files...', logText: 'Executing read_file' };
        }
        if (/run_shell_command|shell/i.test(input)) {
            return { state: 'WORKING', statusText: 'Running shell...', logText: 'Executing shell' };
        }
        if (/grep_search|codebase_investigator/i.test(input)) {
            return { state: 'WORKING', statusText: 'Searching...', logText: 'Searching codebase' };
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