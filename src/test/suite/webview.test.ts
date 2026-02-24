import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Webview Test Suite', () => {
	test('Webview view should be active and present', async () => {
		const ext = vscode.extensions.getExtension('eric861129.pixelquest-vscode-extension');
		await ext?.activate();
		assert.ok(ext?.isActive, "Extension should be active");
		
		// Verify activation event registered the view container
		// We can't directly check the registration of the provider, but we expect activation to succeed.
	});
});