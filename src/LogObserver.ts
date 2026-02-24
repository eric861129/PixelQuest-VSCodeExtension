import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'path';

export class LogObserver {
    private _currentLogPath: string | undefined;
    private _fileWatcher: fs.FSWatcher | undefined;
    private _lastSize: number = 0;

    constructor() {}

    public async findLatestLog(baseDir: string): Promise<string | undefined> {
        if (!fs.existsSync(baseDir)) { return undefined; }

        try {
            const subdirs = fs.readdirSync(baseDir).filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());
            let latestFile: string | undefined;
            let latestMtime = 0;

            for (const subdir of subdirs) {
                const logPath = path.join(baseDir, subdir, 'logs.json');
                if (fs.existsSync(logPath)) {
                    const mtime = fs.statSync(logPath).mtimeMs;
                    if (mtime > latestMtime) {
                        latestMtime = mtime;
                        latestFile = logPath;
                    }
                }
            }
            return latestFile;
        } catch (e) {
            console.error('Error finding latest log:', e);
            return undefined;
        }
    }

    public start(logPath: string, callback: (newContent: string) => void) {
        this._currentLogPath = logPath;
        if (!fs.existsSync(logPath)) {
            return;
        }

        this._lastSize = fs.statSync(logPath).size;

        this._fileWatcher = fs.watch(logPath, (event) => {
            if (event === 'change') {
                this._onFileChanged(callback);
            }
        });
    }

    private _onFileChanged(callback: (newContent: string) => void) {
        if (!this._currentLogPath) { return; }

        const stats = fs.statSync(this._currentLogPath);
        const newSize = stats.size;

        if (newSize > this._lastSize) {
            const stream = fs.createReadStream(this._currentLogPath, {
                start: this._lastSize,
                end: newSize
            });

            let newChunks = '';
            stream.on('data', (chunk) => {
                newChunks += chunk.toString();
            });

            stream.on('end', () => {
                callback(newChunks);
                this._lastSize = newSize;
            });
        }
    }

    public stop() {
        this._fileWatcher?.close();
    }
}