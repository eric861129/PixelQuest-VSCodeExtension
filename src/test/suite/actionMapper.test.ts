import * as assert from 'assert';
import { ActionMapper } from '../../ActionMapper';

suite('ActionMapper Test Suite', () => {
	test('Should map SAVE actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('git commit -m "feat: something"'), 'SAVE');
		assert.strictEqual(mapper.mapAction('git push origin main'), 'SAVE');
	});

	test('Should map SHOP actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('npm install lodash'), 'SHOP');
		assert.strictEqual(mapper.mapAction('yarn add react'), 'SHOP');
		assert.strictEqual(mapper.mapAction('pnpm install'), 'SHOP');
	});

	test('Should map TRAIN actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('npm test'), 'TRAIN');
		assert.strictEqual(mapper.mapAction('jest --watch'), 'TRAIN');
		assert.strictEqual(mapper.mapAction('vitest run'), 'TRAIN');
	});

	test('Should map HEAL actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('fix bug in UI'), 'HEAL');
		assert.strictEqual(mapper.mapAction('debug mode enabled'), 'HEAL');
		assert.strictEqual(mapper.mapAction('apply patch'), 'HEAL');
	});

	test('Should map CRAFT actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('refactor code for clarity'), 'CRAFT');
	});

	test('Should return undefined for unknown actions', () => {
		const mapper = new ActionMapper();
		assert.strictEqual(mapper.mapAction('ls -la'), undefined);
		assert.strictEqual(mapper.mapAction('cat README.md'), undefined);
	});
});