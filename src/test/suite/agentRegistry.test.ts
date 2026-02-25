import * as assert from 'assert';
import { AgentRegistry } from '../../agents/AgentRegistry';

suite('AgentRegistry Test Suite', () => {
    test('Should detect Gemini and map its actions', () => {
        const registry = new AgentRegistry();
        
        // 1. Detect Gemini
        registry.process('Starting gemini-cli session...');
        
        // 2. Map ReadFile
        const action = registry.process('call:default_api:read_file{"path": "test.ts"}');
        assert.ok(action);
        assert.strictEqual(action.state, 'WORKING');
        assert.strictEqual(action.statusText, 'Reading files...');
    });

    test('Should map SUCCESS state', () => {
        const registry = new AgentRegistry();
        registry.process('gemini-cli');
        
        const action = registry.process('Task complete. Exit Code: 0');
        assert.ok(action);
        assert.strictEqual(action.state, 'SUCCESS');
    });
});