(function () {
    const vscode = acquireVsCodeApi();

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const statusBar = document.getElementById('status-bar');
    const logContainer = document.getElementById('activity-log');
    
    // --- Constants & State ---
    const MIN_ACTION_DURATION = 1200; // ms
    let actionQueue = [];
    let isProcessing = false;
    let currentCategory = 'IDLE';

    // --- Core Loop ---
    async function processQueue() {
        if (actionQueue.length === 0) {
            isProcessing = false;
            return;
        }

        isProcessing = true;
        const nextAction = actionQueue.shift();
        
        // Execute the action visual update
        await performAction(nextAction);
        
        // Continue to next action
        processQueue();
    }

    async function performAction(data) {
        const { statusText, logText, prefix, category } = data;
        currentCategory = category;

        // 1. Visual Feedback: Fade out old text
        statusBar.classList.add('status-fade');
        
        await new Promise(r => setTimeout(r, 300));

        // 2. Update Content
        const label = prefix || 'Status';
        statusBar.textContent = `${label}: ${statusText}`;
        statusBar.classList.remove('status-fade');
        
        addLogEntry(logText);
        
        // 3. Trigger Canvas Feedback
        const highImpactCategories = ['FILE_WRITE', 'SYSTEM_CMD', 'SUCCESS', 'GIT'];
        if (highImpactCategories.includes(category)) {
            flashCanvas();
        }

        // 4. Force a minimum stay duration so player can see the action
        await new Promise(r => setTimeout(r, MIN_ACTION_DURATION));
    }

    function addLogEntry(text) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${text}`;
        
        if (logContainer.firstChild) {
            logContainer.insertBefore(entry, logContainer.firstChild);
        } else {
            logContainer.appendChild(entry);
        }
        
        while (logContainer.children.length > 15) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    // --- Graphics ---
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Placeholder for sprite
        ctx.fillStyle = getCategoryColor(currentCategory);
        ctx.fillRect(118, 118, 20, 20); 
    }

    function getCategoryColor(cat) {
        switch(cat) {
            case 'FILE_WRITE': return '#ff0000'; // Attack Red
            case 'SYSTEM_CMD': return '#aa00ff'; // Skill Purple
            case 'GIT': return '#00ffff';        // Save Cyan
            case 'THINKING': return '#555555';   // Thinking Gray
            default: return '#00ff00';           // Idle Green
        }
    }

    function flashCanvas() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => draw(), 100);
    }

    setInterval(draw, 100); // Basic render loop

    // --- Message Handling ---
    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'updateAction') {
            // Push new action to queue instead of immediate update
            actionQueue.push(message);
            if (!isProcessing) {
                processQueue();
            }
        }
    });

    vscode.postMessage({ type: 'action', value: 'Ready!' });
}());
