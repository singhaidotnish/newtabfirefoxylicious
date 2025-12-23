// category-expander.js
document.addEventListener('DOMContentLoaded', function() {
  const categoryPins = document.querySelectorAll('.category-pin');
  const overlay = document.getElementById('categoryOverlay');
  const expansionGrid = document.getElementById('expansionGrid');
  const expansionTitle = overlay.querySelector('.expansion-title');
  const closeBtn = overlay.querySelector('.expansion-close');
  
  // YouTube category pins
  const youtubePin = document.querySelector('.category-pin.category-youtube');
  const aiPin = document.querySelector('.category-pin.category-ai');
  
  // Preload category data
  const categoryData = {};
  const allPins = document.querySelectorAll('.pin-card[data-category]');
  
  allPins.forEach(pin => {
    const category = pin.dataset.category;
    if (!categoryData[category]) {
      categoryData[category] = [];
    }
    
    // Get pin data
    const pinData = {
      name: pin.querySelector('.pin-title').textContent,
      url: pin.dataset.url || '#',
      emoji: pin.querySelector('.pin-emoji')?.textContent || '📌',
      img: pin.querySelector('.pin-icon')?.src || '',
      color: pin.style.getPropertyValue('--pin-color') || '#e60023'
    };
    
    categoryData[category].push(pinData);
    
    // Also check hidden data
    const hiddenData = pin.querySelector('.pin-data');
    if (hiddenData) {
      const categoryItems = hiddenData.querySelectorAll('.category-item');
      categoryItems.forEach(item => {
        categoryData[category].push({
          name: item.dataset.name,
          url: item.dataset.url,
          emoji: item.dataset.emoji,
          img: item.dataset.img,
          color: item.dataset.color
        });
      });
    }
  });
  
  // Add click event to category pins
  categoryPins.forEach(pin => {
    pin.addEventListener('click', function(e) {
      if (!e.target.classList.contains('pin-save')) {
        const category = this.dataset.category;
        showCategoryExpansion(category);
      }
    });
    
    // Also add hover effect for immediate feedback
    pin.addEventListener('mouseenter', function() {
      const category = this.dataset.category;
      highlightCategoryPins(category);
    });
    
    pin.addEventListener('mouseleave', function() {
      clearCategoryHighlights();
    });
  });
  
  // Add hover to regular pins that have categories
  const regularPinsWithCategory = document.querySelectorAll('.pin-card:not(.category-pin)');
  regularPinsWithCategory.forEach(pin => {
    pin.addEventListener('mouseenter', function() {
      const category = this.dataset.category;
      if (category && categoryData[category]?.length > 1) {
        highlightCategoryPins(category);
      }
    });
    
    pin.addEventListener('mouseleave', function() {
      clearCategoryHighlights();
    });
    
    pin.addEventListener('click', function(e) {
      if (!e.target.classList.contains('pin-save')) {
        const category = this.dataset.category;
        if (category && categoryData[category]?.length > 1) {
          // Show quick tooltip
          showCategoryTooltip(this, category);
        }
      }
    });
  });
  
  // Function to show category expansion
  function showCategoryExpansion(category) {
    const items = categoryData[category] || [];
    
    // Set overlay title and color
    expansionTitle.textContent = `${category.toUpperCase()} Links`;
    overlay.style.setProperty('--category-color', getCategoryColor(category));
    
    // Clear grid
    expansionGrid.innerHTML = '';
    
    // Add items
    items.forEach((item, index) => {
      const template = document.getElementById('expansionItemTemplate');
      const expansionItem = template.content.cloneNode(true).querySelector('.expansion-pin');
      
      expansionItem.style.setProperty('--item-color', item.color);
      expansionItem.style.animationDelay = `${index * 0.05}s`;
      
      // Set icon
      const icon = expansionItem.querySelector('.expansion-icon');
      const emoji = expansionItem.querySelector('.expansion-emoji');
      
      if (item.img && item.img !== '/images/') {
        icon.src = item.img;
        icon.alt = item.name;
        emoji.style.display = 'none';
      } else {
        icon.style.display = 'none';
        emoji.textContent = item.emoji;
      }
      
      expansionItem.querySelector('.expansion-pin-title').textContent = item.name;
      
      // Shorten URL for display
      const urlDisplay = new URL(item.url).hostname.replace('www.', '');
      expansionItem.querySelector('.expansion-pin-url').textContent = urlDisplay;
      
      // Add click event
      expansionItem.addEventListener('click', function() {
        if (item.url && item.url !== '#') {
          window.open(item.url, '_blank');
        }
      });
      
      expansionGrid.appendChild(expansionItem);
    });
    
    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Function to highlight pins of same category
  function highlightCategoryPins(category) {
    // Dim all pins
    document.querySelectorAll('.pin-card').forEach(pin => {
      if (!pin.classList.contains(`category-${category}`) && !pin.classList.contains('center-start')) {
        pin.style.opacity = '0.3';
        pin.style.filter = 'blur(2px)';
      }
    });
    
    // Highlight category pins
    document.querySelectorAll(`.category-${category}`).forEach(pin => {
      pin.style.transform = pin.style.transform.replace('scale(1.25)', 'scale(1.35)');
      pin.style.boxShadow = '0 20px 50px var(--pin-color)';
      pin.style.zIndex = '200';
    });
  }
  
  function clearCategoryHighlights() {
    document.querySelectorAll('.pin-card').forEach(pin => {
      pin.style.opacity = '';
      pin.style.filter = '';
      pin.style.boxShadow = '';
      pin.style.zIndex = '';
    });
  }
  
  // Close overlay
  closeBtn.addEventListener('click', function() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close overlay on background click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Escape key to close overlay
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Helper function to get category color
  function getCategoryColor(category) {
    const firstPin = document.querySelector(`.category-${category}`);
    return firstPin ? firstPin.style.getPropertyValue('--pin-color') : '#e60023';
  }
  
  // Tooltip function
  function showCategoryTooltip(element, category) {
    const count = categoryData[category]?.length || 0;
    if (count <= 1) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'category-tooltip';
    tooltip.innerHTML = `
      <span class="tooltip-badge">${count} items</span>
      <span class="tooltip-text">Hover for more ${category} links</span>
    `;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${rect.left + rect.width/2}px`;
    tooltip.style.top = `${rect.top - 50}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 2000);
  }
});