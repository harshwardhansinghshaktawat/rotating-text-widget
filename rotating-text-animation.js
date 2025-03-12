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

    animationDuration = isNaN(animationDuration) ? animationDuration : `${animationDuration}s`;

    const animatedWords = animatedText.split(',').map(word => word.trim());
    const lineHeight = 40;
    const totalHeight = lineHeight * animatedWords.length;
    const stepPercentage = 100 / (animatedWords.length - 1);

    const isUpward = animationDirection === 'upward';
    const translateStart = isUpward ? '0' : `-${totalHeight - lineHeight}px`;
    const translateEnd = isUpward ? `-${totalHeight - lineHeight}px` : '0';

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
          ${animatedWords.map((_, i) => {
            if (i === 0) return '';
            const percentage = i * stepPercentage;
            return `
              ${percentage}% {
                transform: translateY(${isUpward ? `-${i * lineHeight}px` : `${(animatedWords.length - 1 - i) * lineHeight}px`});
              }
            `;
          }).join('')}
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
