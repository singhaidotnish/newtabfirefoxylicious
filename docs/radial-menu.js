// radial-menu.js
document.addEventListener('DOMContentLoaded', function() {
  // Save button functionality
  document.querySelectorAll('.pin-save').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.textContent = '✓';
      this.style.background = '#10b981';
      this.style.transform = 'scale(1.2)';
      
      setTimeout(() => {
        this.textContent = '📌';
        this.style.background = '#e60023';
        this.style.transform = 'scale(1)';
      }, 1000);
    });
  });
  
  // Pin click for navigation
  document.querySelectorAll('.pin-card:not(.category-pin)').forEach(pin => {
    pin.addEventListener('click', function(e) {
      if (!e.target.classList.contains('pin-save') && 
          !e.target.closest('.pin-save')) {
        
        const url = this.dataset.url;
        if (url && url !== '#') {
          window.open(url, '_blank');
        }
      }
    });
  });
  
  // Center button click
  const centerBtn = document.querySelector('.center-start');
  centerBtn.addEventListener('click', function() {
    this.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => {
      this.style.transform = 'translate(-50%, -50%)';
    }, 150);
  });
});