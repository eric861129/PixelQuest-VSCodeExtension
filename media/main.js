(function () {
    const vscode = acquireVsCodeApi();

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const statusBar = document.getElementById('status-bar');

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
        }
    });

    // Post message to VS Code extension
    vscode.postMessage({ type: 'action', value: 'Ready!' });

}());