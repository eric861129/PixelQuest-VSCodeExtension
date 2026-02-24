import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pixelquest-vscode-extension" is now active!');

	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	const disposable = vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from PixelQuest!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}