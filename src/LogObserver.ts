import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class LogObserver {
    private _currentLogPath: string | undefined;
    private _fileWatcher: fs.FSWatcher | undefined;
    private _lastSize: number = 0;

    constructor() {}

    public async findLogForWorkspace(baseDir: string, workspacePath: string): Promise<string | undefined> {
        if (!fs.existsSync(baseDir)) { return undefined; }

        try {
            const subdirs = fs.readdirSync(baseDir).filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());
            
            for (const subdir of subdirs) {
                const dirPath = path.join(baseDir, subdir);
                const projectRootPath = path.join(dirPath, '.project_root');
                
                if (fs.existsSync(projectRootPath)) {
                    const recordedPath = fs.readFileSync(projectRootPath, 'utf8').trim();
                    if (recordedPath.toLowerCase() === workspacePath.toLowerCase()) {
                        const chatsDir = path.join(dirPath, 'chats');
                        if (fs.existsSync(chatsDir)) {
                            const sessions = fs.readdirSync(chatsDir)
                                .filter(f => f.startsWith('session-') && f.endsWith('.json'))
                                .map(f => ({
                                    name: f,
                                    mtime: fs.statSync(path.join(chatsDir, f)).mtimeMs
                                }))
                                .sort((a, b) => b.mtime - a.mtime);

                            if (sessions.length > 0) {
                                return path.join(chatsDir, sessions[0].name);
                            }
                        }
                        
                        const logPath = path.join(dirPath, 'logs.json');
                        if (fs.existsSync(logPath)) {
                            return logPath;
                        }
                    }
                }
            }
            return undefined;
        } catch (e) {
            console.error('Error finding workspace log:', e);
            return undefined;
        }
    }

    public start(logPath: string, callback: (newContent: string) => void) {
        this._currentLogPath = logPath;
        if (!fs.existsSync(logPath)) {
            return;
        }

        console.log(`PixelQuest: LogObserver starting on ${logPath}`);
        this._lastSize = fs.statSync(logPath).size;

        // Use a more frequent/robust check for Windows
        this._fileWatcher = fs.watch(logPath, (event) => {
            console.log(`PixelQuest: Watch event: ${event}`);
            this._onFileChanged(callback);
        });
    }

    private _onFileChanged(callback: (newContent: string) => void) {
        if (!this._currentLogPath) { return; }

        try {
            const stats = fs.statSync(this._currentLogPath);
            const newSize = stats.size;

            console.log(`PixelQuest: File changed. Size: ${this._lastSize} -> ${newSize}`);

            // For JSON session files, they are often rewritten. 
            // We'll read the last 4000 characters to be safe.
            const readSize = Math.min(newSize, 4000);
            const startPos = Math.max(0, newSize - readSize);

            const buffer = Buffer.alloc(readSize);
            const fd = fs.openSync(this._currentLogPath, 'r');
            fs.readSync(fd, buffer, 0, readSize, startPos);
            fs.closeSync(fd);

            const newContent = buffer.toString('utf8');
            callback(newContent);
            
            this._lastSize = newSize;
        } catch (e) {
            console.error('PixelQuest: Error reading log file change:', e);
        }
    }

    public stop() {
        this._fileWatcher?.close();
    }
}