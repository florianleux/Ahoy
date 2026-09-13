// jsdom ships no media playback: HTMLMediaElement.play throws "Not implemented".
// The real AudioManager still runs in the tests — only the playback call is a no-op.
HTMLMediaElement.prototype.play = () => Promise.resolve();
HTMLMediaElement.prototype.pause = () => {};
