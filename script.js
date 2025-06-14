document.addEventListener('DOMContentLoaded', () => {
    // Existing variable declarations (textModeBtn, drawModeBtn, etc.)
    const textModeBtn = document.getElementById('textModeBtn');
    const drawModeBtn = document.getElementById('drawModeBtn');
    const mediaModeBtn = document.getElementById('mediaModeBtn');
    const contentArea = document.getElementById('content-area');

    const noteCanvas = document.getElementById('noteCanvas');
    const ctx = noteCanvas.getContext('2d');

    // New drawing controls
    const colorPicker = document.getElementById('colorPicker');
    const lineWidthPicker = document.getElementById('lineWidthPicker');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const lineWidthLabel = document.querySelector('label[for="lineWidthPicker"]'); // Get the label too

    const drawingControls = [colorPicker, lineWidthPicker, clearCanvasBtn, lineWidthLabel];

    const allModeButtons = [textModeBtn, drawModeBtn, mediaModeBtn];
    let currentMode = 'text';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    let drawColor = colorPicker.value; // Initialize with color picker's default
    let drawLineWidth = lineWidthPicker.value; // Initialize with range slider's default

    function resizeCanvas() {
        let currentImageData = null;
        // Check if canvas has dimensions and potentially content
        if (noteCanvas.width > 0 && noteCanvas.height > 0) {
            try {
                currentImageData = ctx.getImageData(0, 0, noteCanvas.width, noteCanvas.height);
            } catch (e) {
                console.error("Error getting image data during resize:", e);
                // If canvas is tainted (e.g., by cross-origin images), getImageData will fail.
                // Or if it's too large. For now, content might be lost in such cases.
            }
        }

        noteCanvas.width = noteCanvas.offsetWidth;
        noteCanvas.height = noteCanvas.offsetHeight;

        if (currentImageData) {
            ctx.putImageData(currentImageData, 0, 0); // Restore the image data
        }

        // Always reset drawing properties after resize, as context can reset
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawLineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    function setActiveButton(activeBtn) {
        allModeButtons.forEach(btn => btn.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
    }

    function setDrawingControlsVisibility(visible) {
        const displayStyle = visible ? 'inline-block' : 'none';
        drawingControls.forEach(control => {
            if (control) control.style.display = displayStyle;
        });
    }

    function showTextMode() {
        currentMode = 'text';
        setActiveButton(textModeBtn);
        setDrawingControlsVisibility(false);
        noteCanvas.style.display = 'none';
        const placeholder = contentArea.querySelector('p');
        if (placeholder && placeholder.parentElement === contentArea) {
            placeholder.textContent = 'Text Mode is active. Start typing your notes!';
        } else {
             contentArea.innerHTML = '<p>Text Mode is active. Start typing your notes!</p>';
        }
        console.log('Text Mode activated');
    }

    function showDrawingMode() {
        currentMode = 'drawing';
        setActiveButton(drawModeBtn);
        const placeholder = contentArea.querySelector('p');
        if (placeholder && placeholder.parentElement === contentArea) {
            placeholder.remove();
        }

        setDrawingControlsVisibility(true);
        noteCanvas.style.display = 'block';
        resizeCanvas();

        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawLineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        console.log('Drawing Mode activated');
    }

    function showMediaMode() {
        currentMode = 'media';
        setActiveButton(mediaModeBtn);
        setDrawingControlsVisibility(false);
        noteCanvas.style.display = 'none';
        const placeholder = contentArea.querySelector('p');
        if (placeholder && placeholder.parentElement === contentArea) {
            placeholder.textContent = 'Media Mode is active. Drag and drop your media files!';
        } else {
            contentArea.innerHTML = '<p>Media Mode is active. Drag and drop your media files!</p>';
        }
        console.log('Media Mode activated');
    }

    textModeBtn.addEventListener('click', showTextMode);
    drawModeBtn.addEventListener('click', showDrawingMode);
    mediaModeBtn.addEventListener('click', showMediaMode);

    // Event listeners for drawing controls
    colorPicker.addEventListener('input', (e) => {
        drawColor = e.target.value;
        if (currentMode === 'drawing') {
            ctx.strokeStyle = drawColor;
        }
    });

    lineWidthPicker.addEventListener('input', (e) => {
        drawLineWidth = e.target.value;
        if (currentMode === 'drawing') {
            ctx.lineWidth = drawLineWidth;
        }
    });

    clearCanvasBtn.addEventListener('click', () => {
        if (currentMode === 'drawing') {
            ctx.clearRect(0, 0, noteCanvas.width, noteCanvas.height);
            console.log('Canvas cleared');
        }
    });

    noteCanvas.addEventListener('mousedown', (e) => {
        if (currentMode !== 'drawing') return;
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
        // Ensure context is using current color/width for the new path
        ctx.strokeStyle = drawColor; // Apply current color
        ctx.lineWidth = drawLineWidth; // Apply current line width
        // Start a new path for this stroke. This is important if you want each stroke
        // to potentially have different colors/widths.
        // However, for continuous drawing, you might only beginPath() here and not in mousemove.
        // The prompt's logic has beginPath in mousemove, which is fine for freehand drawing.
        // Let's ensure the properties are set before any drawing action.
    });

    noteCanvas.addEventListener('mousemove', (e) => {
        if (currentMode !== 'drawing' || !isDrawing) return;
        ctx.beginPath(); // Start a new path segment for each mousemove "dot" or small line
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke(); // Draw the segment
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    noteCanvas.addEventListener('mouseup', () => {
        if (currentMode !== 'drawing') return;
        isDrawing = false;
        // Optional: ctx.beginPath() here if you want future non-drawing operations
        // (like fill) to not be connected to the last stroke.
    });

    noteCanvas.addEventListener('mouseout', () => {
        if (currentMode !== 'drawing') return;
        isDrawing = false;
        // Optional: ctx.beginPath() here as well
    });

    // Initial setup
    showTextMode();
    console.log('Nexus Notes initialized. Default mode: Text.');

    window.addEventListener('resize', () => {
        if (currentMode === 'drawing') {
            resizeCanvas();
        }
    });
});
