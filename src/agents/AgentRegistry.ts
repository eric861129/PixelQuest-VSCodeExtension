import { IAgentMapper, AgentAction } from './types';
import { GeminiMapper } from './GeminiMapper';

export class AgentRegistry {
    private _mappers: IAgentMapper[] = [];
    private _activeMapper: IAgentMapper | undefined;

    constructor() {
        this._mappers.push(new GeminiMapper());
    }

    public process(input: string): AgentAction | undefined {
        // 1. Try to detect a new agent if none is active
        if (!this._activeMapper) {
            for (const mapper of this._mappers) {
                if (mapper.detect(input)) {
                    this._activeMapper = mapper;
                    console.log(`PixelQuest: Detected active agent: ${mapper.agentId}`);
                    break;
                }
            }
        }

        // 2. Map action if an agent is active
        if (this._activeMapper) {
            const action = this._activeMapper.mapAction(input);
            
            // Optional: detect agent switch if needed
            
            return action;
        }

        return undefined;
    }

    public reset() {
        this._activeMapper = undefined;
    }
}