import { useStore } from './store';

/**
 * Sound Effects & Celebration Chimes
 * Zero external audio dependencies - synthesizes harmonic celebration chimes
 * and audio cues using the browser's Web Audio API.
 */
class SoundEffectsManager {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (_) {
      return null;
    }
  }

  /**
   * Plays celebration chimes on level completion and confetti
   * Ascending bell-like pentatonic chimes with harmonic decay
   */
  playCelebrationChime(): void {
    const isEnabled = useStore.getState().soundEnabled;
    if (!isEnabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for celebration chimes: C5, E5, G5, B5, C6, E6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.08;

      // Primary tone oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Shimmer overtone oscillator
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, noteTime);

      // Envelopes: crisp attack, resonant chime decay
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.25, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.7);

      overtoneGain.gain.setValueAtTime(0.0001, noteTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.08, noteTime + 0.015);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.75);

      overtone.start(noteTime);
      overtone.stop(noteTime + 0.45);
    });
  }

  /**
   * Plays a celebratory level complete fanfare
   */
  playLevelComplete(): void {
    this.playCelebrationChime();
  }

  /**
   * Quick pleasant success ping (for verified code or passing answer)
   */
  playSuccessPing(): void {
    const isEnabled = useStore.getState().soundEnabled;
    if (!isEnabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 1046.5]; // E5 -> C6

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.2, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });
  }
}

export const soundEffects = new SoundEffectsManager();
