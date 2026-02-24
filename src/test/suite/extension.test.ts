import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('eric861129.pixelquest-vscode-extension'));
	});

	test('Should activate extension', async () => {
		const ext = vscode.extensions.getExtension('eric861129.pixelquest-vscode-extension');
		await ext?.activate();
		assert.strictEqual(ext?.isActive, true);
	});
});