import { IAgentMapper, AgentAction } from './types';

export class AgentRegistry {
    private _mappers: IAgentMapper[] = [];
    private _activeMapper: IAgentMapper | undefined;

    constructor() {}

    /**
     * Registers a new agent mapper into the registry.
     */
    public registerMapper(mapper: IAgentMapper) {
        this._mappers.push(mapper);
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
            return this._activeMapper.mapAction(input);
        }

        return undefined;
    }

    public reset() {
        this._activeMapper = undefined;
    }
}