const container = document.querySelector('.side-panel-container');
const trigger = document.querySelector('.side-panel-trigger');
const panel = document.querySelector('.side-panel');

document.addEventListener('mousemove', (e) => {
    if (container && container.contains(e.target)) {
        let newTop = e.clientY - 20; 
        
        const panelHeight = panel.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        if (newTop + panelHeight > viewportHeight) {
            newTop = viewportHeight - panelHeight;
        }
        if (newTop < 0) {
            newTop = 0;
        }

        trigger.style.top = `${newTop}px`;
        panel.style.top = `${newTop}px`;
    }
});
