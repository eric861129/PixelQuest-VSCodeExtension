import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { TerminalMonitor } from './TerminalMonitor';
import { ActionMapper } from './ActionMapper';
import { getStrings, format } from './i18n';

export function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	console.log(strings.extension_active);

	const actionMapper = new ActionMapper();
	const terminalMonitor = new TerminalMonitor();
	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	terminalMonitor.start((data) => {
		const action = actionMapper.mapAction(data);
		if (action) {
			console.log(format(strings.terminal_detected, action, data));
			// Send to webview
			provider.updateAction(action, data);
		}
	});

	context.subscriptions.push({
		dispose: () => terminalMonitor.stop()
	});

	const disposable = vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
		vscode.window.showInformationMessage(strings.hello_world);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}