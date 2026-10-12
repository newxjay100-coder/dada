import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';

/**
 * BackgroundMusicPlayer
 * 사이트 접속 시 자동으로 재생되는 하이엔드 패션 라운지 잔잔한 앰비언트 BGM 플레이어
 * Web Audio API를 활용하여 외부 네트워크 지연이나 끊김 없이 순수하고 따뜻한 코드 진행 재생
 */
export const BackgroundMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Soothing warm chord progression (Hz) for gentle luxury boutique fashion lounge
  // Fmaj7 -> Em7 -> Dm7 -> Cmaj7
  const chords = [
    [174.61, 220.0, 261.63, 329.63], // F, A, C, E (Fmaj7)
    [164.81, 196.0, 246.94, 293.66], // E, G, B, D (Em7)
    [146.83, 174.61, 220.0, 261.63], // D, F, A, C (Dm7)
    [130.81, 164.81, 196.0, 246.94], // C, E, G, B (Cmaj7)
  ];
  const chordIndexRef = useRef(0);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime); // gentle initial volume
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }
    return audioCtxRef.current;
  };

  // Play a single soft ambient chord
  const playChord = (freqs: number[], duration = 4.2) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain || !isPlayingRef.current) return;

    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      // Warm Sine & Soft Triangle Oscillators
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass Filter for soft, mellow velvet tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + idx * 80, now);
      filter.Q.setValueAtTime(1.5, now);

      // Gentle Envelope (Slow attack, long smooth decay)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / freqs.length, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  };

  // Chord progression loop
  const startLoop = () => {
    if (!isPlayingRef.current) return;
    const currentChord = chords[chordIndexRef.current];
    playChord(currentChord, 4.2);
    chordIndexRef.current = (chordIndexRef.current + 1) % chords.length;

    timerRef.current = window.setTimeout(() => {
      startLoop();
    }, 4000);
  };

  const startMusic = async () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      isPlayingRef.current = true;
      setIsPlaying(true);
      setHasStartedOnce(true);

      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGainRef.current.gain.exponentialRampToValueAtTime(
          isMuted ? 0.0001 : 0.18,
          ctx.currentTime + 1.5
        );
      }

      startLoop();
    } catch {
      // Autoplay blocked by browser policy until interaction
    }
  };

  const stopMusic = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  const toggleMute = () => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (isMuted) {
      masterGainRef.current.gain.setValueAtTime(0.18, ctx.currentTime);
      setIsMuted(false);
    } else {
      masterGainRef.current.gain.setValueAtTime(0.0001, ctx.currentTime);
      setIsMuted(true);
    }
  };

  // Attempt autoplay immediately on mount, with silent auto-resume on first interaction
  useEffect(() => {
    // 1. Try immediate autoplay
    startMusic();

    // 2. Fallback: if browser blocked autoplay before user gesture, start on first click/touch/scroll
    const handleFirstInteraction = () => {
      if (!isPlayingRef.current) {
        startMusic();
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      stopMusic();
    };
  }, []);

  return (
    <aside
      className="fixed bottom-6 left-6 z-50 transition-all duration-300"
      aria-label="DASSOBA 라운지 배경음악 제어"
    >
      <div className="flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-900 text-white backdrop-blur-md px-3.5 py-2.5 rounded-full border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all">
        {/* Animated Sound Wave Bars when Playing */}
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 focus:outline-none group text-amber-200"
          title={isPlaying ? '음악 일시정지' : '음악 재생'}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[3px] h-3.5 w-4 mr-0.5">
              <span className="w-1 bg-[#d8cfc4] rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-full" />
              <span className="w-1 bg-[#721b29] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-2/3" />
              <span className="w-1 bg-amber-200 rounded-full animate-[pulse_1.3s_ease-in-out_infinite] h-4/5" />
            </div>
          ) : (
            <Play className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
          )}
        </button>

        {/* Music Information */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer select-none flex items-center gap-1.5 text-[11px]"
        >
          <span className="font-serif font-bold text-neutral-200 tracking-tight flex items-center gap-1">
            <Music className="w-3 h-3 text-[#721b29]" />
            <span>BGM</span>
          </span>
          <span className="text-neutral-400 font-light hidden sm:inline">|</span>
          <span className="text-neutral-300 font-light text-[10px] hidden sm:inline max-w-[150px] truncate">
            {isPlaying ? 'Gentle Atelier Lounge' : '재생 대기중'}
          </span>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1 hover:text-white text-neutral-400 transition-colors ml-1"
          title={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-1 hover:text-white text-neutral-400 transition-colors"
          title={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
};
