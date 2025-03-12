class RotatingTextAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'before-text', 'animated-text', 'after-text',
      'background-color', 'before-color', 'animated-color', 'after-color',
      'before-font', 'animated-font', 'after-font',
      'animation-duration', 'animation-direction'
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
    let animationDuration = this.getAttribute('animation-duration') || '8';
    const animationDirection = this.getAttribute('animation-direction') || 'upward';

    // Ensure animation duration includes 's' unit
    animationDuration = isNaN(animationDuration) ? animationDuration : `${animationDuration}s`;

    // Split animated text, trim whitespace, and filter out empty entries
    const animatedWords = animatedText
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0); // Remove empty strings

    // If no valid words, use a fallback
    if (animatedWords.length === 0) {
      animatedWords.push('default');
    }

    // Calculate animation parameters
    const lineHeight = 40; // Fixed line height in px
    const totalHeight = lineHeight * animatedWords.length;
    const stepPercentage = animatedWords.length > 1 ? 100 / (animatedWords.length - 1) : 100;

    // Determine animation direction
    const isUpward = animationDirection === 'upward';
    const translateStart = isUpward ? '0' : `-${totalHeight - lineHeight}px`;
    const translateEnd = isUpward ? `-${totalHeight - lineHeight}px` : '0';

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
          align-items: center;
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
        }

        .animated-container span {
          display: block;
          animation: move ${animationDuration} infinite;
        }

        .after-text {
          color: ${afterColor};
          font-family: ${afterFont}, sans-serif;
        }

        @keyframes move {
          0% {
            transform: translateY(${translateStart});
          }
          ${animatedWords.length > 1 ? animatedWords.map((_, i) => {
            if (i === 0) return ''; // Skip 0%
            const percentage = i * stepPercentage;
            return `
              ${percentage}% {
                transform: translateY(${isUpward ? `-${i * lineHeight}px` : `${(animatedWords.length - 1 - i) * lineHeight}px`});
              }
            `;
          }).join('') : '' /* No keyframes if only one word */}
          100% {
            transform: translateY(${translateEnd});
          }
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
