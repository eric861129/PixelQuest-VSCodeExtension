(function () {
    const vscode = acquireVsCodeApi();

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const statusBar = document.getElementById('status-bar');
    
    // Activity log container
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
        ctx.fillRect(10, 10, 20, 20); // A small green square
    }

    draw();

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'updateAction':
                updateUI(message.statusText, message.logText, message.prefix);
                break;
        }
    });

    function updateUI(statusText, logText, prefix) {
        // Update the big status text
        statusBar.innerHTML = `${prefix || 'Status'}: ${statusText}`;
        
        // Update the activity log below
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `> ${logText}`;
        logContainer.prepend(entry);
        
        // Keep only last 5 entries
        while (logContainer.children.length > 5) {
            logContainer.removeChild(logContainer.lastChild);
        }

        flashCanvas();
    }

    function flashCanvas() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => draw(), 100);
    }

    vscode.postMessage({ type: 'action', value: 'Ready!' });

}());