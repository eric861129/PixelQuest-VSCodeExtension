import * as vscode from 'vscode';

export class TerminalMonitor {
	
	private _onDidWriteTerminalDataDisposable?: vscode.Disposable;
	private _buffer: string = '';
	private readonly _maxBufferSize = 8192; // Limit buffer to 8KB

	constructor() {}

	/**
	 * Starts monitoring terminal data. 
	 * Note: Uses proposed API 'onDidWriteTerminalData'.
	 */
	public start(callback: (data: string) => void) {
		const windowApi = vscode.window as any;
		if (typeof windowApi.onDidWriteTerminalData !== 'function') {
			console.warn('PixelQuest: Proposed API "onDidWriteTerminalData" not available.');
			return;
		}

		this._onDidWriteTerminalDataDisposable = windowApi.onDidWriteTerminalData((e: any) => {
			this.handleRawData(e.data, callback);
		});
	}

	public handleRawData(data: string, callback: (data: string) => void) {
		// Ignore very small chunks that are likely single character echoes (typing)
		// but keep \r or \n to ensure line-based processing works.
		if (data.length === 1 && !data.includes('\r') && !data.includes('\n')) {
			return;
		}

		this._buffer += data;

		// Process by lines to ensure complete semantic context
		if (this._buffer.includes('\r') || this._buffer.includes('\n')) {
			const lines = this._buffer.split(/\r?\n/);
			// The last element might be a partial line, keep it in buffer
			this._buffer = lines.pop() || '';

			for (const line of lines) {
				const cleanLine = this.stripAnsi(line).trim();
				if (cleanLine) {
					callback(cleanLine);
				}
			}
		}

		// Fail-safe: flush buffer if it grows too large
		if (this._buffer.length > this._maxBufferSize) {
			const cleanData = this.stripAnsi(this._buffer).trim();
			if (cleanData) {
				callback(cleanData);
			}
			this._buffer = '';
		}
	}

	public stop() {
		this._onDidWriteTerminalDataDisposable?.dispose();
		this._onDidWriteTerminalDataDisposable = undefined;
		this._buffer = '';
	}

	/**
	 * Efficiently strips ANSI escape sequences.
	 * Optimized regex for common terminal control characters.
	 */
	public stripAnsi(input: string): string {
		// Optimized regex for stripping ANSI escape codes
		// eslint-disable-next-line no-control-regex
		return input.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
	}
}