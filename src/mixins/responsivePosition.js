/**
 * Responsive Position Mixin
 * Calculates element positions based on a 1920x1080 base resolution
 * Replaces jQuery-based resize calculations
 */

export const responsivePositionMixin = {
  data() {
    return {
      scale: 1,
      xOffset: 0,
      yOffset: 0
    };
  },
  methods: {
    /**
     * Calculate responsive position for an element
     * @param {Object} baseCoords - { x, y, width, height } in 1920x1080 space
     * @returns {Object} Calculated position
     */
    calculatePosition(baseCoords) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate scale based on window dimensions
      const xScale = windowWidth / 1920;
      const yScale = windowHeight / 1080;

      let scale,
        yOffset = 0,
        xOffset = 0;

      if (xScale > yScale) {
        // Image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset = (windowHeight - 1080 * scale) / 2;
      } else {
        // Image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset = (windowWidth - 1920 * scale) / 2;
      }

      // Store for reuse
      this.scale = scale;
      this.xOffset = xOffset;
      this.yOffset = yOffset;

      return {
        top: `${baseCoords.y * scale + yOffset}px`,
        left: `${baseCoords.x * scale + xOffset}px`,
        width: `${baseCoords.width * scale}px`,
        height: `${baseCoords.height * scale}px`
      };
    },

    /**
     * Calculate line height for grid elements
     * @param {number} totalHeight - Total height of the grid
     * @param {number} rows - Number of rows (default 10)
     * @returns {string} Line height in pixels
     */
    calculateLineHeight(totalHeight, rows = 10) {
      return `${(totalHeight * this.scale) / rows}px`;
    },

    /**
     * Set up responsive positioning (call in mounted hook)
     */
    setupResponsive() {
      this.handleResize();
      window.addEventListener("resize", this.handleResize);
    },

    /**
     * Clean up responsive positioning (call in beforeDestroy hook)
     */
    cleanupResponsive() {
      window.removeEventListener("resize", this.handleResize);
    },

    /**
     * Override this method in your component to handle resize events
     */
    handleResize() {
      // Override in component
    }
  },
  mounted() {
    // Auto-setup if handleResize is overridden
    if (this.$options.methods && this.$options.methods.handleResize) {
      this.setupResponsive();
    }
  },
  beforeDestroy() {
    // Auto-cleanup
    this.cleanupResponsive();
  }
};
