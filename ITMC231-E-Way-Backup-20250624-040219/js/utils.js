// Function to load HTML components into the DOM
export async function loadComponent(selector, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${url}`);
    }
    const html = await response.text();
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      element.outerHTML = html;
    });
    
    return true;
  } catch (error) {
    console.error('Error loading component:', error);
    return false;
  }
}

// Function to initialize common components
export async function initComponents() {
  // Load header
  await loadComponent('header', '/components/header.html');
  
  // Add any other common components here
}

// Function to show loading state
export function showLoading(element) {
  if (!element) return;
  
  const originalHTML = element.innerHTML;
  const originalWidth = element.offsetWidth;
  
  element.disabled = true;
  element.style.width = `${originalWidth}px`;
  element.dataset.originalHtml = originalHTML;
  element.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Loading...</span>
  `;
}

// Function to hide loading state
export function hideLoading(element) {
  if (!element || !element.dataset.originalHtml) return;
  
  element.innerHTML = element.dataset.originalHtml;
  element.removeAttribute('data-original-html');
  element.style.width = '';
  element.disabled = false;
}

// Function to show toast notifications
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Add animation
  toast.style.transition = 'opacity 0.3s, transform 0.3s';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';
  
  // Trigger reflow
  void toast.offsetWidth;
  
  // Animate in
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

// Function to format dates
const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

export function formatDate(dateString) {
  return formatter.format(new Date(dateString));
}
