import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  SkipForward,
  SkipBack,
} from 'lucide-react';

interface Note {
  pitch: number; // Hz (0 for rest)
  duration: number; // beats
}

interface ClassicalTrack {
  id: string;
  title: string;
  composer: string;
  description: string;
  bpm: number;
  melody: Note[];
  bass: Note[];
}

// 1. 비발디 - 사계 중 '봄' 1악장 (E Major, Allegro) - 매우 경쾌하고 밝은 바로크 클래식
const VIVALDI_SPRING: ClassicalTrack = {
  id: 'spring',
  title: "사계 제1번 '봄' (Spring Allegro)",
  composer: '안토니오 비발디 (A. Vivaldi)',
  description: '봄의 생동감과 화사함을 노래하는 경쾌하고 즐거운 클래식 대표곡',
  bpm: 112,
  melody: [
    // Theme 1
    { pitch: 329.63, duration: 1.0 }, // E4
    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 415.3, duration: 1.0 },  // G#4
    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 329.63, duration: 0.5 }, // E4
    { pitch: 493.88, duration: 2.0 }, // B4

    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 329.63, duration: 0.5 }, // E4
    { pitch: 493.88, duration: 2.0 }, // B4

    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 369.99, duration: 2.0 }, // F#4

    // Variation
    { pitch: 329.63, duration: 0.5 }, // E4
    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 415.3, duration: 1.0 },  // G#4
    { pitch: 415.3, duration: 1.0 },  // G#4
    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 329.63, duration: 0.5 }, // E4
    { pitch: 622.25, duration: 2.0 }, // D#5

    { pitch: 329.63, duration: 1.0 }, // E4
    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 415.3, duration: 0.5 },  // G#4
    { pitch: 415.3, duration: 1.0 },  // G#4
    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 329.63, duration: 0.5 }, // E4
    { pitch: 493.88, duration: 2.0 }, // B4
  ],
  bass: [
    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3
    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3

    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3
    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3

    { pitch: 220.0, duration: 1.0 },  // A3
    { pitch: 246.94, duration: 1.0 }, // B3
    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3

    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3
    { pitch: 123.47, duration: 2.0 }, // B2

    { pitch: 164.81, duration: 1.0 }, // E3
    { pitch: 246.94, duration: 1.0 }, // B3
    { pitch: 164.81, duration: 2.0 }, // E3
  ],
};

// 2. 모차르트 - 아이네 클라이네 나흐트무지크 (G Major, Allegro) - 발랄하고 경쾌한 명곡
const MOZART_EINE_KLEINE: ClassicalTrack = {
  id: 'mozart',
  title: '아이네 클라이네 나흐트무지크',
  composer: 'W. A. 모차르트 (Mozart)',
  description: '우아한 궁정 살롱의 흥겨움과 밝은 활력을 선사하는 경쾌한 명곡',
  bpm: 124,
  melody: [
    { pitch: 392.0, duration: 0.75 }, // G4
    { pitch: 0, duration: 0.25 },
    { pitch: 293.66, duration: 0.5 }, // D4
    { pitch: 0, duration: 0.5 },
    { pitch: 392.0, duration: 0.75 }, // G4
    { pitch: 0, duration: 0.25 },
    { pitch: 293.66, duration: 0.5 }, // D4
    { pitch: 0, duration: 0.5 },

    { pitch: 392.0, duration: 0.5 },  // G4
    { pitch: 293.66, duration: 0.5 }, // D4
    { pitch: 392.0, duration: 0.5 },  // G4
    { pitch: 493.88, duration: 0.5 }, // B4
    { pitch: 587.33, duration: 2.0 }, // D5

    { pitch: 523.25, duration: 0.75 }, // C5
    { pitch: 0, duration: 0.25 },
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 0, duration: 0.5 },
    { pitch: 523.25, duration: 0.75 }, // C5
    { pitch: 0, duration: 0.25 },
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 0, duration: 0.5 },

    { pitch: 523.25, duration: 0.5 }, // C5
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 369.99, duration: 0.5 }, // F#4
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 293.66, duration: 2.0 }, // D4

    { pitch: 493.88, duration: 0.5 }, // B4
    { pitch: 523.25, duration: 0.5 }, // C5
    { pitch: 587.33, duration: 1.0 }, // D5
    { pitch: 523.25, duration: 0.5 }, // C5
    { pitch: 493.88, duration: 0.5 }, // B4
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 392.0, duration: 1.5 },  // G4
  ],
  bass: [
    { pitch: 196.0, duration: 1.0 },  // G3
    { pitch: 146.83, duration: 1.0 }, // D3
    { pitch: 196.0, duration: 1.0 },  // G3
    { pitch: 146.83, duration: 1.0 }, // D3

    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 146.83, duration: 2.0 }, // D3

    { pitch: 174.61, duration: 1.0 }, // F3
    { pitch: 220.0, duration: 1.0 },  // A3
    { pitch: 174.61, duration: 1.0 }, // F3
    { pitch: 220.0, duration: 1.0 },  // A3

    { pitch: 146.83, duration: 2.0 }, // D3
    { pitch: 196.0, duration: 2.0 },  // G3

    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 146.83, duration: 2.0 }, // D3
  ],
};

