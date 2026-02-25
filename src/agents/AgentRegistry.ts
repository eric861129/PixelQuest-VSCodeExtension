import { IAgentMapper, AgentAction } from './types';

export class AgentRegistry {
    private _mappers: IAgentMapper[] = [];
    private _activeMapper: IAgentMapper | undefined;
    private _lastAction: AgentAction | undefined;

    constructor() {}

    public registerMapper(mapper: IAgentMapper) {
        this._mappers.push(mapper);
    }

    private _lastActionTime: number = 0;
    private readonly _throttleMs = 2500; // 2.5 seconds window

    private readonly _categoryPriority: Record<string, number> = {
        'SUCCESS': 100,
        'SYSTEM_CMD': 90,
        'FILE_WRITE': 80,
        'GIT': 70,
        'SHOPPING': 60,
        'WAITING': 50,
        'TESTING': 40,
        'SEARCH': 30,
        'FILE_READ': 20,
        'THINKING': 10,
        'UNKNOWN': 0
    };

    private _idleTimer?: NodeJS.Timeout;
    private readonly _idleTimeoutMs = 12000; // 12 seconds of silence = done

    public process(input: string): AgentAction | undefined {
        // Clear any existing idle timer when we get ANY input
        if (this._idleTimer) {
            clearTimeout(this._idleTimer);
            this._idleTimer = undefined;
        }

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
                const now = Date.now();
                const timeSinceLast = now - this._lastActionTime;

                if (this._isSameAction(this._lastAction, action)) {
                    this._startIdleTimer(); // Still start timer for silence even if it's a same action
                    return undefined;
                }

                if (timeSinceLast < this._throttleMs) {
                    const lastPriority = this._categoryPriority[this._lastAction?.category || 'UNKNOWN'] || 0;
                    const currentPriority = this._categoryPriority[action.category] || 0;
                    if (currentPriority <= lastPriority && action.state !== 'SUCCESS') {
                        this._startIdleTimer();
                        return undefined;
                    }
                }

                this._lastAction = action;
                this._lastActionTime = now;
                
                // If the new action is a final state, clear the timer
                if (action.state !== 'SUCCESS' && action.state !== 'FAILURE') {
                    this._startIdleTimer();
                }

                return action;
            } else {
                // If it's an unrecognized input, we still want to keep the idle timer going
                this._startIdleTimer();
            }
        }

        return undefined;
    }

    /**
     * If the agent is silent for too long after being active, 
     * we assume it finished (Implicit Success).
     */
    private _startIdleTimer() {
        if (!this._activeMapper || !this._lastAction || this._lastAction.state === 'SUCCESS') {
            return;
        }

        this._idleTimer = setTimeout(() => {
            // Soft Success Trigger - This would need a callback to the extension
            // For now, we'll mark it as done internally.
            console.log('PixelQuest: Implicit success detected due to idle timeout.');
            this.reset(); // Stop active monitoring until next detect
        }, this._idleTimeoutMs);
    }

    public reset() {
        if (this._idleTimer) {
            clearTimeout(this._idleTimer);
            this._idleTimer = undefined;
        }
        this._activeMapper = undefined;
        this._lastAction = undefined;
    }
}