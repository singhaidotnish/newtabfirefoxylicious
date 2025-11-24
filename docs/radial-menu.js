// ============================================
// STEP 1: Add this CSS to your stylesheet
// ============================================

const radialMenuCSS = `
/* Radial Menu Styles */
.radial-menu-wrapper {
    position: relative;
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
    transform: scale(1.15);
}

/* Position buttons in circle - 4 positions */
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

// Add CSS to page
const style = document.createElement('style');
style.textContent = radialMenuCSS;
document.head.appendChild(style);


// ============================================
// STEP 2: JavaScript to add radial menus
// ============================================

function addRadialMenu(element, menuOptions) {
    // Wrap element if not already wrapped
    if (!element.parentElement.classList.contains('radial-menu-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'radial-menu-wrapper';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }
    
    const wrapper = element.parentElement;
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'radial-menu';
    
    // Add buttons
    menuOptions.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'radial-btn';
        btn.innerHTML = option.icon;
        btn.title = option.label;
        btn.onclick = (e) => {
            e.stopPropagation();
            option.action();
            menu.classList.remove('active');
        };
        menu.appendChild(btn);
    });
    
    wrapper.appendChild(menu);
    
    // Toggle menu on right-click
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Close other menus
        document.querySelectorAll('.radial-menu.active').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });
        
        menu.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
}


// ============================================
// STEP 3: Use it on your icons
// ============================================

// Example: Add to ALL links on your page
document.querySelectorAll('a').forEach(link => {
    const url = link.href;
    const title = link.textContent || link.title;
    
    addRadialMenu(link, [
        {
            icon: '📤',
            label: 'Share',
            action: () => {
                navigator.clipboard.writeText(url);
                alert('Link copied!');
            }
        },
        {
            icon: '🔗',
            label: 'Copy Link',
            action: () => {
                navigator.clipboard.writeText(url);
                alert('URL copied!');
            }
        },
        {
            icon: '📌',
            label: 'Pin',
            action: () => {
                console.log('Pinned:', title);
                alert('Pinned: ' + title);
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


// ============================================
// OR: Add to specific icons only
// ============================================

// Example: Add only to GitHub link
const githubLink = document.querySelector('a[href*="github"]');
if (githubLink) {
    addRadialMenu(githubLink, [
        {
            icon: '⭐',
            label: 'Star',
            action: () => alert('Star on GitHub!')
        },
        {
            icon: '🔱',
            label: 'Fork',
            action: () => alert('Fork repo!')
        },
        {
            icon: '📤',
            label: 'Share',
            action: () => {
                navigator.clipboard.writeText(githubLink.href);
                alert('GitHub link copied!');
            }
        },
        {
            icon: '🆕',
            label: 'New Tab',
            action: () => window.open(githubLink.href, '_blank')
        }
    ]);
}

// Example: Add to multiple specific sites
const sitesToEnhance = {
    'chatgpt': ['💬', '📋', '🔄', '⭐'],
    'claude': ['🤖', '📋', '🔗', '⭐'],
    'youtube': ['▶️', '💾', '📤', '🔖']
};

Object.keys(sitesToEnhance).forEach(site => {
    const link = document.querySelector(`a[href*="${site}"]`);
    if (link) {
        addRadialMenu(link, [
            { icon: '📤', label: 'Share', action: () => alert('Share ' + site) },
            { icon: '📌', label: 'Pin', action: () => alert('Pinned ' + site) },
            { icon: '🔗', label: 'Copy', action: () => navigator.clipboard.writeText(link.href) },
            { icon: '🆕', label: 'New Tab', action: () => window.open(link.href, '_blank') }
        ]);
    }
});