// 3. 베토벤 - 환희의 송가 (Ode to Joy) - 희망차고 즐거운 축제의 선율
const BEETHOVEN_JOY: ClassicalTrack = {
  id: 'joy',
  title: "교향곡 제9번 '환희의 송가'",
  composer: 'L. v. 베토벤 (Beethoven)',
  description: '모두가 함께 기뻐하고 환희를 나누는 웅장하고 밝은 클래식 선율',
  bpm: 116,
  melody: [
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 523.25, duration: 1.0 }, // C5
    { pitch: 587.33, duration: 1.0 }, // D5
    { pitch: 587.33, duration: 1.0 }, // D5
    { pitch: 523.25, duration: 1.0 }, // C5
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 440.0, duration: 1.0 },  // A4

    { pitch: 392.0, duration: 1.0 },  // G4
    { pitch: 392.0, duration: 1.0 },  // G4
    { pitch: 440.0, duration: 1.0 },  // A4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 493.88, duration: 1.5 }, // B4
    { pitch: 440.0, duration: 0.5 },  // A4
    { pitch: 440.0, duration: 2.0 },  // A4

    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 523.25, duration: 1.0 }, // C5
    { pitch: 587.33, duration: 1.0 }, // D5
    { pitch: 587.33, duration: 1.0 }, // D5
    { pitch: 523.25, duration: 1.0 }, // C5
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 440.0, duration: 1.0 },  // A4

    { pitch: 392.0, duration: 1.0 },  // G4
    { pitch: 392.0, duration: 1.0 },  // G4
    { pitch: 440.0, duration: 1.0 },  // A4
    { pitch: 493.88, duration: 1.0 }, // B4
    { pitch: 440.0, duration: 1.5 },  // A4
    { pitch: 392.0, duration: 0.5 },  // G4
    { pitch: 392.0, duration: 2.0 },  // G4
  ],
  bass: [
    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 146.83, duration: 2.0 }, // D3
    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 220.0, duration: 2.0 },  // A3

    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 220.0, duration: 2.0 },  // A3
    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 146.83, duration: 2.0 }, // D3

    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 146.83, duration: 2.0 }, // D3
    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 220.0, duration: 2.0 },  // A3

    { pitch: 196.0, duration: 2.0 },  // G3
    { pitch: 220.0, duration: 2.0 },  // A3
    { pitch: 146.83, duration: 2.0 }, // D3
    { pitch: 196.0, duration: 2.0 },  // G3
  ],
};

const PLAYLIST: ClassicalTrack[] = [VIVALDI_SPRING, MOZART_EINE_KLEINE, BEETHOVEN_JOY];

