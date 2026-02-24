import * as assert from 'assert';
import { TerminalMonitor } from '../../TerminalMonitor';

suite('TerminalMonitor Refined Test Suite', () => {
	test('Should buffer data and trigger ONLY on newline', () => {
		const monitor = new TerminalMonitor();
		let lastOutput = '';
		let callCount = 0;
		
		const callback = (data: string) => {
			lastOutput = data;
			callCount++;
		};

		// Simulate typing 'npm' character by character
		monitor.handleRawData('n', callback);
		monitor.handleRawData('p', callback);
		monitor.handleRawData('m', callback);
		
		assert.strictEqual(callCount, 0, 'Should not have triggered yet');

		// Simulate pressing Enter (\r)
		monitor.handleRawData('\r', callback);
		
		assert.strictEqual(callCount, 1, 'Should trigger once on newline');
		assert.strictEqual(lastOutput.trim(), 'npm', 'Should output buffered command');
	});

	test('Should handle ANSI sequences within buffered data', () => {
		const monitor = new TerminalMonitor();
		let lastOutput = '';
		
		const callback = (data: string) => {
			lastOutput = data;
		};

		// \x1b[31m is RED
		monitor.handleRawData('\x1b[31mgit ', callback);
		monitor.handleRawData('status\x1b[0m\n', callback);
		
		assert.strictEqual(lastOutput.trim(), 'git status', 'Should strip ANSI from buffered data');
	});
});