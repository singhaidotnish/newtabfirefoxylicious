// radial-menu.js - Fixed for tile structure

console.log('🔄 Radial menu script loading...');

// Add CSS styles
const radialMenuCSS = `
.tile {
    position: relative !important;
}

.radial-menu {
    position: fixed !important;
    pointer-events: none;
    z-index: 9999 !important;
}

.radial-menu.active {
    pointer-events: auto;
}

.radial-btn {
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(45, 55, 72, 0.95);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
    cursor: pointer;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
}

.radial-menu.active .radial-btn {
    opacity: 1;
    pointer-events: auto;
}

.radial-btn:hover {
    background: rgba(74, 85, 104, 0.95);
    transform: scale(1.2) !important;
    border-color: rgba(255, 255, 255, 0.5);
}

/* 4 button positions around center */
.radial-btn:nth-child(1) {
    transform: translate(-50%, -80px) scale(0);
}

.radial-menu.active .radial-btn:nth-child(1) {
    transform: translate(-50%, -80px) scale(1);
    transition-delay: 0.05s;
}

.radial-btn:nth-child(2) {
    transform: translate(80px, -50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(2) {
    transform: translate(80px, -50%) scale(1);
    transition-delay: 0.1s;
}

.radial-btn:nth-child(3) {
    transform: translate(-50%, 80px) scale(0);
}

.radial-menu.active .radial-btn:nth-child(3) {
    transform: translate(-50%, 80px) scale(1);
    transition-delay: 0.15s;
}

.radial-btn:nth-child(4) {
    transform: translate(-80px, -50%) scale(0);
}

.radial-menu.active .radial-btn:nth-child(4) {
    transform: translate(-80px, -50%) scale(1);
    transition-delay: 0.2s;
}
`;

const style = document.createElement('style');
style.textContent = radialMenuCSS;
document.head.appendChild(style);

// Function to add radial menu to a tile
function addRadialMenuToTile(tile, link, title, url) {
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'radial-menu';
    
    const menuOptions = [
        {
            icon: '📤',
            label: 'Share',
            action: () => {
                if (navigator.share) {
                    navigator.share({ title: title, url: url }).catch(() => {
                        navigator.clipboard.writeText(url);
                        alert('✅ Link copied!');
                    });
                } else {
                    navigator.clipboard.writeText(url);
                    alert('✅ Link copied to clipboard!');
                }
            }
        },
        {
            icon: '🔗',
            label: 'Copy URL',
            action: () => {
                navigator.clipboard.writeText(url);
                alert('✅ URL copied!');
            }
        },
        {
            icon: '📌',
            label: 'Pin',
            action: () => {
                alert('📌 Pinned: ' + title);
                console.log('Pinned:', title, url);
            }
        },
        {
            icon: '🆕',
            label: 'New Tab',
            action: () => {
                window.open(url, '_blank');
            }
        }
    ];
    
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
    
    document.body.appendChild(menu);
    
    // Show menu on right-click on the ENTIRE tile
    tile.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Close other menus
        document.querySelectorAll('.radial-menu.active').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });
        
        // Position menu at tile center
        const rect = tile.getBoundingClientRect();
        menu.style.left = (rect.left + rect.width / 2) + 'px';
        menu.style.top = (rect.top + rect.height / 2) + 'px';
        
        // Show menu
        menu.classList.add('active');
    });
    
    return menu;
}

// Close all menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.radial-menu') && !e.target.closest('.radial-btn')) {
        document.querySelectorAll('.radial-menu.active').forEach(m => {
            m.classList.remove('active');
        });
    }
});

// Initialize radial menus
function initRadialMenus() {
    console.log('🎯 Initializing radial menus...');
    
    // Find all tiles
    const tiles = document.querySelectorAll('.tile');
    console.log(`📊 Found ${tiles.length} tiles`);
    
    if (tiles.length === 0) {
        console.warn('⚠️ No tiles found! Waiting for content...');
        return;
    }
    
    tiles.forEach((tile, index) => {
        const link = tile.querySelector('a');
        const label = tile.querySelector('.label');
        
        if (!link) {
            console.warn(`⚠️ Tile ${index + 1} has no link`);
            return;
        }
        
        const url = link.href;
        const title = label ? label.textContent.trim() : `Tile ${index + 1}`;
        
        console.log(`✅ Adding menu to: ${title}`);
        addRadialMenuToTile(tile, link, title, url);
    });
    
    console.log('✅ Radial menus installed! Right-click any tile to use.');
}

// Wait for page to fully load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRadialMenus);
} else {
    initRadialMenus();
}

// Retry after short delay (for Jekyll rendering)
setTimeout(() => {
    const tiles = document.querySelectorAll('.tile');
    if (tiles.length > 0) {
        console.log('🔄 Re-initializing for Jekyll content...');
        initRadialMenus();
    }
}, 1000);