import * as assert from 'assert';
import { LogParser } from '../../LogParser';

suite('LogParser Test Suite', () => {
    test('Should detect THINKING state when user sends message', () => {
        const parser = new LogParser();
        const content = '{"type": "user", "message": "hello"}';
        assert.strictEqual(parser.parseNewLogs(content), 'THINKING');
    });

    test('Should detect WORKING state when tool is called', () => {
        const parser = new LogParser();
        const content = 'call:default_api:write_file{...}';
        assert.strictEqual(parser.parseNewLogs(content), 'WORKING');
    });

    test('Should detect SUCCESS state', () => {
        const parser = new LogParser();
        const content = 'Exit Code: 0';
        assert.strictEqual(parser.parseNewLogs(content), 'SUCCESS');
    });
});