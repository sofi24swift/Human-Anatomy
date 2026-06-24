// Playful synthesizer using the Web Audio API for gamified school kids sound effects.
// Does not load heavy audio file assets.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playSound(type: 'success' | 'fail' | 'click' | 'powerup' | 'pop') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Resume context if suspended (browser security autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'success':
        // Friendly double-chirp chime (rising)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);

        setTimeout(() => {
          const osc2 = ctx!.createOscillator();
          const gainNode2 = ctx!.createGain();
          osc2.connect(gainNode2);
          gainNode2.connect(ctx!.destination);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(660, ctx!.currentTime); // E5
          osc2.frequency.exponentialRampToValueAtTime(1320, ctx!.currentTime + 0.2); // E6
          gainNode2.gain.setValueAtTime(0.15, ctx!.currentTime);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx!.currentTime + 0.3);
          osc2.start(ctx!.currentTime);
          osc2.stop(ctx!.currentTime + 0.3);
        }, 110);
        break;

      case 'fail':
        // Sad sliding buzz (falling)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.linearRampToValueAtTime(110, now + 0.4); // A2
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'click':
        // Short snappy bubble pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'pop':
        // Playful pop bubble
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
        break;

      case 'powerup':
        // Uplifting retro arcade power-up
        osc.type = 'square';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(329.63, now + 0.07); // E4
        osc.frequency.setValueAtTime(392.00, now + 0.14); // G4
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.28); // G5
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
    }
  } catch (err) {
    console.warn('Audio effects not supported or blocked by browser', err);
  }
}
export default playSound;
