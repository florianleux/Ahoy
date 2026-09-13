import { assetUrl } from "@/utils/assets";

/**
 * AudioManager - Singleton for managing game audio
 * Prevents memory leaks by reusing audio instances
 */

interface AudioOptions {
  volume?: number;
  loop?: boolean;
}

class AudioManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private music: Record<string, HTMLAudioElement> = {};

  /**
   * Load and cache a sound effect
   * @param {string} key - Unique identifier for the sound
   * @param {string} path - Path to the audio file
   * @param {Object} options - Optional settings (volume, loop)
   * @returns {Audio} The audio instance
   */
  loadSound(
    key: string,
    path: string,
    options: AudioOptions = {}
  ): HTMLAudioElement {
    if (!this.sounds[key]) {
      this.sounds[key] = new Audio(path);
      if (options.volume !== undefined) {
        this.sounds[key].volume = options.volume;
      }
      if (options.loop !== undefined) {
        this.sounds[key].loop = options.loop;
      }
    }
    return this.sounds[key];
  }

  /**
   * Load and cache background music
   * @param {string} key - Unique identifier for the music
   * @param {string} path - Path to the audio file
   * @param {Object} options - Optional settings (volume, loop)
   * @returns {Audio} The audio instance
   */
  loadMusic(
    key: string,
    path: string,
    options: AudioOptions = {}
  ): HTMLAudioElement {
    if (!this.music[key]) {
      this.music[key] = new Audio(path);
      if (options.volume !== undefined) {
        this.music[key].volume = options.volume;
      }
      if (options.loop !== undefined) {
        this.music[key].loop = options.loop;
      }
    }
    return this.music[key];
  }

  /**
   * Play a sound effect
   * @param {string} key - Sound identifier
   * @returns {Promise}
   */
  playSound(key: string): Promise<void> | undefined {
    if (this.sounds[key]) {
      this.sounds[key].currentTime = 0;
      return this.sounds[key].play().catch(err => {
        console.warn(`Could not play sound ${key}:`, err);
      });
    }
  }

  /**
   * Play background music
   * @param {string} key - Music identifier
   * @returns {Promise}
   */
  playMusic(key: string): Promise<void> | undefined {
    if (this.music[key]) {
      return this.music[key].play().catch(err => {
        console.warn(`Could not play music ${key}:`, err);
      });
    }
  }

  /**
   * Stop a sound effect
   * @param {string} key - Sound identifier
   */
  stopSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].pause();
      this.sounds[key].currentTime = 0;
    }
  }

  /**
   * Stop background music
   * @param {string} key - Music identifier
   */
  stopMusic(key: string): void {
    if (this.music[key]) {
      this.music[key].pause();
      this.music[key].currentTime = 0;
    }
  }

  /**
   * Stop all music
   */
  stopAllMusic(): void {
    Object.values(this.music).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Set volume for a specific sound
   * @param {string} key - Sound identifier
   * @param {number} volume - Volume (0-1)
   */
  setSoundVolume(key: string, volume: number): void {
    if (this.sounds[key]) {
      this.sounds[key].volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set volume for a specific music track
   * @param {string} key - Music identifier
   * @param {number} volume - Volume (0-1)
   */
  setMusicVolume(key: string, volume: number): void {
    if (this.music[key]) {
      this.music[key].volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get a sound instance
   * @param {string} key - Sound identifier
   * @returns {Audio|undefined}
   */
  getSound(key: string): HTMLAudioElement | undefined {
    return this.sounds[key];
  }

  /**
   * Get a music instance
   * @param {string} key - Music identifier
   * @returns {Audio|undefined}
   */
  getMusic(key: string): HTMLAudioElement | undefined {
    return this.music[key];
  }

  /**
   * Clean up all audio resources
   */
  cleanup(): void {
    // Clean up sounds
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.src = "";
    });
    this.sounds = {};

    // Clean up music
    Object.values(this.music).forEach(audio => {
      audio.pause();
      audio.src = "";
    });
    this.music = {};
  }

  /**
   * Preload all game sounds
   */
  preloadGameSounds(): void {
    this.loadSound("click", assetUrl("music/click.wav"), { volume: 1 });
    this.loadSound("hit", assetUrl("music/hit.wav"), { volume: 0.7 });
    this.loadSound("destroyed", assetUrl("music/hit.wav"), { volume: 0.7 });
    this.loadSound("missed", assetUrl("music/missed.mp3"), { volume: 0.7 });
    this.loadSound("placed", assetUrl("music/placed.wav"), { volume: 1 });
    this.loadMusic("home", assetUrl("music/home.wav"), {
      volume: 0.15,
      loop: true
    });
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
