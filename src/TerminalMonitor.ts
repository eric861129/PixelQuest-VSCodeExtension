import * as vscode from 'vscode';

export class TerminalMonitor {
	
	private _onDidWriteTerminalDataDisposable?: vscode.Disposable;

	constructor() {}

	public start(callback: (data: string) => void) {
		this._onDidWriteTerminalDataDisposable = vscode.window.onDidWriteTerminalData((e) => {
			const cleanData = this.stripAnsi(e.data);
			if (cleanData.trim().length > 0) {
				callback(cleanData);
			}
		});
	}

	public stop() {
		this._onDidWriteTerminalDataDisposable?.dispose();
	}

	public stripAnsi(input: string): string {
		// ANSI escape sequence regex
		// eslint-disable-next-line no-control-regex
		const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
		return input.replace(ansiRegex, '');
	}
}