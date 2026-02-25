import { IAgentMapper, AgentAction } from './types';

export class CodexMapper implements IAgentMapper {
    public readonly agentId = 'codex';

    public detect(input: string): boolean {
        // Detect Codex specific markers or identity
        return /codex/i.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        // Mocking common Codex patterns
        if (/generating\s+code/i.test(input)) {
            return { state: 'WORKING', statusText: 'Codex: Generating...', logText: 'Writing code' };
        }
        if (/analyzing/i.test(input)) {
            return { state: 'WORKING', statusText: 'Codex: Analyzing...', logText: 'Reviewing code' };
        }
        
        return undefined;
    }
}