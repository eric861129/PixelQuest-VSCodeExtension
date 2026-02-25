import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { TerminalMonitor } from './TerminalMonitor';
import { AgentRegistry } from './agents/AgentRegistry';
import { GeminiMapper } from './agents/GeminiMapper';
import { ClaudeCodeMapper } from './agents/ClaudeCodeMapper';
import { CodexMapper } from './agents/CodexMapper';
import { getStrings } from './i18n';

export async function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	const outputChannel = vscode.window.createOutputChannel('PixelQuest');
	outputChannel.appendLine('PixelQuest: Initializing Services...');

	// 1. Initialize Registry & Mappers
	const agentRegistry = new AgentRegistry();
	agentRegistry.registerMapper(new GeminiMapper());
	agentRegistry.registerMapper(new ClaudeCodeMapper());
	agentRegistry.registerMapper(new CodexMapper());
	
	// 2. Initialize View Provider
	const provider = new PixelQuestViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider)
	);

	// 3. Initialize Terminal Monitor
	const terminalMonitor = new TerminalMonitor();
	terminalMonitor.start((data) => {
		const action = agentRegistry.process(data);
		if (action) {
			outputChannel.appendLine(`[${action.state}] ${action.statusText}: ${action.logText}`);
			provider.updateAction(action.state, action.statusText, action.logText);
		}
	});

	// Ensure cleanup on deactivation
	context.subscriptions.push(
		outputChannel,
		{ dispose: () => terminalMonitor.stop() }
	);

	// 4. Register Commands
	const commands = [
		vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
			vscode.window.showInformationMessage(strings.hello_world);
		}),
		vscode.commands.registerCommand('pixelquest-vscode-extension.resetAgent', () => {
			agentRegistry.reset();
			vscode.window.showInformationMessage('PixelQuest: Agent detection has been reset.');
		})
	];

	context.subscriptions.push(...commands);
}

export function deactivate() {}