// Subscribe to Host resize messages.
window.addEventListener("message", handleBodyResize);

function handleBodyResize(event) {
  if (event.origin !== 'http://localhost:9000') {
    console.warn('Received message from unauthorized origin:', event.origin);
    return;
  }
  const { width, height } = event.data;
  document.body.style.width = width + 'px';
  document.body.style.height = height + 'px';
}

// Create an instance DogeboxDebugPanel, append to body.
const dogeDebugPanelElement = document.createElement('dogebox-debug-panel');
document.body.appendChild(dogeDebugPanelElement);

// DogeboxDebugPanel custom el.
const template = document.createElement('template');
template.innerHTML = `
  <style>
    #DogeboxDebugPanel {
      font-family: sans-serif;
      font-size: .8rem;
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: rgba(255, 105, 180, 0.5);
      border: 1px solid #FF69B4;
      padding: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      z-index: 1000; /* absolute top */
    }

    #DogeboxDebugPanel .title {
      display: inline-block;
      margin-bottom: 3px;
      font-size: .8rem;
      text-transform: uppercase;
      margin-left: 2px;
      color: rgba(0,0,0,0.5);
    }

    #DogeboxDebugPanel table {
      border-collapse: collapse;
      width: 100%;
    }

    #DogeboxDebugPanel th,
    #DogeboxDebugPanel td {
      border: 1px solid rgba(0,0,0,0.1);
      padding: 3px;
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
      max-width:250px;
      display:inline-block;
    }

    #DogeboxDebugPanel td.label {
      background: rgba(255,255,255, 0.1);
      text-transform: uppercase;
      font-weight: bold;
    }
  </style>
  <div id="DogeboxDebugPanel">
    <strong class="title">Debug Panel</strong>
    <table>
      <tr>
        <td class="label">Source:</td>
        <td id="url">
          <a href="#" target="_blank" id="sourceLink" rel="noopener noreferrer">
            <sl-icon name="box-arrow-up-right"></sl-icon>
          </a>
        </td>
      </tr>
      <tr>
        <td class="label">Dimensions:</td>
        <td>
          <span id="DebugWidth"></span> x <span id="DebugHeight"></span>
        </td>
      </tr>
    </table>
  </div>
`;

// Define custom element
class DogeboxDebugPanel extends HTMLElement {
  constructor() {
    super();
    
    // Attach shadow DOM and clone the template content
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Initialize properties
    this.widthEl = shadowRoot.getElementById('DebugWidth');
    this.heightEl = shadowRoot.getElementById('DebugHeight');
    this.sourceLinkEl = shadowRoot.getElementById('sourceLink');
  }

  connectedCallback() {
    // Set the source link href and text
    this.sourceLinkEl.href = window.location.href;
    this.sourceLinkEl.textContent = window.location.href;

    // Listen for resize messages
    window.addEventListener('message', this.handleResizeMessage.bind(this));
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener('message', this.handleResizeMessage.bind(this));
  }

  // Update dimensions in the debug panel
  handleResizeMessage(event) {
    if (event.origin !== 'http://localhost:9000') {
      console.warn('Received message from unauthorized origin:', event.origin);
      return;
    }
    const { width, height } = event.data;
    this.widthEl.textContent = width;
    this.heightEl.textContent = height;
  }
}

// Define the element
customElements.define('dogebox-debug-panel', DogeboxDebugPanel);