/**
 * BackgroundMusicPlayer (즐거운 클래식 음악 에디션)
 * 비발디 '봄', 모차르트 '아이네 클라이네 나흐트무지크', 베토벤 '환희의 송가'
 * Web Audio API를 활용한 클래식 현악/하프시코드 다성음악 신디사이저
 */
export const BackgroundMusicPlayer: React.FC = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const scheduledTimeRef = useRef<number>(0);
  const loopTimerRef = useRef<number | null>(null);

  const currentTrack = PLAYLIST[trackIndex];

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.22, ctx.currentTime); // 즐겁고 우아한 적정 볼륨
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }
    return audioCtxRef.current;
  };

  // Play violin/flute string melody note
  const playViolinNote = (pitch: number, startTime: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain || pitch <= 0) return;

    // Sawtooth + Triangle blend for cheerful classical strings
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(pitch, startTime);
    osc2.frequency.setValueAtTime(pitch, startTime);

    // Subtle classical vibrato on longer notes
    if (duration > 0.4) {
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(5.8, startTime); // 5.8Hz vibrato
      vibratoGain.gain.setValueAtTime(2.2, startTime);
      vibrato.connect(osc1.frequency);
      vibrato.connect(osc2.frequency);
      vibrato.start(startTime + 0.15);
      vibrato.stop(startTime + duration);
    }

    // Warm high-cut filter for salon sweetness
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    // Dynamic Bowing Envelope (crisp staccato/legato)
    const noteGain = ctx.createGain();
    const attack = 0.04;
    const release = Math.min(0.08, duration * 0.2);

    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.12, startTime + attack);
    noteGain.gain.setValueAtTime(0.11, startTime + duration - release);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  };

  // Play Harpsichord/Cello Basso Continuo note
  const playHarpsichordBass = (pitch: number, startTime: number, duration: number) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain || pitch <= 0) return;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, startTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);

    // Harpsichord plucky attack
    const bassGain = ctx.createGain();
    bassGain.gain.setValueAtTime(0.001, startTime);
    bassGain.gain.linearRampToValueAtTime(0.09, startTime + 0.015);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.min(duration, 0.45));

    osc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + Math.min(duration, 0.5));
  };

  // Schedule a complete performance of the current piece
  const scheduleTrack = (track: ClassicalTrack) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlayingRef.current) return;

    const secondsPerBeat = 60 / track.bpm;
    const startTime = Math.max(ctx.currentTime + 0.1, scheduledTimeRef.current);

    // Schedule Melody
    let melodyCursor = startTime;
    track.melody.forEach((note) => {
      const noteDuration = note.duration * secondsPerBeat;
      if (note.pitch > 0) {
        playViolinNote(note.pitch, melodyCursor, noteDuration * 0.95);
      }
      melodyCursor += noteDuration;
    });

    // Schedule Bass Accompaniment
    let bassCursor = startTime;
    track.bass.forEach((note) => {
      const noteDuration = note.duration * secondsPerBeat;
      if (note.pitch > 0) {
        playHarpsichordBass(note.pitch, bassCursor, noteDuration);
      }
      bassCursor += noteDuration;
    });

    const totalDuration = Math.max(melodyCursor - startTime, bassCursor - startTime);
    scheduledTimeRef.current = startTime + totalDuration;

    // Loop or continue
    const timeoutMs = (totalDuration - 0.2) * 1000;
    loopTimerRef.current = window.setTimeout(() => {
      if (isPlayingRef.current) {
        scheduleTrack(track);
      }
    }, Math.max(100, timeoutMs));
  };

  const startMusic = async (trackToPlay = currentTrack) => {
    try {
      const ctx = initAudio();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Stop any existing loop
      if (loopTimerRef.current) {
        clearTimeout(loopTimerRef.current);
        loopTimerRef.current = null;
      }

      isPlayingRef.current = true;
      setIsPlaying(true);
      scheduledTimeRef.current = ctx.currentTime + 0.1;

      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(isMuted ? 0.0001 : 0.22, ctx.currentTime);
      }

      scheduleTrack(trackToPlay);
    } catch {
      // Browser autoplay policy
    }
  };

  const stopMusic = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic(currentTrack);
    }
  };

  const nextTrack = () => {
    const nextIdx = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(nextIdx);
    if (isPlaying) {
      stopMusic();
      setTimeout(() => {
        startMusic(PLAYLIST[nextIdx]);
      }, 150);
    }
  };

  const prevTrack = () => {
    const prevIdx = (trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setTrackIndex(prevIdx);
    if (isPlaying) {
      stopMusic();
      setTimeout(() => {
        startMusic(PLAYLIST[prevIdx]);
      }, 150);
    }
  };

  const toggleMute = () => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (isMuted) {
      masterGainRef.current.gain.setValueAtTime(0.22, ctx.currentTime);
      setIsMuted(false);
    } else {
      masterGainRef.current.gain.setValueAtTime(0.0001, ctx.currentTime);
      setIsMuted(true);
    }
  };

  // Immediate Autoplay on load, with silent unlock on first user click/touch/scroll
  useEffect(() => {
    startMusic(PLAYLIST[0]);

    const handleFirstInteraction = () => {
      if (!isPlayingRef.current) {
        startMusic(PLAYLIST[0]);
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
      className="fixed bottom-6 left-6 z-50 transition-all duration-300 font-sans"
      aria-label="DASSOBA 클래식 음악 플레이어"
    >
      <div className="flex flex-col bg-neutral-900/95 hover:bg-neutral-900 text-white backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-all overflow-hidden max-w-[320px]">
        {/* Main Control Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          {/* Animated Equalizer / Play Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#721b29] hover:bg-[#8b2434] text-white transition-all shadow-md shrink-0 focus:outline-none"
            title={isPlaying ? '음악 일시정지' : '클래식 음악 재생'}
          >
            {isPlaying ? (
              <div className="flex items-end gap-[2px] h-3.5 w-3.5">
                <span className="w-[3px] bg-white rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-full" />
                <span className="w-[3px] bg-amber-200 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2/3" />
                <span className="w-[3px] bg-white rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-4/5" />
              </div>
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Track Info (Clickable for Expand) */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 min-w-0 cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                CLASSIC
              </span>
              <span className="text-white/40 text-[9px]">•</span>
              <span className="text-[10px] text-neutral-300 font-mono">
                {trackIndex + 1}/{PLAYLIST.length}
              </span>
            </div>
            <div className="text-xs font-serif font-bold text-white truncate leading-tight">
              {currentTrack.title}
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              {currentTrack.composer}
            </div>
          </div>

          {/* Quick Prev / Next Track */}
          <div className="flex items-center gap-1 shrink-0 text-neutral-300">
            <button
              onClick={prevTrack}
              className="p-1 hover:text-white transition-colors"
              title="이전 클래식 곡"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextTrack}
              className="p-1 hover:text-white transition-colors"
              title="다음 클래식 곡"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors ml-0.5"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Track List & Mood Details */}
        {isExpanded && (
          <div className="px-3.5 pb-3 pt-1 border-t border-white/10 text-xs space-y-2 bg-black/30">
            <p className="text-[11px] text-amber-100/80 leading-relaxed font-light">
              🎻 {currentTrack.description}
            </p>

            <div className="space-y-1 pt-1">
              {PLAYLIST.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTrackIndex(idx);
                    if (isPlaying) {
                      stopMusic();
                      setTimeout(() => startMusic(PLAYLIST[idx]), 150);
                    } else {
                      startMusic(PLAYLIST[idx]);
                    }
                  }}
                  className={`w-full text-left p-1.5 rounded flex items-center justify-between text-[11px] transition-colors ${
                    trackIndex === idx
                      ? 'bg-[#721b29] text-white font-bold'
                      : 'hover:bg-white/10 text-neutral-300'
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  <span className="text-[10px] opacity-75 shrink-0 ml-2">{t.composer.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
