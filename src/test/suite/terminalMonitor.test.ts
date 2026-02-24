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

	test('Should strip various ANSI codes', () => {
		const monitor = new TerminalMonitor();
		const inputs = [
			{ in: '\u001b[31mRed\u001b[0m', out: 'Red' },
			{ in: '\u001b[4mUnderline\u001b[0m', out: 'Underline' },
			{ in: '\u001b[1mBold\u001b[0m', out: 'Bold' },
			{ in: '\u001b[2JClear Screen', out: 'Clear Screen' }
		];

		for (const item of inputs) {
			assert.strictEqual(monitor.stripAnsi(item.in), item.out);
		}
	});
});