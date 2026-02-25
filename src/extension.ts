import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { TerminalMonitor } from './TerminalMonitor';
import { AgentRegistry } from './agents/AgentRegistry';
import { getStrings } from './i18n';

export async function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	console.log('PixelQuest: Activating Multi-Agent Terminal Monitor...');

	const agentRegistry = new AgentRegistry();
	const terminalMonitor = new TerminalMonitor();
	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	// Strategy: Monitor ALL terminal streams for AI Agent keywords
	terminalMonitor.start((data) => {
		const action = agentRegistry.process(data);
		if (action) {
			console.log(`PixelQuest: Action -> ${action.state} (${action.statusText})`);
			provider.updateAction(action.state, action.statusText, action.logText);
		}
	});

	context.subscriptions.push({
		dispose: () => terminalMonitor.stop()
	});

	const helloCmd = vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
		vscode.window.showInformationMessage(strings.hello_world);
	});

	const resetCmd = vscode.commands.registerCommand('pixelquest-vscode-extension.resetAgent', () => {
		agentRegistry.reset();
		vscode.window.showInformationMessage('PixelQuest: Agent detection reset.');
	});

	context.subscriptions.push(helloCmd, resetCmd);
}

export function deactivate() {}