import { IAgentMapper, AgentAction } from './types';

export class AgentRegistry {
    private _mappers: IAgentMapper[] = [];
    private _activeMapper: IAgentMapper | undefined;
    private _lastAction: AgentAction | undefined;

    constructor() {}

    public registerMapper(mapper: IAgentMapper) {
        this._mappers.push(mapper);
    }

    public process(input: string): AgentAction | undefined {
        if (!this._activeMapper) {
            for (const mapper of this._mappers) {
                if (mapper.detect(input)) {
                    this._activeMapper = mapper;
                    break;
                }
            }
        }

        if (this._activeMapper) {
            const action = this._activeMapper.mapAction(input);
            if (action) {
                // Stabilization Logic: Only update if something meaningful changed
                if (this._isSameAction(this._lastAction, action)) {
                    return undefined; 
                }
                this._lastAction = action;
                return action;
            }
        }

        return undefined;
    }

    private _isSameAction(last: AgentAction | undefined, current: AgentAction): boolean {
        if (!last) { return false; }
        
        // If state or category changed, it's definitely a new action
        if (last.state !== current.state || last.category !== current.category) {
            return false;
        }

        // If it's a file operation or command, check if the target (filename/cmd) is the same
        if (last.metadata?.target !== current.metadata?.target) {
            return false;
        }

        // It's the same continuous state (like Thinking or long-running Shell)
        return true;
    }

    public reset() {
        this._activeMapper = undefined;
        this._lastAction = undefined;
    }
}