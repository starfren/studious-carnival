document.addEventListener('DOMContentLoaded', () => {
    // Mode Buttons
    const textModeBtn = document.getElementById('textModeBtn');
    const drawModeBtn = document.getElementById('drawModeBtn');
    const mediaModeBtn = document.getElementById('mediaModeBtn');
    const allModeButtons = [textModeBtn, drawModeBtn, mediaModeBtn];

    // Content Areas
    const contentArea = document.getElementById('content-area'); // Main container
    const noteCanvas = document.getElementById('noteCanvas');
    const ctx = noteCanvas.getContext('2d');
    const textEditor = document.getElementById('textEditor');

    // Drawing Controls
    const colorPicker = document.getElementById('colorPicker'); // For drawing
    const lineWidthPicker = document.getElementById('lineWidthPicker');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const lineWidthLabel = document.querySelector('label[for="lineWidthPicker"]');
    // Ensure all drawing control IDs are correct and elements exist
    const drawingControlsElements = [];
    if (colorPicker) drawingControlsElements.push(colorPicker);
    if (lineWidthPicker) drawingControlsElements.push(lineWidthPicker);
    if (clearCanvasBtn) drawingControlsElements.push(clearCanvasBtn);
    if (lineWidthLabel) drawingControlsElements.push(lineWidthLabel);


    // Text Formatting Controls
    const textToolbarControls = document.getElementById('textToolbarControls'); // The container div
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const fontNameSelect = document.getElementById('fontNameSelect');
    const fontColorPicker = document.getElementById('fontColorPicker'); // For text
    // Note: Individual text controls are not added to an array for show/hide, their container is.

    // State Variables
    let currentMode = '';
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let drawColor = colorPicker ? colorPicker.value : '#000000'; // Default if picker exists
    let drawLineWidth = lineWidthPicker ? lineWidthPicker.value : 2; // Default if picker exists

    // --- Helper Functions ---

    function resizeCanvas() {
        if (!noteCanvas || !ctx) return;
        const currentImageData = ctx.getImageData(0, 0, noteCanvas.width, noteCanvas.height);
        noteCanvas.width = noteCanvas.offsetWidth;
        noteCanvas.height = noteCanvas.offsetHeight;
        ctx.putImageData(currentImageData, 0, 0);

        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawLineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    function setActiveButton(activeBtn) {
        allModeButtons.forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    }

    function setDrawingControlsVisibility(visible) {
        const displayStyle = visible ? 'inline-block' : 'none';
        drawingControlsElements.forEach(control => {
            if (control) control.style.display = displayStyle;
        });
    }

    function setTextFormattingControlsVisibility(visible) {
        if (textToolbarControls) {
            textToolbarControls.style.display = visible ? 'flex' : 'none';
        }
    }

    // --- Mode Switching Functions ---

    function showTextMode() {
        currentMode = 'text';
        if (textModeBtn) setActiveButton(textModeBtn);
        setDrawingControlsVisibility(false);
        setTextFormattingControlsVisibility(true);

        if (noteCanvas) noteCanvas.style.display = 'none';
        if (textEditor) {
            textEditor.style.display = 'block';
            textEditor.contentEditable = 'true';
        }

        // Remove general placeholder from contentArea if it exists
        const placeholder = contentArea.querySelector('p.mode-placeholder');
        if (placeholder) placeholder.remove();

        // Load content from LocalStorage
        if (textEditor) {
            const savedText = localStorage.getItem('nexusTextContent');
            if (savedText) {
                textEditor.innerHTML = savedText;
            } else {
                // Optional: Add some default placeholder text if nothing is saved
                // textEditor.innerHTML = '<p>Start typing your notes here...</p>';
            }
            textEditor.focus(); // Focus after loading content
        }
        console.log('Text Mode activated');
    }

    function showDrawingMode() {
        currentMode = 'drawing';
        if (drawModeBtn) setActiveButton(drawModeBtn);
        setTextFormattingControlsVisibility(false);
        setDrawingControlsVisibility(true);

        if (textEditor) {
            textEditor.style.display = 'none';
            textEditor.contentEditable = 'false';
        }
        if (noteCanvas) noteCanvas.style.display = 'block';

        resizeCanvas();
        if (ctx) {
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = drawLineWidth;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        }
        console.log('Drawing Mode activated');
    }

    function showMediaMode() {
        currentMode = 'media';
        if (mediaModeBtn) setActiveButton(mediaModeBtn);
        setDrawingControlsVisibility(false);
        setTextFormattingControlsVisibility(false);

        if (textEditor) {
            textEditor.style.display = 'none';
            textEditor.contentEditable = 'false';
        }
        if (noteCanvas) noteCanvas.style.display = 'none';

        // Clear contentArea of other mode-specific direct children (like textEditor or canvas)
        // and then add placeholder.
        // A bit safer than just innerHTML if other persistent elements were in contentArea.
        if (contentArea) {
            while (contentArea.firstChild && contentArea.firstChild !== textEditor && contentArea.firstChild !== noteCanvas) {
                 contentArea.removeChild(contentArea.firstChild);
            }
            // Remove textEditor and noteCanvas if they are direct children to ensure clean slate for placeholder
            if (textEditor && textEditor.parentNode === contentArea) textEditor.style.display = 'none';
            if (noteCanvas && noteCanvas.parentNode === contentArea) noteCanvas.style.display = 'none';

            // Add placeholder if not already there
            let placeholder = contentArea.querySelector('p.mode-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('p');
                placeholder.className = 'mode-placeholder';
                // Insert placeholder before textEditor (which is hidden) or as first child
                contentArea.insertBefore(placeholder, textEditor || contentArea.firstChild);
            }
            placeholder.textContent = 'Media Mode is active. Drag and drop your media files!';
        }
        console.log('Media Mode activated');
    }

    // --- Event Listeners ---

    // Mode Buttons
    if (textModeBtn) textModeBtn.addEventListener('click', showTextMode);
    if (drawModeBtn) drawModeBtn.addEventListener('click', showDrawingMode);
    if (mediaModeBtn) mediaModeBtn.addEventListener('click', showMediaMode);

    // Drawing Controls
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            drawColor = e.target.value;
            if (currentMode === 'drawing' && ctx) ctx.strokeStyle = drawColor;
        });
    }
    if (lineWidthPicker) {
        lineWidthPicker.addEventListener('input', (e) => {
            drawLineWidth = e.target.value;
            if (currentMode === 'drawing' && ctx) ctx.lineWidth = drawLineWidth;
        });
    }
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', () => {
            if (currentMode === 'drawing' && ctx) {
                ctx.clearRect(0, 0, noteCanvas.width, noteCanvas.height);
                console.log('Canvas cleared');
            }
        });
    }

    // Text Formatting Controls
    if (boldBtn) boldBtn.addEventListener('click', () => { document.execCommand('bold', false, null); if (textEditor) textEditor.focus(); });
    if (italicBtn) italicBtn.addEventListener('click', () => { document.execCommand('italic', false, null); if (textEditor) textEditor.focus(); });
    if (underlineBtn) underlineBtn.addEventListener('click', () => { document.execCommand('underline', false, null); if (textEditor) textEditor.focus(); });

    if (fontSizeSelect) fontSizeSelect.addEventListener('change', (e) => { document.execCommand('fontSize', false, e.target.value); if (textEditor) textEditor.focus(); });
    if (fontNameSelect) fontNameSelect.addEventListener('change', (e) => { document.execCommand('fontName', false, e.target.value); if (textEditor) textEditor.focus(); });
    if (fontColorPicker) fontColorPicker.addEventListener('input', (e) => { document.execCommand('foreColor', false, e.target.value); if (textEditor) textEditor.focus(); });

    // Event listener for textEditor input to save to LocalStorage
    if (textEditor) {
        textEditor.addEventListener('input', () => {
            localStorage.setItem('nexusTextContent', textEditor.innerHTML);
        });
    }

    // Canvas Drawing Events
    if (noteCanvas) {
        noteCanvas.addEventListener('mousedown', (e) => {
            if (currentMode !== 'drawing' || !ctx) return;
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
            ctx.strokeStyle = drawColor; // Apply current styles for the new path
            ctx.lineWidth = drawLineWidth;
        });
        noteCanvas.addEventListener('mousemove', (e) => {
            if (currentMode !== 'drawing' || !isDrawing || !ctx) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        noteCanvas.addEventListener('mouseup', () => {
            if (currentMode !== 'drawing') return;
            isDrawing = false;
        });
        noteCanvas.addEventListener('mouseout', () => {
            if (currentMode !== 'drawing') return;
            isDrawing = false;
        });
    }

    // --- Initial Setup ---
    showTextMode(); // Initialize in Text Mode
    console.log('Nexus Notes initialized. Default mode: Text.');

    // Window Resize
    window.addEventListener('resize', () => {
        if (currentMode === 'drawing') {
            resizeCanvas();
        }
    });
});
