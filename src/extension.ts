import * as vscode from 'vscode';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { TerminalMonitor } from './TerminalMonitor';
import { AgentRegistry } from './agents/AgentRegistry';
import { UniversalMapper } from './agents/UniversalMapper';
import { AGENT_CONFIGS } from './agents/agentConfigs';
import { getStrings } from './i18n';

export async function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	const outputChannel = vscode.window.createOutputChannel('PixelQuest');
	outputChannel.appendLine('PixelQuest: Initializing Universal Agent System...');

	// 1. Initialize Registry with Universal Mappers from Config
	const agentRegistry = new AgentRegistry();
	for (const config of AGENT_CONFIGS) {
		agentRegistry.registerMapper(new UniversalMapper(config));
	}
	
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
			outputChannel.appendLine(`[${action.category}] ${action.statusText}: ${action.logText}`);
			provider.updateAction(action);
		}
	});

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
			vscode.window.showInformationMessage('PixelQuest: Universal Agent detection has been reset.');
		})
	];

	context.subscriptions.push(...commands);
}

export function deactivate() {}