// Pinterest Radial Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const radialMenu = document.querySelector('.radial-menu');
  const pinsData = window.pins || [];
  
  // Create container for pin items
  const pinContainer = document.createElement('div');
  pinContainer.className = 'pin-items-container';
  
  // Configuration
  const config = {
    radius: 280,    // Base radius
    totalItems: pinsData.length,
    centerX: 400,   // Half of wrapper width
    centerY: 300,   // Half of wrapper height
    angleOffset: -90 // Start from top
  };
  
  // Create pin items
  pinsData.forEach((pin, index) => {
    const angle = (360 / config.totalItems * index) + config.angleOffset;
    const radian = angle * Math.PI / 180;
    
    // Calculate position with some randomness for Pinterest look
    const radiusVariation = config.radius + (Math.random() * 60 - 30);
    const x = config.centerX + radiusVariation * Math.cos(radian);
    const y = config.centerY + radiusVariation * Math.sin(radian);
    
    // Create pin item
    const pinItem = document.createElement('div');
    pinItem.className = 'pin-item';
    pinItem.style.setProperty('--pin-color', pin.color || '#e60023');
    pinItem.style.left = `${x}px`;
    pinItem.style.top = `${y}px`;
    pinItem.dataset.angle = angle;
    
    // Create Pinterest card
    const pinCard = document.createElement('div');
    pinCard.className = 'pin-card';
    
    // Add content
    pinCard.innerHTML = `
      <button class="pin-save-btn" aria-label="Save">📌</button>
      <span class="pin-icon">${pin.emoji || '📌'}</span>
      <div class="pin-title">${pin.name}</div>
      ${pin.subtitle ? `<div class="pin-subtitle">${pin.subtitle}</div>` : ''}
    `;
    
    // Add click event
    pinCard.addEventListener('click', function(e) {
      if (!e.target.classList.contains('pin-save-btn')) {
        if (pin.url && pin.url !== '#') {
          window.open(pin.url, '_blank');
        }
      }
    });
    
    // Add save button event
    const saveBtn = pinCard.querySelector('.pin-save-btn');
    saveBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      saveBtn.textContent = '✓';
      saveBtn.style.background = '#10b981';
      setTimeout(() => {
        saveBtn.textContent = '📌';
        saveBtn.style.background = '#e60023';
      }, 1000);
    });
    
    pinItem.appendChild(pinCard);
    pinContainer.appendChild(pinItem);
  });
  
  radialMenu.appendChild(pinContainer);
  
  // Add center pin click event
  const centerPin = document.querySelector('.center-pin');
  centerPin.addEventListener('click', function() {
    // Toggle animation or perform action
    this.style.transform = 'translate(-50%, -50%) scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'translate(-50%, -50%)';
    }, 150);
  });
  
  // Add hover effects for surrounding pins
  centerPin.addEventListener('mouseenter', function() {
    document.querySelectorAll('.pin-item').forEach(item => {
      item.style.transform = 'translate(-50%, -50%) scale(1.05)';
    });
  });
  
  centerPin.addEventListener('mouseleave', function() {
    document.querySelectorAll('.pin-item').forEach(item => {
      item.style.transform = 'translate(-50%, -50%)';
    });
  });
});