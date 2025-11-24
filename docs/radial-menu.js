// radial-menu.js

// Add CSS styles
const radialMenuCSS = `
.radial-menu-wrapper {
    position: relative;
    display: inline-block;
}

.radial-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1000;
}

.radial-menu.active {
    pointer-events: auto;
}

.radial-btn {
    position: absolute;
    width: 45px;
    height: 45px;
    background: rgba(45, 55, 72, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
}

.radial-menu.active .radial-btn {
    opacity: 1;
    pointer-events: auto;
}

.radial-btn:hover {
    background: rgba(74, 85, 104, 0.95);
    transform: scale(1.15) !important;
}

.radial-btn:nth-child(1) {
    top: -65px;
    left: 50%;
    transform: translateX(-50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(1) {
    transform: translateX(-50%) scale(1);
    transition-delay: 0.05s;
}

.radial-btn:nth-child(2) {
    top: 50%;
    right: -65px;
    transform: translateY(-50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(2) {
    transform: translateY(-50%) scale(1);
    transition-delay: 0.1s;
}

.radial-btn:nth-child(3) {
    bottom: -65px;
    left: 50%;
    transform: translateX(-50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(3) {
    transform: translateX(-50%) scale(1);
    transition-delay: 0.15s;
}

.radial-btn:nth-child(4) {
    top: 50%;
    left: -65px;
    transform: translateY(-50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(4) {
    transform: translateY(-50%) scale(1);
    transition-delay: 0.2s;
}
`;

const style = document.createElement('style');
style.textContent = radialMenuCSS;
document.head.appendChild(style);

// Function to add radial menu
function addRadialMenu(element, menuOptions) {
    if (!element.parentElement.classList.contains('radial-menu-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'radial-menu-wrapper';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }
    
    const wrapper = element.parentElement;
    const menu = document.createElement('div');
    menu.className = 'radial-menu';
    
    menuOptions.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'radial-btn';
        btn.innerHTML = option.icon;
        btn.title = option.label;
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            option.action();
            menu.classList.remove('active');
        };
        menu.appendChild(btn);
    });
    
    wrapper.appendChild(menu);
    
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        document.querySelectorAll('.radial-menu.active').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });
        menu.classList.toggle('active');
    });
}

document.addEventListener('click', () => {
    document.querySelectorAll('.radial-menu.active').forEach(m => {
        m.classList.remove('active');
    });
});

// Wait for page to load
window.addEventListener('DOMContentLoaded', () => {
    
    // Add to ALL your icons/links
    document.querySelectorAll('a').forEach(link => {
        const url = link.href;
        const title = link.textContent.trim() || link.title;
        
        addRadialMenu(link, [
            {
                icon: '📤',
                label: 'Share',
                action: () => {
                    if (navigator.share) {
                        navigator.share({ title: title, url: url });
                    } else {
                        navigator.clipboard.writeText(url);
                        alert('Link copied!');
                    }
                }
            },
            {
                icon: '🔗',
                label: 'Copy Link',
                action: () => {
                    navigator.clipboard.writeText(url);
                    alert('URL copied to clipboard!');
                }
            },
            {
                icon: '📌',
                label: 'Pin',
                action: () => {
                    console.log('Pinned:', title);
                    alert('📌 Pinned: ' + title);
                }
            },
            {
                icon: '🆕',
                label: 'New Tab',
                action: () => {
                    window.open(url, '_blank');
                }
            }
        ]);
    });
    
    console.log('✅ Radial menus added! Right-click any icon to use.');
});