import { IAgentMapper, AgentAction } from './types';

export class ClaudeCodeMapper implements IAgentMapper {
    public readonly agentId = 'claude-code';

    private static readonly PATTERNS = {
        DETECTION: /claude\s+code/i,
        TOOL_CALL_GENERIC: /call:default_api:(write_file|grep_search|replace|read_file|list_directory)/i,
        WRITE: /write_file|replace/i,
        SEARCH: /grep_search/i,
        READ: /read_file|list_directory/i,
        SUCCESS: /task_complete/i,
    };

    public detect(input: string): boolean {
        return ClaudeCodeMapper.PATTERNS.DETECTION.test(input) || 
               ClaudeCodeMapper.PATTERNS.TOOL_CALL_GENERIC.test(input);
    }

    public mapAction(input: string): AgentAction | undefined {
        if (ClaudeCodeMapper.PATTERNS.WRITE.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Claude: Refining Arcana...', 
                logText: 'Action: write_file/replace' 
            };
        }
        if (ClaudeCodeMapper.PATTERNS.SEARCH.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Claude: Seeking Secrets...', 
                logText: 'Action: grep_search' 
            };
        }
        if (ClaudeCodeMapper.PATTERNS.READ.test(input)) {
            return { 
                state: 'WORKING', 
                statusText: 'Claude: Studying Scrolls...', 
                logText: 'Action: read_file/list_directory' 
            };
        }
        
        if (ClaudeCodeMapper.PATTERNS.SUCCESS.test(input)) {
            return { 
                state: 'SUCCESS', 
                statusText: 'Claude Victory!', 
                logText: 'Mission completed' 
            };
        }

        return undefined;
    }
}