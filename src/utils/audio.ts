/**
 * Web Audio API synthesizer for child-friendly sound effects & gentle background melody.
 * Completely client-side, requires no external audio assets.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  public isMusicPlaying = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a simple musical tone
  playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.1) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Positive chime for correct answer / points
  playCorrect() {
    this.playTone(523.25, 0.15, 'triangle', 0.15); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.3, 'triangle', 0.2), 200); // G5
    setTimeout(() => this.playTone(1046.50, 0.4, 'sine', 0.2), 300); // C6
  }

  // Soft try-again tone (gentle, not punishing)
  playIncorrect() {
    this.playTone(392.00, 0.2, 'sine', 0.12); // G4
    setTimeout(() => this.playTone(349.23, 0.3, 'sine', 0.12), 150); // F4
  }

  // Fanfare for Trạng Nguyên victory
  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.2), idx * 120);
    });
  }

  // Click tone
  playClick() {
    this.playTone(880, 0.05, 'sine', 0.05);
  }

  // Wheel spin tick
  playSpinTick() {
    this.playTone(700 + Math.random() * 200, 0.04, 'square', 0.04);
  }

  // Toggle background ambient melody (gentle Vietnamese folk style pentatonic bells: C, D, E, G, A)
  toggleMusic(onStateChange?: (playing: boolean) => void): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (this.isMusicPlaying) {
      if (this.bgmInterval) {
        window.clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
      this.isMusicPlaying = false;
      onStateChange?.(false);
      return false;
    } else {
      this.isMusicPlaying = true;
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      let step = 0;
      const melody = [0, 2, 4, 3, 2, 4, 5, 4, 3, 1, 2, 0];

      this.bgmInterval = window.setInterval(() => {
        if (!this.isMusicPlaying) return;
        const noteIdx = melody[step % melody.length];
        const freq = pentatonic[noteIdx] || 440;
        this.playTone(freq, 0.6, 'sine', 0.03);
        step++;
      }, 750);

      onStateChange?.(true);
      return true;
    }
  }
}

export const soundManager = new SoundManager();
