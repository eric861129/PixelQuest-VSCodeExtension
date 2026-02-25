export type AgentState = 'IDLE' | 'THINKING' | 'WORKING' | 'WAITING' | 'SUCCESS' | 'FAILURE';

/**
 * Detailed Action Categories for richer RPG mapping.
 */
export type ActionCategory = 
    | 'FILE_WRITE'   // Forging, Crafting
    | 'FILE_READ'    // Studying, Scouting
    | 'SYSTEM_CMD'   // Casting, Energy
    | 'SEARCH'       // Looking through glass, Tracking
    | 'GIT'          // Banner raising, Traveling
    | 'TESTING'      // Training, Sparring
    | 'SHOPPING'     // Buying potions/equipment (npm install)
    | 'COMMUNICATION' // Talking, Thinking
    | 'UNKNOWN';

export interface ActionRuleConfig {
    pattern: string; // Regex string
    state: AgentState;
    category: ActionCategory;
    statusTexts: string[];
    logTemplate: string; // e.g., "Combat: Damaged {{target}}"
}

export interface AgentConfig {
    agentId: string;
    detectionPatterns: string[];
    rules: ActionRuleConfig[];
}

export interface AgentAction {
    state: AgentState;
    category: ActionCategory;
    statusText: string;
    logText: string;
    metadata?: {
        target?: string;
        detail?: string;
    };
}

export interface IAgentMapper {
    readonly agentId: string;
    detect(input: string): boolean;
    mapAction(input: string): AgentAction | undefined;
}