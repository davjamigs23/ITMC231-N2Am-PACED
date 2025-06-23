import { initComponents } from './utils.js';
import { checkAuth } from './auth.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize common components (header, etc.)
    await initComponents();
    
    // Check authentication status
    await checkAuth(false);
    
    // Add any other global initialization code here
    
    console.log('Application initialized');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
});

// Add any global event listeners or utility functions here

// Example: Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
  const dropdowns = document.querySelectorAll('[data-dropdown]');
  
  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('[data-dropdown-toggle]');
    const menu = dropdown.querySelector('[data-dropdown-menu]');
    
    if (!dropdown.contains(event.target) && !event.target.matches('[data-dropdown-toggle]')) {
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        if (button) {
          button.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });
});

// Initialize tooltips
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    const tooltipText = element.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'invisible absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip';
    tooltip.textContent = tooltipText;
    
    // Position the tooltip
    document.body.appendChild(tooltip);
    
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
      tooltip.style.left = `${rect.left + (element.offsetWidth / 2) - (tooltip.offsetWidth / 2)}px`;
    };
    
    element.addEventListener('mouseenter', () => {
      updatePosition();
      tooltip.classList.remove('invisible', 'opacity-0');
      tooltip.classList.add('visible', 'opacity-100');
    });
    
    element.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible', 'opacity-100');
      tooltip.classList.add('invisible', 'opacity-0');
    });
    
    // Clean up on page navigation
    element.addEventListener('unload', () => {
      tooltip.remove();
    });
  });
}

// Call tooltip initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initTooltips);

// Re-initialize tooltips when the page is shown (for single-page applications)
document.addEventListener('page:show', initTooltips);

// Handle page transitions for single-page applications
if (window.history.pushState) {
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
  };

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });

  window.addEventListener('locationchange', () => {
    // Re-initialize components when the route changes
    initComponents();
    initTooltips();
  });
}
