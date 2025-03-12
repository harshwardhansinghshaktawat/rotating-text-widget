class RotatingTextAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'before-text', 'animated-text', 'after-text',
      'background-color', 'before-color', 'animated-color', 'after-color',
      'before-font', 'animated-font', 'after-font'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Get attribute values with fallbacks
    const beforeText = this.getAttribute('before-text') || 'before';
    const animatedText = this.getAttribute('animated-text') || 'word1, word2, word3';
    const afterText = this.getAttribute('after-text') || 'after';
    const backgroundColor = this.getAttribute('background-color') || '#131313';
    const beforeColor = this.getAttribute('before-color') || '#FFFFFF';
    const animatedColor = this.getAttribute('animated-color') || '#FF7A00';
    const afterColor = this.getAttribute('after-color') || '#FFFFFF';
    const beforeFont = this.getAttribute('before-font') || 'Verdana';
    const animatedFont = this.getAttribute('animated-font') || 'Verdana';
    const afterFont = this.getAttribute('after-font') || 'Verdana';

    // Split animated text, trim whitespace, and filter out empty entries
    const animatedWords = animatedText
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);

    // Fallback if no valid words
    if (animatedWords.length === 0) {
      animatedWords.push('default');
    }

    // Fixed animation settings from original code
    const lineHeight = 40; // Matches original CSS
    const totalHeight = lineHeight * animatedWords.length;

    // Inject HTML and CSS into shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100vw;
          height: 100vh;
          margin: 0;
          display: grid;
          place-items: center;
          background: ${backgroundColor};
          overflow: hidden;
        }

        .rotating-text {
          text-transform: uppercase;
          font-size: 40px;
          display: flex;
          align-items: baseline; /* Align all text on baseline */
          gap: 8px;
        }

        .before-text {
          color: ${beforeColor};
          font-family: ${beforeFont}, sans-serif;
        }

        .animated-container {
          display: inline-block;
          height: ${lineHeight}px;
          overflow: hidden;
          color: ${animatedColor};
          font-family: ${animatedFont}, sans-serif;
          line-height: ${lineHeight}px; /* Match container height */
        }

        .animated-container span {
          display: block;
          animation: moveUp 8s infinite; /* Fixed duration from original */
        }

        .after-text {
          color: ${afterColor};
          font-family: ${afterFont}, sans-serif;
        }

        @keyframes moveUp {
          0% { transform: translateY(0); }
          20% { transform: translateY(0); } /* Pause on first word */
          25% { transform: translateY(-${lineHeight}px); }
          45% { transform: translateY(-${lineHeight}px); } /* Pause on second */
          50% { transform: translateY(-${2 * lineHeight}px); }
          70% { transform: translateY(-${2 * lineHeight}px); } /* Pause on third */
          ${animatedWords.length > 3 ? `
            75% { transform: translateY(-${3 * lineHeight}px); }
            95% { transform: translateY(-${3 * lineHeight}px); } /* Pause on fourth if exists */
          ` : ''}
          100% { transform: translateY(-${totalHeight - lineHeight}px); }
        }
      </style>
      <div class="rotating-text">
        <span class="before-text">${beforeText}</span>
        <div class="animated-container">
          <span>${animatedWords.join('<br/>')}</span>
        </div>
        ${afterText ? `<span class="after-text">${afterText}</span>` : ''}
      </div>
    `;
  }
}

customElements.define('rotating-text-animation', RotatingTextAnimation);
