import { onBeforeUnmount, onMounted, ref } from "vue";

// The game is drawn against a 1920x1080 reference and converted to absolute
// pixels at runtime. Whichever axis is the tighter fit sets the scale, and the
// slack on the other axis becomes a centring offset -- so the boards stay in
// the same place on the background image whatever the window's ratio.
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

// The mixin this replaces wired itself up by looking for handleResize in
// $options.methods. Since the mixin defined handleResize itself, the check was
// always true, and a board that forgot to override it got a listener calling a
// no-op: no error, just a board that never moved. Taking the callback as an
// argument makes registering it part of calling this at all.
export function useResponsivePosition(onResize) {
  const scale = ref(1);
  let xOffset = 0;
  let yOffset = 0;

  function calculatePosition(baseCoords) {
    const xScale = window.innerWidth / BASE_WIDTH;
    const yScale = window.innerHeight / BASE_HEIGHT;

    xOffset = 0;
    yOffset = 0;

    if (xScale > yScale) {
      // Fits exactly across, slack above and below.
      scale.value = xScale;
      yOffset = (window.innerHeight - BASE_HEIGHT * xScale) / 2;
    } else {
      // Fits exactly down, slack left and right.
      scale.value = yScale;
      xOffset = (window.innerWidth - BASE_WIDTH * yScale) / 2;
    }

    return {
      top: `${baseCoords.y * scale.value + yOffset}px`,
      left: `${baseCoords.x * scale.value + xOffset}px`,
      width: `${baseCoords.width * scale.value}px`,
      height: `${baseCoords.height * scale.value}px`
    };
  }

  // Reads the scale left by the last calculatePosition, which every caller runs
  // first.
  function calculateLineHeight(totalHeight, rows = 10) {
    return `${(totalHeight * scale.value) / rows}px`;
  }

  // The composable owns the listener, and runs the first calculation itself --
  // which is what the five manual window.dispatchEvent(new Event("resize"))
  // calls in the mounted hooks were doing.
  onMounted(() => {
    onResize();
    window.addEventListener("resize", onResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });

  return { scale, calculatePosition, calculateLineHeight };
}
