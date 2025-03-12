class RotatingText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'before-text', 'animated-text', 'after-text',
      'background-color',
      'before-color', 'animated-color', 'after-color',
      'before-font', 'animated-font', 'after-font',
      'before-size', 'animated-size', 'after-size'
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
    const beforeText = this.getAttribute('before-text') || 'Before';
    const animatedText = this.getAttribute('animated-text') || 'word1, word2, word3';
    const afterText = this.getAttribute('after-text') || 'After';
    const backgroundColor = this.getAttribute('background-color') || '#131313';
    const beforeColor = this.getAttribute('before-color') || '#FFFFFF';
    const animatedColor = this.getAttribute('animated-color') || '#FF7A00';
    const afterColor = this.getAttribute('after-color') || '#FFFFFF';
    const beforeFont = this.getAttribute('before-font') || 'Verdana';
    const animatedFont = this.getAttribute('animated-font') || 'Verdana';
    const afterFont = this.getAttribute('after-font') || 'Verdana';
    const beforeSize = this.getAttribute('before-size') || '40'; // In px
    const animatedSize = this.getAttribute('animated-size') || '40'; // In px
    const afterSize = this.getAttribute('after-size') || '40'; // In px

    // Split animated text into an array
    const animatedWords = animatedText.split(',').map(word => word.trim());
    const animationDuration = `${animatedWords.length * 2}s`; // 2s per word

    // Generate spans for animated words
    const animatedSpans = animatedWords.map(word => `<span>${word}</span>`).join('');

    // Use the largest font size for the container height to ensure alignment
    const maxFontSize = Math.max(parseInt(beforeSize), parseInt(animatedSize), parseInt(afterSize));
    const animatedHeight = maxFontSize; // Set height to tallest text for smooth animation

    // Inject HTML and CSS into shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 100vw;
          height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${backgroundColor};
        }

        .rotating-text {
          text-transform: uppercase;
          display: flex;
          align-items: baseline; /* Align all text on the same baseline */
          gap: 0.5em;
          flex-wrap: wrap; /* Allow wrapping if needed */
        }

        .before-text {
          color: ${beforeColor};
          font-family: ${beforeFont}, sans-serif;
          font-size: ${beforeSize}px;
          line-height: 1; /* Normalize line height for consistent baseline */
        }

        .animated-container {
          display: inline-block;
          height: ${animatedHeight}px; /* Match tallest text for animation */
          overflow: hidden;
          color: ${animatedColor};
          font-family: ${animatedFont}, sans-serif;
          font-size: ${animatedSize}px;
          line-height: 1; /* Normalize line height */
        }

        .animated-container span {
          display: block;
          animation: moveUp ${animationDuration} infinite;
          line-height: ${animatedHeight}px; /* Match container height */
        }

        .after-text {
          color: ${afterColor};
          font-family: ${afterFont}, sans-serif;
          font-size: ${afterSize}px;
          line-height: 1; /* Normalize line height */
        }

        @keyframes moveUp {
          0% {
            transform: translateY(0);
          }
          ${animatedWords.map((_, i) => `
            ${(i + 1) * (100 / animatedWords.length)}% {
              transform: translateY(-${(i + 1) * 100}%);
            }
          `).join('')}
          100% {
            transform: translateY(0);
          }
        }
      </style>
      <div class="rotating-text">
        <span class="before-text">${beforeText}</span>
        <div class="animated-container">
          ${animatedSpans}
        </div>
        <span class="after-text">${afterText}</span>
      </div>
    `;
  }
}

// Define the custom element
customElements.define('rotating-text', RotatingText);
