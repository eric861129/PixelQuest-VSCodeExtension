export type AgentState = 'IDLE' | 'THINKING' | 'WORKING' | 'WAITING' | 'SUCCESS';

export class LogParser {
    
    public parseNewLogs(content: string): AgentState | undefined {
        // Simple heuristic parsing for PoC
        // In reality, content might be a partial JSON array or multiple lines
        
        if (content.includes('"type": "user"')) {
            return 'THINKING'; // User just sent something, agent is thinking
        }

        if (content.includes('write_file') || content.includes('grep_search') || content.includes('replace')) {
            return 'WORKING'; // Agent is using tools
        }

        if (content.includes('task_complete') || content.includes('Exit Code: 0')) {
            return 'SUCCESS';
        }

        return undefined;
    }

    public stripAnsi(input: string): string {
        // eslint-disable-next-line no-control-regex
        const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        return input.replace(ansiRegex, '');
    }
}