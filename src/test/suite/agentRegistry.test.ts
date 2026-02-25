import * as assert from 'assert';
import { AgentRegistry } from '../../agents/AgentRegistry';
import { UniversalMapper } from '../../agents/UniversalMapper';
import { AGENT_CONFIGS } from '../../agents/agentConfigs';

suite('AgentRegistry Test Suite', () => {
    function setupRegistry() {
        const registry = new AgentRegistry();
        for (const config of AGENT_CONFIGS) {
            registry.registerMapper(new UniversalMapper(config));
        }
        return registry;
    }

    test('Should detect Gemini and map its battle actions', () => {
        const registry = setupRegistry();
        
        // 1. Detect Gemini
        registry.process('Starting gemini-cli session...');
        
        // 2. Map WriteFile to Attack Category
        const action = registry.process('✓  WriteFile Writing to src/extension.ts');
        assert.ok(action);
        assert.strictEqual(action.state, 'WORKING');
        assert.strictEqual(action.category, 'FILE_WRITE');
        assert.strictEqual(action.metadata?.target, 'extension.ts');
    });

    test('Should map Shell to Ultimate Skill Category', () => {
        const registry = setupRegistry();
        registry.process('gemini-cli');
        
        const action = registry.process('✓  Shell git status');
        assert.ok(action);
        assert.strictEqual(action.category, 'SYSTEM_CMD');
    });

    test('Should map Package Installation to Shopping Category', () => {
        const registry = setupRegistry();
        registry.process('gemini-cli');
        
        const action = registry.process('✓  Shell npm install lodash');
        // Note: Our current regex might favor Shell over npm install if both match. 
        // In the config, npm install is higher priority.
        assert.ok(action);
        assert.strictEqual(action.category, 'SHOPPING');
    });
});