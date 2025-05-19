class RotatingText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false;
    this.observer = null;
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
    
    // Create and configure the Intersection Observer
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    // Clean up observer when element is removed from DOM
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  setupIntersectionObserver() {
    // Create options for the observer
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px', // No margin
      threshold: 0.2 // Trigger when at least 20% of the element is visible
    };
    
    // Create the observer instance
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element has entered the viewport
          this.isVisible = true;
          this.updateAnimationState();
        } else {
          // Element has left the viewport
          this.isVisible = false;
          this.updateAnimationState();
        }
      });
    }, options);
    
    // Start observing the element
    this.observer.observe(this);
  }
  
  updateAnimationState() {
    const container = this.shadowRoot.querySelector('.animated-container');
    if (!container) return;
    
    const animatedSpans = container.querySelectorAll('span');
    animatedSpans.forEach(span => {
      span.style.animationPlayState = this.isVisible ? 'running' : 'paused';
    });
  }

  render() {
    // Get attribute values with fallbacks
    const beforeText = this.getAttribute('before-text') || '';
    const animatedText = this.getAttribute('animated-text') || 'word1, word2, word3';
    const afterText = this.getAttribute('after-text') || '';
    const backgroundColor = this.getAttribute('background-color') || '#1A1A40';
    const beforeColor = this.getAttribute('before-color') || '#E0E0FF';
    const animatedColor = this.getAttribute('animated-color') || '#FF6F61';
    const afterColor = this.getAttribute('after-color') || '#E0E0FF';
    const beforeFont = this.getAttribute('before-font') || 'Verdana';
    const animatedFont = this.getAttribute('animated-font') || 'Verdana';
    const afterFont = this.getAttribute('after-font') || 'Verdana';
    const beforeSize = this.getAttribute('before-size') || '4'; // In vw (default 4vw ~ 40px on 1000px viewport)
    const animatedSize = this.getAttribute('animated-size') || '4'; // In vw
    const afterSize = this.getAttribute('after-size') || '4'; // In vw

    // Split animated text into an array
    const animatedWords = animatedText.split(',').map(word => word.trim());
    const animationDuration = `${animatedWords.length * 2}s`; // 2s per word

    // Generate spans for animated words
    const animatedSpans = animatedWords.map(word => `<span>${word}</span>`).join('');

    // Use the largest font size (in vw) for the container height
    const maxFontSize = Math.max(parseFloat(beforeSize), parseFloat(animatedSize), parseFloat(afterSize));
    const animatedHeight = `${maxFontSize}vw`;

    // Determine visibility based on text content
    const beforeVisible = beforeText.trim() ? 'inline' : 'none';
    const afterVisible = afterText.trim() ? 'inline' : 'none';

    // Set initial animation state (paused)
    const initialAnimationState = this.isVisible ? 'running' : 'paused';

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
          overflow: hidden; /* Prevent overflow outside widget */
        }

        .rotating-text {
          text-transform: uppercase;
          display: flex;
          flex-wrap: wrap; /* Allow wrapping */
          align-items: baseline;
          gap: 0.5em;
          max-width: 90%; /* Limit width to wrap text within bounds */
          text-align: center; /* Center all text horizontally */
        }

        .before-text {
          display: ${beforeVisible};
          color: ${beforeColor};
          font-family: ${beforeFont}, sans-serif;
          font-size: ${beforeSize}vw;
          line-height: 1;
          order: 1; /* Ensure before text comes first */
        }

        .animated-container {
          display: inline-block;
          height: ${animatedHeight};
          overflow: hidden;
          color: ${animatedColor};
          font-family: ${animatedFont}, sans-serif;
          font-size: ${animatedSize}vw;
          line-height: 1;
          order: 2; /* Animated text in the middle */
        }

        .animated-container span {
          display: block;
          animation: moveUp ${animationDuration} infinite;
          animation-play-state: ${initialAnimationState}; /* Start paused, will be triggered by observer */
          line-height: ${animatedHeight};
        }

        .after-text {
          display: ${afterVisible};
          color: ${afterColor};
          font-family: ${afterFont}, sans-serif;
          font-size: ${afterSize}vw;
          line-height: 1;
          order: 3; /* After text last, wraps under if needed */
          flex: 1 0 auto; /* Allow it to grow and wrap */
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
    
    // Update animation state after rendering
    this.updateAnimationState();
  }
}

// Define the custom element
customElements.define('rotating-text', RotatingText);
