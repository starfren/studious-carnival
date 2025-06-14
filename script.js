document.addEventListener('DOMContentLoaded', () => {
    const textModeBtn = document.getElementById('textModeBtn');
    const drawModeBtn = document.getElementById('drawModeBtn');
    const mediaModeBtn = document.getElementById('mediaModeBtn');
    const contentArea = document.getElementById('content-area'); // Placeholder for future use

    const allModeButtons = [textModeBtn, drawModeBtn, mediaModeBtn];

    function setActiveButton(activeBtn) {
        allModeButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    textModeBtn.addEventListener('click', () => {
        console.log('Text Mode activated');
        setActiveButton(textModeBtn);
        // Future: Show text editing tools and hide others
        contentArea.innerHTML = '<p>Text Mode is active. Start typing your notes!</p>'; // Placeholder
    });

    drawModeBtn.addEventListener('click', () => {
        console.log('Drawing Mode activated');
        setActiveButton(drawModeBtn);
        // Future: Show drawing canvas and tools
        contentArea.innerHTML = '<p>Drawing Mode is active. Get your stylus ready!</p>'; // Placeholder
    });

    mediaModeBtn.addEventListener('click', () => {
        console.log('Media Mode activated');
        setActiveButton(mediaModeBtn);
        // Future: Show media embedding options
        contentArea.innerHTML = '<p>Media Mode is active. Drag and drop your media files!</p>'; // Placeholder
    });

    // Set a default active mode (e.g., Text Mode) on load
    // textModeBtn.click(); // Or simply call setActiveButton if no other action needed on init
    setActiveButton(textModeBtn); // Just set active class, no console log or content change initially
    console.log('Nexus Notes initialized. Default mode: Text (visual only).');
});
