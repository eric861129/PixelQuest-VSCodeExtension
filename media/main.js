(function () {
    const vscode = acquireVsCodeApi();

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const statusBar = document.getElementById('status-bar');
    
    // Activity log container (create if not exists or just append to body)
    let logContainer = document.getElementById('activity-log');
    if (!logContainer) {
        logContainer = document.createElement('div');
        logContainer.id = 'activity-log';
        document.body.appendChild(logContainer);
    }

    // Drawing a simple "player" rectangle
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(10, 10, 20, 20); // A small green square for now
    }

    draw();

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'updateStatus':
                statusBar.innerText = message.value;
                break;
            case 'updateAction':
                updateUI(message.action, message.data, message.prefix);
                break;
        }
    });

    function updateUI(action, data, prefix) {
        statusBar.innerHTML = `${prefix || 'Status'}: ${action}`;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `> ${data}`;
        logContainer.prepend(entry);
        
        // Keep only last 5 entries
        while (logContainer.children.length > 5) {
            logContainer.removeChild(logContainer.lastChild);
        }

        // Trigger a simple "flash" effect on canvas for action
        flashCanvas();
    }

    function flashCanvas() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => draw(), 100);
    }

    // Post message to VS Code extension
    vscode.postMessage({ type: 'action', value: 'Ready!' });

}());