export type RPGAction = 'SAVE' | 'SHOP' | 'TRAIN' | 'HEAL' | 'CRAFT' | 'BOSS_BATTLE' | 'SUCCESS';

export class ActionMapper {
	
	private readonly _mappings: { regex: RegExp, action: RPGAction }[] = [
		{ regex: /git\s+(commit|push)/i, action: 'SAVE' },
		{ regex: /(npm\s+install|yarn\s+add|pnpm\s+install)/i, action: 'SHOP' },
		{ regex: /(npm\s+test|jest|vitest)/i, action: 'TRAIN' },
		{ regex: /(fix|debug|patch)/i, action: 'HEAL' },
		{ regex: /refactor/i, action: 'CRAFT' },
		{ regex: /gemini-cli/i, action: 'BOSS_BATTLE' }, // PoC for long output
		{ regex: /(exit\s+code\s+0|task\s+complete)/i, action: 'SUCCESS' }
	];

	public mapAction(input: string): RPGAction | undefined {
		for (const mapping of this._mappings) {
			if (mapping.regex.test(input)) {
				return mapping.action;
			}
		}
		return undefined;
	}
}