import * as assert from 'assert';
import { TerminalMonitor } from '../../TerminalMonitor';

suite('TerminalMonitor Test Suite', () => {
	test('Should strip ANSI escape sequences', () => {
		const monitor = new TerminalMonitor();
		const input = '\x1b[31mHello\x1b[0m \x1b[1mWorld\x1b[0m';
		const expected = 'Hello World';
		
		const result = monitor.stripAnsi(input);
		assert.strictEqual(result, expected);
	});

	test('Should handle line-based buffering correctly', (done) => {
		const monitor = new TerminalMonitor();
		let callCount = 0;
		const results: string[] = [];

		monitor.start((data) => {
			callCount++;
			results.push(data);
			if (callCount === 2) {
				assert.strictEqual(results[0], 'First Line');
				assert.strictEqual(results[1], 'Second Line');
				done();
			}
		});

		// Simulate partial writes
		monitor.handleRawData('First ', (data) => results.push(data));
		monitor.handleRawData('Line\nSec', (data) => results.push(data));
		monitor.handleRawData('ond Line\n', (data) => results.push(data));
		
		// Note: The callback inside handleRawData in the test is actually the one passed to monitor.start
		// So we check the shared 'results' array.
	});

	test('Should strip various ANSI codes including color and style', () => {
		const monitor = new TerminalMonitor();
		const inputs = [
			{ in: '\u001b[31mRed\u001b[0m', out: 'Red' },
			{ in: '\u001b[4mUnderline\u001b[0m', out: 'Underline' },
			{ in: '\u001b[1mBold\u001b[0m', out: 'Bold' },
			{ in: '\u001b[2JClear Screen', out: 'Clear Screen' },
			{ in: '\u001b[?25hCursor Show', out: 'Cursor Show' }
		];

		for (const item of inputs) {
			assert.strictEqual(monitor.stripAnsi(item.in), item.out);
		}
	});
});