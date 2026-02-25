import * as assert from 'assert';
import { TerminalMonitor } from '../../TerminalMonitor';

suite('TerminalMonitor Stream Test Suite', () => {
    test('Should buffer and provide clean data on newline', () => {
        const monitor = new TerminalMonitor();
        let lastOutput = '';
        
        const callback = (data: string) => {
            lastOutput = data;
        };

        monitor.handleRawData('Reading ', callback);
        assert.strictEqual(lastOutput, '', 'Should not trigger without newline');
        
        monitor.handleRawData('file.txt\n', callback);
        assert.strictEqual(lastOutput.trim(), 'Reading file.txt', 'Should trigger on newline');
    });
});