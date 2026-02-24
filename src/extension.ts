import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { LogObserver } from './LogObserver';
import { LogParser } from './LogParser';
import { getStrings, format } from './i18n';

export async function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	console.log('PixelQuest: Activating...');
	console.log(strings.extension_active);

	const logParser = new LogParser();
	const logObserver = new LogObserver();
	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	// Strategy: Monitor Gemini CLI Logs associated with the current workspace
	const homeDir = os.homedir();
	const geminiTmpDir = path.join(homeDir, '.gemini', 'tmp');
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

		if (workspaceFolder) {
			console.log(`PixelQuest: Searching for logs associated with ${workspaceFolder}`);
			const latestLog = await logObserver.findLogForWorkspace(geminiTmpDir, workspaceFolder);
			if (latestLog) {
				console.log(`PixelQuest: [MONITORING] -> ${latestLog}`);
				logObserver.start(latestLog, (newContent) => {								const parsed = logParser.parseNewLogs(newContent);
								if (parsed) {
									console.log(`Detected Agent State: ${parsed.state} - ${parsed.statusText}`);
									provider.updateAction(parsed.state, parsed.statusText, parsed.logText);
								}
							});		} else {
			console.warn('Could not find a Gemini CLI logs.json for this workspace.');
		}
	} else {
		console.warn('No workspace folder open. Cannot monitor project-specific logs.');
	}

	context.subscriptions.push({
		dispose: () => logObserver.stop()
	});

	const disposable = vscode.commands.registerCommand('pixelquest-vscode-extension.helloWorld', () => {
		vscode.window.showInformationMessage(strings.hello_world);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}