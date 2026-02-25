import { IAgentMapper, AgentAction, AgentConfig, ActionRuleConfig } from './types';

export class UniversalMapper implements IAgentMapper {
    public readonly agentId: string;
    private readonly _config: AgentConfig;
    private readonly _compiledRules: { regex: RegExp, config: ActionRuleConfig }[];
    private readonly _compiledDetection: RegExp[];

    constructor(config: AgentConfig) {
        this.agentId = config.agentId;
        this._config = config;

        // Pre-compile regex for performance
        this._compiledRules = config.rules.map(r => ({
            regex: new RegExp(r.pattern, 'i'),
            config: r
        }));

        this._compiledDetection = config.detectionPatterns.map(p => new RegExp(p, 'i'));
    }

    public detect(input: string): boolean {
        return this._compiledDetection.some(re => re.test(input)) || 
               this._compiledRules.some(r => r.regex.test(input));
    }

    public mapAction(input: string): AgentAction | undefined {
        for (const { regex, config } of this._compiledRules) {
            const match = input.match(regex);
            if (match) {
                const target = this._extractTarget(input);
                return {
                    state: config.state,
                    category: config.category,
                    statusText: this._pick(config.statusTexts),
                    logText: this._fillTemplate(config.logTemplate, match, target),
                    metadata: { target }
                };
            }
        }
        return undefined;
    }

    private _extractTarget(input: string): string | undefined {
        const pathMatch = input.match(/(?:Writing to|path:)\s+([^\s,]+)/i);
        if (pathMatch) {
            return pathMatch[1].split(/[\/]/).pop();
        }
        return undefined;
    }

    private _fillTemplate(template: string, match: RegExpMatchArray, target?: string): string {
        let result = template;
        if (target) {
            result = result.replace('{{target}}', target);
        }
        // Support {{match1}}, {{match2}} etc.
        match.forEach((val, idx) => {
            result = result.replace(`{{match${idx}}}`, val || '');
        });
        return result;
    }

    private _pick(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
