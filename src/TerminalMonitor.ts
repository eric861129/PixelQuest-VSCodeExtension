import * as vscode from 'vscode';

export class TerminalMonitor {
	
	private _onDidWriteTerminalDataDisposable?: vscode.Disposable;
	private _buffer: string = '';

	constructor() {}

	public start(callback: (data: string) => void) {
		this._onDidWriteTerminalDataDisposable = (vscode.window as any).onDidWriteTerminalData((e: any) => {
			this.handleRawData(e.data, callback);
		});
	}

	public handleRawData(data: string, callback: (data: string) => void) {
		this._buffer += data;

		// Check if the data contains a newline character (indicates command execution or output block)
		if (data.includes('\r') || data.includes('\n')) {
			const cleanData = this.stripAnsi(this._buffer);
			if (cleanData.trim().length > 0) {
				callback(cleanData);
			}
			this._buffer = ''; // Clear buffer after sending
		}
	}

	public stop() {
		this._onDidWriteTerminalDataDisposable?.dispose();
		this._buffer = '';
	}

	public stripAnsi(input: string): string {
		// ANSI escape sequence regex
		// eslint-disable-next-line no-control-regex
		const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
		return input.replace(ansiRegex, '');
	}
}