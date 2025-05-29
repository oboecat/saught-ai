import './widget-styles.css';
import { createRoot } from 'react-dom/client';
import { FloatingAIWidget } from './widget-wrapper';

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
  }
}

async function injectStyle(shadowRoot: ShadowRoot) {
  // Inject Google Fonts first
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap';
  shadowRoot.appendChild(fontLink);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  const fileName = `${process.env.WIDGET_CSS_URL}/v${process.env.WIDGET_VERSION}.css`;

  const response = await fetch(fileName);
  const body = await response.text();

  const style = document.createElement("style");
  style.textContent = body;
  shadowRoot.appendChild(style);

}

// Initialize the widget
async function initSaughtWidget() {
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
  await injectStyle(shadowRoot);
  
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
    root.render(<FloatingAIWidget {...widgetConfig} isWidget={true} />);
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