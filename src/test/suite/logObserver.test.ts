import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { LogObserver } from '../../LogObserver';

suite('LogObserver Test Suite', () => {
    const testDir = path.join(os.tmpdir(), 'pixelquest-test');
    const logFile = path.join(testDir, 'logs.json');

    setup(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
        fs.writeFileSync(logFile, 'initial content\n');
    });

    teardown(() => {
        if (fs.existsSync(logFile)) {
            fs.unlinkSync(logFile);
        }
    });

    test('Should detect new content added to log file', (done) => {
        const observer = new LogObserver();
        const newContent = 'new log line\n';

        observer.start(logFile, (content) => {
            try {
                assert.strictEqual(content, newContent);
                observer.stop();
                done();
            } catch (err) {
                done(err);
            }
        });

        // Small delay to ensure watcher is ready
        setTimeout(() => {
            fs.appendFileSync(logFile, newContent);
        }, 200);
    });
});