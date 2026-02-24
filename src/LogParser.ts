export type AgentState = 'IDLE' | 'THINKING' | 'WORKING' | 'WAITING' | 'SUCCESS';

export interface ParsedLog {
    state: AgentState;
    statusText: string;
    logText: string;
}

export class LogParser {
    
    public parseNewLogs(content: string): ParsedLog | undefined {
        const cleanContent = this.stripAnsi(content);
        
        // 1. Detect active "toolCalls" (WORKING)
        // Look for tool name after the "model" identifier to ensure it's an agent action
        const toolMatch = cleanContent.match(/"name":\s*"([a-z0-9_]+)"/g);
        const hasFunctionResponse = cleanContent.includes('"functionResponse"');

        if (toolMatch) {
            // Get the LAST tool call name in this chunk
            const lastToolRaw = toolMatch[toolMatch.length - 1];
            const nameMatch = lastToolRaw.match(/"name":\s*"([a-z0-9_]+)"/);
            
            if (nameMatch && !hasFunctionResponse) {
                const toolName = nameMatch[1];
                const friendlyName = this._getFriendlyToolName(toolName);
                return {
                    state: 'WORKING',
                    statusText: `${friendlyName}...`,
                    logText: `Agent using ${toolName}`
                };
            }
        }

        // 2. Detect Tool Results / Success
        if (cleanContent.includes('"status": "success"') || cleanContent.includes('Exit Code: 0')) {
            return {
                state: 'SUCCESS',
                statusText: 'Mission Success!',
                logText: 'Action completed'
            };
        }

        // 3. User Input (THINKING)
        if (cleanContent.includes('"type": "user"')) {
            return {
                state: 'THINKING',
                statusText: 'Thinking...',
                logText: 'Analyzing your request'
            };
        }

        return undefined;
    }

    private _getFriendlyToolName(tool: string): string {
        const mapping: Record<string, string> = {
            'write_file': 'Writing file',
            'read_file': 'Reading file',
            'replace': 'Editing file',
            'grep_search': 'Searching',
            'list_directory': 'Listing files',
            'run_shell_command': 'Running shell',
            'codebase_investigator': 'Analyzing code'
        };
        return mapping[tool] || 'Working';
    }

    public stripAnsi(input: string): string {
        // eslint-disable-next-line no-control-regex
        const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        return input.replace(ansiRegex, '');
    }
}