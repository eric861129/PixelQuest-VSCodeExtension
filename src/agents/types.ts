export type AgentState = 'IDLE' | 'THINKING' | 'WORKING' | 'SUCCESS' | 'FAILURE';

export interface AgentAction {
    state: AgentState;
    statusText: string;
    logText: string;
}

export interface IAgentMapper {
    readonly agentId: string;
    detect(input: string): boolean;
    mapAction(input: string): AgentAction | undefined;
}