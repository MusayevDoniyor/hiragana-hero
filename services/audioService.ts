// Simple Web Audio API wrapper to generate UI sounds without external assets
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
const ctx = new AudioContextClass();

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) => {
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const playSound = {
  click: () => playTone(800, 'sine', 0.05, 0, 0.05),
  correct: () => {
    playTone(600, 'sine', 0.1, 0, 0.1);
    playTone(800, 'sine', 0.1, 0.1, 0.1);
    playTone(1200, 'sine', 0.3, 0.2, 0.1);
  },
  wrong: () => {
    playTone(300, 'sawtooth', 0.2, 0, 0.1);
    playTone(200, 'sawtooth', 0.3, 0.1, 0.1);
  },
  success: () => {
    playTone(400, 'triangle', 0.1, 0, 0.1);
    playTone(500, 'triangle', 0.1, 0.1, 0.1);
    playTone(600, 'triangle', 0.1, 0.2, 0.1);
    playTone(800, 'triangle', 0.4, 0.3, 0.1);
  },
  learned: () => {
    // A distinct magical chime for memorizing
    playTone(523.25, 'sine', 0.3, 0, 0.1); // C5
    playTone(659.25, 'sine', 0.3, 0.1, 0.1); // E5
    playTone(783.99, 'sine', 0.5, 0.2, 0.1); // G5
    playTone(1046.50, 'sine', 0.8, 0.3, 0.05); // C6
  },
  flip: () => {
     playTone(300, 'triangle', 0.05, 0, 0.05);
  },
  pop: () => playTone(600, 'sine', 0.05, 0, 0.05)
};
