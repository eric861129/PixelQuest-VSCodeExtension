import { IAgentMapper, AgentAction } from './types';

export class ClaudeCodeMapper implements IAgentMapper {
    public readonly agentId = 'claude-code';

    public detect(input: string): boolean {
        // Detect Claude Code specific start or identity
        return /claude\s+code/i.test(input) || /call:default_api:(write_file|grep_search|replace)/i.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        // Claude Code output often contains tool call names directly
        if (/write_file|replace/i.test(input)) {
            return { state: 'WORKING', statusText: 'Claude: Editing file...', logText: 'Executing write_file' };
        }
        if (/grep_search/i.test(input)) {
            return { state: 'WORKING', statusText: 'Claude: Searching...', logText: 'Executing grep_search' };
        }
        if (/read_file/i.test(input)) {
            return { state: 'WORKING', statusText: 'Claude: Reading...', logText: 'Executing read_file' };
        }
        
        // Success / Done
        if (/task_complete/i.test(input)) {
            return { state: 'SUCCESS', statusText: 'Claude Finished!', logText: 'Task completed' };
        }

        return undefined;
    }
}