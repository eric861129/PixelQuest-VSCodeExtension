import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { TerminalMonitor } from './TerminalMonitor';
import { ActionMapper } from './ActionMapper';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pixelquest-vscode-extension" is now active!');

	const actionMapper = new ActionMapper();
	const terminalMonitor = new TerminalMonitor();
	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	terminalMonitor.start((data) => {
		const action = actionMapper.mapAction(data);
		if (action) {
			console.log(`Detected RPG Action: ${action} from data: ${data}`);
			// Send to webview
			provider.updateAction(action, data);
		}
	});

	context.subscriptions.push({
		dispose: () => terminalMonitor.stop()
	});

	const disposable = vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from PixelQuest!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}