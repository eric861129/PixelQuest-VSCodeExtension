import * as vscode from 'vscode';
import { getStrings } from './i18n';

export class PixelQuestViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'pixelquest.view';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'action':
					{
						vscode.window.showInformationMessage('PixelQuest Action: ' + data.value);
						break;
					}
			}
		});
	}

	public updateAction(state: string, statusText: string, logText: string) {
		if (this._view) {
			const strings = getStrings();
			this._view.show?.(true); // target the webview and make it visible
			this._view.webview.postMessage({ 
				type: 'updateAction', 
				state, 
				statusText,
				logText,
				prefix: strings.status_prefix
			});
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
		const nonce = this._generateNonce();
		const strings = getStrings();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>PixelQuest Console</title>
			</head>
			<body>
				<div id="game-container">
					<header>
						<h1>PixelQuest</h1>
						<div id="status-bar">${strings.waiting_command}</div>
					</header>
					<main>
						<canvas id="game-canvas"></canvas>
						<section id="activity-log-container">
							<div id="activity-log"></div>
						</section>
					</main>
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	private _generateNonce(): string {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}