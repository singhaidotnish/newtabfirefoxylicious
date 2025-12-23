// radial-menu.js
document.addEventListener('DOMContentLoaded', function() {
  const pinContainer = document.getElementById('pinContainer');
  if (!pinContainer || !window.pinsData) return;
  
  // Sort pins by order
  const sortedPins = window.pinsData.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Position mapping
  const positions = [
    'top', 'right', 'bottom', 'left',
    'ne', 'se', 'sw', 'nw',
    'outer-top', 'outer-right', 'outer-bottom', 'outer-left',
    'outer-ne', 'outer-se', 'outer-sw'
  ];
  
  let positionIndex = 0;
  
  // Create main pins
  sortedPins.forEach((pin, index) => {
    if (pin.isCategoryPin) return; // Skip category pins for now
    
    const pinElement = createPinElement(pin, positions[positionIndex] || 'extra');
    pinContainer.appendChild(pinElement);
    positionIndex++;
  });
  
  // Create category pins
  const categoryPins = sortedPins.filter(pin => pin.isCategoryPin);
  categoryPins.forEach((pin, index) => {
    const pinElement = createPinElement(pin, `extra-${index + 1}`);
    pinElement.classList.add('category-pin');
    pinContainer.appendChild(pinElement);
  });
  
  // Initialize save buttons
  document.querySelectorAll('.pin-save').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.textContent = '✓';
      this.style.background = '#10b981';
      setTimeout(() => {
        this.textContent = '📌';
        this.style.background = '#e60023';
      }, 1000);
    });
  });
  
  // Center button click
  const centerBtn = document.querySelector('.center-start');
  if (centerBtn) {
    centerBtn.addEventListener('click', function() {
      this.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'translate(-50%, -50%)';
      }, 150);
    });
  }
});

function createPinElement(pin, position) {
  const pinElement = document.createElement('div');
  pinElement.className = `pin-card pos-${position} category-${pin.category}`;
  pinElement.dataset.category = pin.category;
  pinElement.dataset.id = pin.id;
  pinElement.dataset.url = pin.url;
  pinElement.style.setProperty('--pin-color', pin.color || '#e60023');
  
  const hasImage = pin.img && pin.img.trim() !== '';
  
  pinElement.innerHTML = `
    <button class="pin-save">📌</button>
    ${pin.isCategoryPin ? '<div class="pin-badge">🎯</div>' : ''}
    <div class="pin-header">
      ${hasImage ? 
        `<img class="pin-icon" src="${pin.img}" alt="${pin.name}">` :
        `<span class="pin-emoji">${pin.emoji || '📌'}</span>`
      }
      <div class="pin-text">
        <div class="pin-title">${pin.name}</div>
        ${pin.subtitle ? `<div class="pin-subtitle">${pin.subtitle || ''}</div>` : ''}
      </div>
    </div>
  `;
  
  // Add click event for navigation
  pinElement.addEventListener('click', function(e) {
    if (!e.target.classList.contains('pin-save') && 
        !e.target.closest('.pin-save') &&
        !e.target.classList.contains('pin-badge')) {
      
      if (pin.url && pin.url.trim() !== '' && pin.url !== '#') {
        window.open(pin.url, '_blank');
      }
    }
  });
  
  // Add image error handling
  if (hasImage) {
    const img = pinElement.querySelector('.pin-icon');
    if (img) {
      img.onerror = function() {
        this.style.display = 'none';
        const emoji = document.createElement('span');
        emoji.className = 'pin-emoji';
        emoji.textContent = pin.emoji || '📌';
        this.parentElement.appendChild(emoji);
      };
    }
  }
  
  return pinElement;
}