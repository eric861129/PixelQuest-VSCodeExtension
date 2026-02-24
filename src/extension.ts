import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { PixelQuestViewProvider } from './PixelQuestViewProvider';
import { LogObserver } from './LogObserver';
import { LogParser } from './LogParser';
import { getStrings, format } from './i18n';

export async function activate(context: vscode.ExtensionContext) {
	const strings = getStrings();
	console.log(strings.extension_active);

	const logParser = new LogParser();
	const logObserver = new LogObserver();
	const provider = new PixelQuestViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PixelQuestViewProvider.viewType, provider));

	// Strategy: Monitor Gemini CLI Logs instead of Terminal Data
	const homeDir = os.homedir();
	const geminiTmpDir = path.join(homeDir, '.gemini', 'tmp');
	
	const latestLog = await logObserver.findLatestLog(geminiTmpDir);
	if (latestLog) {
		console.log(`Monitoring Gemini Log: ${latestLog}`);
		logObserver.start(latestLog, (newContent) => {
			const state = logParser.parseNewLogs(newContent);
			if (state) {
				console.log(`Detected Agent State: ${state}`);
				provider.updateAction(state, logParser.stripAnsi(newContent));
			}
		});
	} else {
		console.warn('Could not find any Gemini CLI logs.json to monitor.');
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