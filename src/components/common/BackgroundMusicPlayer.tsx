import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Disc3,
  Coffee,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export interface CafeTrack {
  id: string;
  title: string;
  koreanTitle: string;
  artist: string;
  genre: string;
  description: string;
  src: string;
  approxDuration: string;
}

export const CAFE_PLAYLIST: CafeTrack[] = [
  {
    id: 'bossa-antigua',
    title: 'Bossa Antigua',
    koreanTitle: '보사노바 카페 라운지',
    artist: 'Kevin MacLeod',
    genre: 'Bossa Nova / Cafe Jazz',
    description: '따뜻한 커피 향이 감도는 여유로운 브런치 카페의 감미로운 보사노바',
    src: '/audio/bossa_antigua.mp3',
    approxDuration: '4:37',
  },
  {
    id: 'autumn-day',
    title: 'Autumn Day',
    koreanTitle: '가을날 햇살 카페',
    artist: 'Kevin MacLeod',
    genre: 'Acoustic Guitar / Cozy Cafe',
    description: '통창으로 햇살이 쏟아지는 아늑한 카페의 따뜻한 어쿠스틱 기타 선율',
    src: '/audio/autumn_day.mp3',
    approxDuration: '3:51',
  },
  {
    id: 'acid-jazz',
    title: 'Acid Jazz',
    koreanTitle: '성수동 라운지 재즈',
    artist: 'Kevin MacLeod',
    genre: 'Acid Jazz / Urban Lounge',
    description: '세련된 편집숍과 도심 속 트렌디한 라운지 카페 감성의 그루브 재즈',
    src: '/audio/acid_jazz.mp3',
    approxDuration: '3:32',
  },
];

/**
 * BackgroundMusicPlayer (감성 카페 BGM 에디션)
 * 저작권 없는 고품질 카페 음악 3곡 (보사노바, 어쿠스틱 기타, 애시드 재즈)
 * HTML5 Audio 기반 무손실 재생 및 백그라운드 연속 재생
 */
export const BackgroundMusicPlayer: React.FC = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35); // 카페 배경음 적정 볼륨 (35%)
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = CAFE_PLAYLIST[trackIndex];

  // 포맷 초 -> MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 트랙 변경 시 자동 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // 브라우저 정책 처리
        });
    }
  }, [trackIndex]);

  // 볼륨 및 음소거 동기화
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 사이트 열림과 동시에 자동 재생 시도 & 브라우저 정책(Autoplay block) 우회 이벤트
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const tryAutoPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // 브라우저 차단 시 첫 인터랙션 시 자동 재생 등록
          const unlockAudio = () => {
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {});
          };

          window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
          window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
          window.addEventListener('scroll', unlockAudio, { once: true, passive: true });
        });
    };

    tryAutoPlay();

    return () => {
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Audio playback error:', err);
        });
    }
  };

  const nextTrack = () => {
    const nextIdx = (trackIndex + 1) % CAFE_PLAYLIST.length;
    setTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIdx = (trackIndex - 1 + CAFE_PLAYLIST.length) % CAFE_PLAYLIST.length;
    setTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
  };

  return (
    <aside
      className="fixed bottom-6 left-6 z-50 transition-all duration-300 font-sans"
      aria-label="DASSOBA 감성 카페 음악 플레이어"
    >
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex flex-col bg-neutral-950/90 hover:bg-neutral-950/95 text-white backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all overflow-hidden w-[310px] sm:w-[340px]">
        {/* Main Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          {/* Animated Vinyl Disc / Play Button */}
          <button
            onClick={togglePlay}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#721b29] to-[#9e273b] hover:from-[#882133] hover:to-[#b32e44] text-white transition-all shadow-md shrink-0 focus:outline-none group"
            title={isPlaying ? '음악 일시정지' : '카페 음악 재생'}
          >
            <Disc3
              className={`w-5 h-5 transition-transform ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-80'
              }`}
            />
            {/* Center dot/indicator */}
            <span
              className={`absolute w-2 h-2 rounded-full ${
                isPlaying ? 'bg-amber-300 animate-ping opacity-75' : 'bg-white/70'
              }`}
            />
          </button>

          {/* Track Info (Clickable for Expand) */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 min-w-0 cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded tracking-wider">
                <Coffee className="w-2.5 h-2.5" /> CAFE BGM
              </span>
              <span className="text-white/40 text-[9px]">•</span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {trackIndex + 1}/{CAFE_PLAYLIST.length}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-[1.5px] h-2.5 ml-auto mr-1">
                  <span className="w-[2px] bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                  <span className="w-[2px] bg-rose-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2/3" />
                  <span className="w-[2px] bg-amber-300 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-4/5" />
                </div>
              )}
            </div>

            <div className="text-xs font-semibold text-white truncate leading-tight mt-0.5">
              {currentTrack.koreanTitle}
              <span className="text-[10px] text-neutral-400 font-normal ml-1">
                ({currentTrack.title})
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              {currentTrack.artist} • {currentTrack.genre}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1 shrink-0 text-neutral-300">
            <button
              onClick={prevTrack}
              className="p-1 hover:text-white transition-colors"
              title="이전 곡"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-1 hover:text-white transition-colors"
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-1 hover:text-white transition-colors"
              title="다음 곡"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:text-white transition-colors text-neutral-400"
              title={isExpanded ? '플레이어 접기' : '플레이어 펼치기'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (Always thin on top of expanded or bottom of bar) */}
        <div className="w-full bg-white/10 h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-[#9e273b] transition-all duration-200"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>

        {/* Expandable Panel: Track list, seek bar, volume & mood info */}
        {isExpanded && (
          <div className="px-3.5 pb-3.5 pt-2.5 border-t border-white/10 text-xs space-y-3 bg-black/40">
            {/* Seek control */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Current Track Description */}
            <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/10 text-[11px] text-amber-100/90 leading-relaxed">
              ☕ {currentTrack.description}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-400">
              <span className="text-[10px]">볼륨</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#9e273b]"
              />
              <span className="font-mono w-7 text-right">
                {isMuted ? 'OFF' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Track Selection List */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold px-1">
                <span>카페 플레이리스트 (3곡)</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles className="w-2.5 h-2.5" /> 저작권 무료
                </span>
              </div>

              {CAFE_PLAYLIST.map((t, idx) => {
                const isActive = trackIndex === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#721b29] to-[#882133] text-white font-bold shadow'
                        : 'hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] opacity-70 w-3">{idx + 1}</span>
                      <div className="truncate">
                        <div className="truncate font-medium">{t.koreanTitle}</div>
                        <div className="text-[9px] opacity-70 truncate font-light">
                          {t.title} • {t.genre}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 shrink-0 ml-2">
                      {t.approxDuration}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Attribution note */}
            <p className="text-[9px] text-neutral-500 pt-1 leading-normal border-t border-white/5">
              License: Creative Commons By Attribution 4.0 (Kevin MacLeod / incompetech.com)
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
