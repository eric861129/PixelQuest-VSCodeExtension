import * as assert from 'assert';
import { AgentRegistry } from '../../agents/AgentRegistry';

suite('AgentRegistry Test Suite', () => {
    test('Should detect Gemini and map its visual action markers', () => {
        const registry = new AgentRegistry();
        
        // 1. Detect Gemini
        registry.process('Starting gemini-cli session...');
        
        // 2. Map WriteFile visual marker
        const action = registry.process('✓  WriteFile Writing to conductor\\...\\plan.md');
        assert.ok(action);
        assert.strictEqual(action.state, 'WORKING');
        assert.strictEqual(action.statusText, 'Writing file...');
        assert.ok(action.logText.includes('WriteFile'));
    });

    test('Should map Shell visual marker', () => {
        const registry = new AgentRegistry();
        registry.process('gemini-cli');
        
        const action = registry.process('✓  Shell git log -1 --format="%H"');
        assert.ok(action);
        assert.strictEqual(action.statusText, 'Executing shell...');
    });

    test('Should map SUCCESS state', () => {
        const registry = new AgentRegistry();
        registry.process('gemini-cli');
        
        const action = registry.process('Task complete. Exit Code: 0');
        assert.ok(action);
        assert.strictEqual(action.state, 'SUCCESS');
    });
});