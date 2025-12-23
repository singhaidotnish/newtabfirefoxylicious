// radial-generator.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.pin-cards-container');
  if (!container) return;
  
  // Get pins data from data attribute
  const pinsData = JSON.parse(container.getAttribute('data-pins')) || [];
  
  // Position mapping for CSS classes
  const positionClasses = {
    'top': 'pos-top',
    'right': 'pos-right',
    'bottom': 'pos-bottom',
    'left': 'pos-left',
    'ne': 'pos-ne',
    'se': 'pos-se',
    'sw': 'pos-sw',
    'nw': 'pos-nw',
    'outer-top': 'pos-outer-top',
    'outer-right': 'pos-outer-right',
    'outer-bottom': 'pos-outer-bottom',
    'outer-left': 'pos-outer-left',
    'outer-ne': 'pos-outer-ne',
    'outer-se': 'pos-outer-se',
    'outer-sw': 'pos-outer-sw',
    'outer-nw': 'pos-outer-nw',
    'extra-1': 'pos-extra-1',
    'extra-2': 'pos-extra-2',
    'extra-3': 'pos-extra-3',
    'extra-4': 'pos-extra-4'
  };
  
  // Extra positions for additional pins (dynamic calculation)
  const extraPositions = [
    { angle: 45, distance: 320 },   // extra-1
    { angle: 135, distance: 320 },  // extra-2
    { angle: 225, distance: 320 },  // extra-3
    { angle: 315, distance: 320 }   // extra-4
  ];
  
  // Generate pins
  pinsData.forEach((pin, index) => {
    const template = document.getElementById('pin-template');
    const pinCard = template.content.cloneNode(true).querySelector('.pin-card');
    
    // Add position class
    if (positionClasses[pin.position]) {
      pinCard.classList.add(positionClasses[pin.position]);
    } else if (pin.position?.startsWith('extra')) {
      // Handle extra positions dynamically
      const extraIndex = parseInt(pin.position.split('-')[1]) - 1;
      if (extraPositions[extraIndex]) {
        pinCard.classList.add('pos-extra');
        pinCard.dataset.angle = extraPositions[extraIndex].angle;
        pinCard.dataset.distance = extraPositions[extraIndex].distance;
      }
    }
    
    // Set color
    pinCard.style.setProperty('--pin-color', pin.color || '#e60023');
    
    // Set icon (image or emoji)
    const iconContainer = pinCard.querySelector('.pin-icon-container');
    if (pin.img) {
      const img = document.createElement('img');
      img.className = 'pin-image';
      img.src = pin.img;
      img.alt = pin.name;
      img.onerror = function() {
        this.style.display = 'none';
        const emoji = document.createElement('span');
        emoji.className = 'pin-emoji';
        emoji.textContent = pin.emoji || '📌';
        iconContainer.appendChild(emoji);
      };
      iconContainer.appendChild(img);
    } else {
      const emoji = document.createElement('span');
      emoji.className = 'pin-emoji';
      emoji.textContent = pin.emoji || '📌';
      iconContainer.appendChild(emoji);
    }
    
    // Set text content
    pinCard.querySelector('.pin-title').textContent = pin.name;
    if (pin.subtitle) {
      pinCard.querySelector('.pin-subtitle').textContent = pin.subtitle;
    } else {
      pinCard.querySelector('.pin-subtitle').remove();
    }
    
    // Add click event
    pinCard.addEventListener('click', function(e) {
      if (!e.target.classList.contains('pin-save')) {
        if (pin.url && pin.url !== '#') {
          window.open(pin.url, '_blank');
        }
      }
    });
    
    // Save button event
    const saveBtn = pinCard.querySelector('.pin-save');
    saveBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.textContent = '✓';
      this.style.background = '#10b981';
      setTimeout(() => {
        this.textContent = '📌';
        this.style.background = '#e60023';
      }, 1000);
    });
    
    container.appendChild(pinCard);
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
  
  // Position extra pins dynamically
  setTimeout(() => {
    positionExtraPins();
  }, 100);
});

// Function to position extra pins in a circle
function positionExtraPins() {
  const extraPins = document.querySelectorAll('.pos-extra');
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  extraPins.forEach((pin, index) => {
    const angle = parseFloat(pin.dataset.angle) || (360 / extraPins.length * index);
    const distance = parseFloat(pin.dataset.distance) || 320;
    const radian = angle * Math.PI / 180;
    
    const x = centerX + distance * Math.cos(radian) - pin.offsetWidth / 2;
    const y = centerY + distance * Math.sin(radian) - pin.offsetHeight / 2;
    
    pin.style.position = 'absolute';
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
  });
}