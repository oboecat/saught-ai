import { createRoot } from 'react-dom/client';
import { FloatingAIWidget } from './widget-wrapper';
import './widget-styles.css';

// Type definitions
interface WidgetConfig {
  agentPrompt?: string;
  defaultAI?: string;
  placeholder?: string;
}

interface SaughtWidgetAPI {
  update: (config: WidgetConfig) => void;
  remove: () => void;
}

declare global {
  interface Window {
    SaughtWidget?: SaughtWidgetAPI;
    initSaughtWidget?: () => void;
    __saughtWidgetCSS?: string;
  }
}

// Initialize the widget
function initSaughtWidget() {
  // Check if widget already exists
  if (document.getElementById('saught-widget-root')) {
    console.warn('Saught widget already initialized');
    return;
  }

  // Create the host element
  const hostElement = document.createElement('div');
  hostElement.id = 'saught-widget-root';
  
  // Create shadow root
  const shadowRoot = hostElement.attachShadow({ mode: 'open' });
  
  // Inject styles into shadow DOM
  const styleEl = document.createElement('style');
  // The build process should inject CSS as a global variable
  if (window.__saughtWidgetCSS) {
    styleEl.textContent = window.__saughtWidgetCSS;
    shadowRoot.appendChild(styleEl);
  }
  
  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div');
  mountPoint.id = 'saught-widget-mount';
  shadowRoot.appendChild(mountPoint);
  
  // Append host to body
  document.body.appendChild(hostElement);
  
  // Parse configuration from script tag if available
  const scriptTag = document.currentScript || document.querySelector('script[src*="saught.ai/v1.js"]') || document.querySelector('script[src*="v1.js"]');
  let config: WidgetConfig = {};
  
  if (scriptTag) {
    // Check for data attributes
    const agentPrompt = scriptTag.getAttribute('data-agent-prompt');
    const defaultAI = scriptTag.getAttribute('data-default-ai');
    const placeholder = scriptTag.getAttribute('data-placeholder');
    
    if (agentPrompt) config.agentPrompt = agentPrompt;
    if (defaultAI) config.defaultAI = defaultAI;
    if (placeholder) config.placeholder = placeholder;
  }
  
  // Create React root
  const root = createRoot(mountPoint);
  
  // Render the widget
  const renderWidget = (widgetConfig: WidgetConfig) => {
    root.render(<FloatingAIWidget {...widgetConfig} />);
  };
  
  renderWidget(config);
  
  // Expose global function to programmatically update the widget
  window.SaughtWidget = {
    update: (newConfig: WidgetConfig) => {
      const mergedConfig = { ...config, ...newConfig };
      config = mergedConfig;
      renderWidget(mergedConfig);
    },
    remove: () => {
      root.unmount();
      hostElement.remove();
      delete window.SaughtWidget;
    }
  };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSaughtWidget);
} else {
  initSaughtWidget();
}

// Also expose the init function globally
window.initSaughtWidget = initSaughtWidget; 