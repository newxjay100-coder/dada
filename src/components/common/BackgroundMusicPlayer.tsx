import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Disc,
  Radio,
  Sparkles,
  Zap,
  Coffee,
  Flame,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Move,
  Mic,
  RotateCcw,
} from 'lucide-react';

export type ChannelId = 'hiphop' | 'funk' | 'cafe';

export interface CyberTrack {
  id: string;
  title: string;
  koreanTitle: string;
  artist: string;
  genre: string;
  channel: ChannelId;
  description: string;
  src: string;
  duration: string;
  bpm?: number;
}

export const TRACK_CHANNELS: { id: ChannelId; name: string; shortName: string; icon: React.ElementType }[] = [
  { id: 'hiphop', name: '🎤 힙합 & 랩 (BOOM-BAP & RAP)', shortName: '힙합 & 랩', icon: Mic },
  { id: 'funk', name: '🔥 펑키 힙합 (CYBER FUNK)', shortName: '펑키 힙합', icon: Zap },
  { id: 'cafe', name: '☕ 감성 카페 (COZY CAFE)', shortName: '감성 카페', icon: Coffee },
];

export const ALL_TRACKS: CyberTrack[] = [
  // Channel 1: 힙합 & 랩 (HIP-HOP & RAP - 3곡)
  {
    id: 'griphop',
    title: 'Griphop',
    koreanTitle: '그립합 붐뱁 랩 비트',
    artist: 'Kevin MacLeod',
    genre: 'Boom-Bap / Underground Rap Beat',
    channel: 'hiphop',
    description: '묵직한 붐뱁 드럼 킥과 힙합 스트링 루프가 돋보이는 정통 언더그라운드 랩 비트',
    src: '/audio/griphop.mp3',
    duration: '3:39',
    bpm: 90,
  },
  {
    id: 'galactic-rap',
    title: 'Galactic Rap',
    koreanTitle: '사이버 갤럭틱 랩',
    artist: 'Kevin MacLeod',
    genre: 'Cyber Rap / Electro Hip-Hop',
    channel: 'hiphop',
    description: '미래지향적인 사이버 신디사이저와 빠른 플로우의 일렉트로 힙합 랩 비트',
    src: '/audio/galactic_rap.mp3',
    duration: '1:58',
    bpm: 120,
  },
  {
    id: 'ice-flow',
    title: 'Ice Flow',
    koreanTitle: '아이스 플로우 808 랩',
    artist: 'Kevin MacLeod',
    genre: '808 Chill Rap / Urban Trap Beat',
    channel: 'hiphop',
    description: '딥 808 베이스와 칠(Chill)한 감성이 어우러진 감각적인 어반 트랩 랩 비트',
    src: '/audio/ice_flow.mp3',
    duration: '2:28',
    bpm: 70,
  },
  // Channel 2: 펑키 힙합 (CYBER FUNK HIP-HOP - 3곡)
  {
    id: 'who-likes-to-party',
    title: 'Who Likes to Party',
    koreanTitle: '파티 펑키 힙합',
    artist: 'Kevin MacLeod',
    genre: 'Funky Disco / Party Hip-Hop',
    channel: 'funk',
    description: '중독적인 슬랩 베이스와 신나는 브라스 섹션의 익스트림 펑키 힙합 트랙',
    src: '/audio/who_likes_to_party.mp3',
    duration: '4:16',
    bpm: 117,
  },
  {
    id: 'funkorama',
    title: 'Funkorama',
    koreanTitle: '레트로 펑크 그루브',
    artist: 'Kevin MacLeod',
    genre: '90s Funky Hip-Hop / Breakbeat',
    channel: 'funk',
    description: '와와 기타와 리드미컬한 브레이크비트가 어우러진 올드스쿨 펑키 힙합',
    src: '/audio/funkorama.mp3',
    duration: '3:25',
    bpm: 104,
  },
  {
    id: 'funky-chunk',
    title: 'Funky Chunk',
    koreanTitle: '헤비 펑키 클라비넷',
    artist: 'Kevin MacLeod',
    genre: 'Heavy Funk / Cyber Breakbeat',
    channel: 'funk',
    description: '사이버틱한 클라비넷 사운드와 묵직한 힙합 킥드럼이 폭발하는 헤비 펑크 비트',
    src: '/audio/funky_chunk.mp3',
    duration: '3:11',
    bpm: 120,
  },
  // Channel 3: 감성 카페 (COZY CAFE - 3곡)
  {
    id: 'bossa-antigua',
    title: 'Bossa Antigua',
    koreanTitle: '보사노바 카페 라운지',
    artist: 'Kevin MacLeod',
    genre: 'Bossa Nova / Cafe Jazz',
    channel: 'cafe',
    description: '따뜻한 커피 향이 감도는 여유로운 브런치 카페의 감미로운 보사노바',
    src: '/audio/bossa_antigua.mp3',
    duration: '4:37',
    bpm: 115,
  },
  {
    id: 'autumn-day',
    title: 'Autumn Day',
    koreanTitle: '가을날 햇살 카페',
    artist: 'Kevin MacLeod',
    genre: 'Acoustic Guitar / Cozy Cafe',
    channel: 'cafe',
    description: '통창으로 햇살이 쏟아지는 아늑한 카페의 따뜻한 어쿠스틱 기타 선율',
    src: '/audio/autumn_day.mp3',
    duration: '3:51',
    bpm: 95,
  },
  {
    id: 'acid-jazz',
    title: 'Acid Jazz',
    koreanTitle: '성수동 라운지 재즈',
    artist: 'Kevin MacLeod',
    genre: 'Acid Jazz / Urban Lounge',
    channel: 'cafe',
    description: '세련된 편집숍과 도심 속 트렌디한 라운지 카페 감성의 그루브 재즈',
    src: '/audio/acid_jazz.mp3',
    duration: '3:32',
    bpm: 108,
  },
];

/**
 * BackgroundMusicPlayer (사이버펑크 홀로그래픽 CD 에디션)
 * - 실물 CD 홀로그램 굴절 광택 디스크 & 3개 장르 채널 (힙합/랩, 펑키힙합, 감성카페) 총 9곡
 * - 마우스/터치 드래그로 화면 어디든 자유롭게 위치 변경 및 위치 저장 기능
 */
export const BackgroundMusicPlayer: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<ChannelId>('hiphop');
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 위치 및 드래그 상태
  const containerRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('dassoba_cd_player_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
    hasMoved: boolean;
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 화면 경계 내로 위치 제한
  const clampPosition = (x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    const w = containerRef.current?.offsetWidth || 340;
    const h = containerRef.current?.offsetHeight || 72;
    const maxX = Math.max(8, window.innerWidth - w - 8);
    const maxY = Math.max(8, window.innerHeight - h - 8);
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(8, y), maxY),
    };
  };

  // 초기 위치 설정 및 윈도우 리사이즈 대응
  useEffect(() => {
    if (position === null && typeof window !== 'undefined') {
      const defaultY = Math.max(12, window.innerHeight - 90);
      const defaultX = 24;
      setPosition({ x: defaultX, y: defaultY });
    }

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        return clampPosition(prev.x, prev.y);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 마우스/터치 드래그 시작
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // 좌클릭만 허용
    const currentPos = position || { x: 24, y: window.innerHeight - 90 };
    
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentPos.x,
      posY: currentPos.y,
      hasMoved: false,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!dragInfoRef.current) return;
      const dx = ev.clientX - dragInfoRef.current.startX;
      const dy = ev.clientY - dragInfoRef.current.startY;
      if (Math.hypot(dx, dy) > 4) {
        dragInfoRef.current.hasMoved = true;
        setIsDragging(true);
      }
      const newX = dragInfoRef.current.posX + dx;
      const newY = dragInfoRef.current.posY + dy;
      const clamped = clampPosition(newX, newY);
      setPosition(clamped);
    };

    const handlePointerUp = () => {
      if (dragInfoRef.current) {
        if (dragInfoRef.current.hasMoved) {
          setPosition((latest) => {
            if (latest) {
              try {
                localStorage.setItem('dassoba_cd_player_pos', JSON.stringify(latest));
              } catch (err) {}
            }
            return latest;
          });
        }
        // 드래그 종료 직후 클릭 이벤트 방지를 위해 딜레이
        setTimeout(() => {
          setIsDragging(false);
          dragInfoRef.current = null;
        }, 60);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // 위치 리셋 (좌측 하단)
  const resetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultY = Math.max(12, window.innerHeight - 90);
    const defaultX = 24;
    const defPos = { x: defaultX, y: defaultY };
    setPosition(defPos);
    try {
      localStorage.setItem('dassoba_cd_player_pos', JSON.stringify(defPos));
    } catch (err) {}
  };

  // 현재 채널 트랙 리스트
  const currentChannelTracks = ALL_TRACKS.filter((t) => t.channel === activeChannel);
  const currentTrack = currentChannelTracks[trackIndex] || currentChannelTracks[0];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 트랙 변경 시 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [trackIndex, activeChannel]);

  // 볼륨 및 음소거
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 사이트 열림과 동시 자동 재생 시도 & 브라우저 정책 우회
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
          const unlock = () => {
            audio
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          };
          window.addEventListener('pointerdown', unlock, { once: true, passive: true });
          window.addEventListener('keydown', unlock, { once: true, passive: true });
          window.addEventListener('scroll', unlock, { once: true, passive: true });
        });
    };

    tryAutoPlay();

    return () => {
      audio.pause();
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging || dragInfoRef.current?.hasMoved) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Play error:', err));
    }
  };

  const nextTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging) return;
    const nextIdx = (trackIndex + 1) % currentChannelTracks.length;
    setTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const prevTrack = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging) return;
    const prevIdx = (trackIndex - 1 + currentChannelTracks.length) % currentChannelTracks.length;
    setTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging) return;
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

  // 화면 위치에 따른 확장 방향 (화면 하단이면 위쪽으로, 상단이면 아래쪽으로 펼침)
  const isNearBottom = position ? position.y > (typeof window !== 'undefined' ? window.innerHeight / 2 : 400) : true;

  return (
    <aside
      ref={containerRef}
      style={
        position
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 9999,
            }
          : {
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              zIndex: 9999,
            }
      }
      className={`font-sans select-none transition-shadow ${
        isDragging ? 'opacity-95 cursor-grabbing drop-shadow-[0_0_25px_rgba(0,240,255,0.7)]' : ''
      }`}
      aria-label="DASSOBA 사이버펑크 CD 음악 컨트롤러 (마우스 드래그로 위치 이동 가능)"
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => nextTrack()}
      />

      <div className={`flex items-start gap-2 ${isNearBottom ? 'flex-col-reverse' : 'flex-col'}`}>
        {/* Main Floating CD Widget Bar */}
        <div
          onPointerDown={handlePointerDown}
          className={`flex items-center gap-2.5 bg-[#0d0d1a]/95 hover:bg-[#111122] text-white backdrop-blur-xl p-2 pr-4 rounded-full border transition-all ${
            isDragging
              ? 'border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.5)] scale-[1.02]'
              : 'border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
          }`}
        >
          {/* DRAG HANDLE GRIP (마우스 드래그 손잡이) */}
          <div
            onPointerDown={handlePointerDown}
            className="flex items-center justify-center pl-1 pr-0.5 text-neutral-400 hover:text-cyan-300 cursor-grab active:cursor-grabbing transition-colors group"
            title="마우스로 드래그하여 플레이어를 화면 원하는 위치로 이동하세요"
          >
            <GripVertical className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-300 transition-transform group-hover:scale-110" />
          </div>

          {/* REALISTIC HOLOGRAPHIC CD DISC (실물 홀로그램 CD 디스크) */}
          <div
            onClick={togglePlay}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer group shrink-0 transition-transform hover:scale-105"
            title={isPlaying ? '클릭: 음악 일시정지' : '클릭: CD 재생'}
          >
            {/* CD Outer Bevel Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-purple-500/30 to-pink-500/40 blur-xs" />

            {/* The Rotating CD Body */}
            <div
              className={`relative w-full h-full rounded-full overflow-hidden border border-white/40 shadow-[0_6px_16px_rgba(0,0,0,0.6)] ${
                isPlaying ? 'animate-cd-spin' : ''
              }`}
              style={{
                background:
                  'radial-gradient(circle, #2a2a3e 0%, #151522 55%, #0d0d17 100%)',
              }}
            >
              {/* Conic Rainbow Holographic Refraction (무지갯빛 스펙트럼 굴절 광택) */}
              <div
                className="absolute inset-0 rounded-full opacity-65 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 120deg at 50% 50%, rgba(255,0,128,0.5) 0deg, rgba(255,140,0,0.4) 45deg, rgba(255,240,0,0.4) 90deg, rgba(0,240,255,0.55) 150deg, rgba(0,128,255,0.45) 200deg, rgba(160,32,240,0.5) 260deg, rgba(255,0,128,0.5) 360deg)',
                }}
              />

              {/* Data Track Micro-Grooves (CD 데이터 트랙 홈) */}
              <div
                className="absolute inset-[6px] rounded-full border border-white/20 pointer-events-none"
                style={{
                  boxShadow:
                    'inset 0 0 0 3px rgba(255,255,255,0.06), inset 0 0 0 7px rgba(0,0,0,0.4), inset 0 0 0 10px rgba(0,240,255,0.1)',
                }}
              />

              {/* CD Label Text (원형 라벨 텍스트) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[6.5px] font-mono tracking-widest uppercase text-cyan-200/80 font-black opacity-80">
                  DASSOBA•2077
                </span>
              </div>

              {/* Clear Polycarbonate Hub (투명 센터 플라스틱 링) */}
              <div className="absolute inset-0 m-auto w-6 h-6 rounded-full border-2 border-white/40 bg-black/60 backdrop-blur-xs flex items-center justify-center shadow-inner">
                {/* Spindle Clamp Hole (스핀들 구멍) */}
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 border border-cyan-400 flex items-center justify-center">
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isPlaying ? 'bg-[#00f0ff] animate-ping' : 'bg-pink-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Play/Pause Hover Overlay Icon */}
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              ) : (
                <Play className="w-4 h-4 text-cyan-300 fill-cyan-300 ml-0.5" />
              )}
            </div>
          </div>

          {/* Track Info (Clickable to Expand Cyber Deck) */}
          <div
            onClick={(e) => {
              if (isDragging || dragInfoRef.current?.hasMoved) return;
              setIsExpanded(!isExpanded);
            }}
            className="flex flex-col min-w-[130px] sm:min-w-[160px] max-w-[190px] cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-1.5 py-0.2 rounded">
                {activeChannel === 'hiphop' ? (
                  <>
                    <Mic className="w-2.5 h-2.5 text-pink-400" />
                    HIP-HOP & RAP
                  </>
                ) : activeChannel === 'funk' ? (
                  <>
                    <Zap className="w-2.5 h-2.5 text-yellow-300" />
                    CYBER FUNK
                  </>
                ) : (
                  <>
                    <Coffee className="w-2.5 h-2.5 text-amber-300" />
                    COZY CAFE
                  </>
                )}
              </span>
              <span className="text-white/30 text-[9px]">•</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {trackIndex + 1}/{currentChannelTracks.length}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-[1.5px] h-2.5 ml-auto">
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-full" />
                  <span className="w-[2px] bg-pink-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2/3" />
                  <span className="w-[2px] bg-yellow-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-4/5" />
                </div>
              )}
            </div>

            <div className="text-xs font-bold text-white truncate leading-tight mt-1 group-hover:text-cyan-300 transition-colors">
              {currentTrack.koreanTitle}
            </div>
            <div className="text-[10px] text-neutral-400 truncate font-mono">
              {currentTrack.artist} {currentTrack.bpm ? `• ${currentTrack.bpm} BPM` : ''}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1 shrink-0 text-neutral-300">
            <button
              onClick={prevTrack}
              className="p-1 hover:text-cyan-300 transition-colors"
              title="이전 곡"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition-colors border border-cyan-500/40"
              title={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-cyan-300" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-cyan-300 ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-1 hover:text-cyan-300 transition-colors"
              title="다음 곡"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1 hover:text-pink-400 transition-colors"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-pink-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isDragging) return;
                setIsExpanded(!isExpanded);
              }}
              className="p-1 hover:text-cyan-300 transition-colors text-neutral-400"
              title={isExpanded ? '플레이어 접기' : '플레이어 펼치기'}
            >
              {isExpanded ? (
                isNearBottom ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                isNearBottom ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* EXPANDABLE CYBER DECK / JEWEL CASE (사이버펑크 플레이리스트 & 덱) */}
        {isExpanded && (
          <div className="w-[320px] sm:w-[370px] bg-[#090914]/95 text-white backdrop-blur-2xl rounded-2xl border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.2)] p-4 space-y-3 animate-fade-in">
            {/* Header: Draggable hint and Reset position */}
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1 text-cyan-400">
                <Move className="w-3 h-3" /> 마우스로 어디든 드래그 가능
              </span>
              <button
                onClick={resetPosition}
                className="flex items-center gap-1 text-neutral-400 hover:text-pink-400 transition-colors px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10"
                title="플레이어를 좌측 하단 기본 위치로 이동"
              >
                <RotateCcw className="w-2.5 h-2.5" /> 위치 초기화
              </button>
            </div>

            {/* 3-Channel Switcher Tabs (3개 장르 채널 탭) */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-xl border border-white/10">
              {TRACK_CHANNELS.map((ch) => {
                const isActive = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChannel(ch.id);
                      setTrackIndex(0);
                    }}
                    className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-bold font-mono transition-all flex items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ch.icon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{ch.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Seek Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-cyan-300/80 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Current Track Cyber Card */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/40 border border-cyan-500/20 text-xs">
              <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                <span>{currentTrack.genre}</span>
                <span className="text-yellow-300">{currentTrack.bpm ? `${currentTrack.bpm} BPM` : 'BGM'}</span>
              </div>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                ⚡ {currentTrack.description}
              </p>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
              <span className="text-cyan-400">VOL</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (isMuted && val > 0) setIsMuted(false);
                }}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="w-8 text-right font-bold text-cyan-300">
                {isMuted ? 'MUTE' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Track List */}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-mono font-bold text-neutral-400 flex items-center justify-between px-1">
                <span>
                  {activeChannel === 'hiphop'
                    ? '힙합 & 랩 비트 (3곡)'
                    : activeChannel === 'funk'
                    ? '펑키 힙합 트랙 (3곡)'
                    : '카페 라운지 트랙 (3곡)'}
                </span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> 저작권 무료 (CC-BY)
                </span>
              </div>

              {currentChannelTracks.map((t, idx) => {
                const isSelected = trackIndex === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-purple-500/20 border border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                        : 'hover:bg-white/5 text-neutral-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-cyan-400 w-3">{idx + 1}</span>
                      <div className="truncate">
                        <div className="truncate font-semibold">{t.koreanTitle}</div>
                        <div className="text-[10px] text-neutral-400 truncate font-mono">
                          {t.title}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400 shrink-0 ml-2">
                      {t.duration}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer license note */}
            <div className="text-[9px] font-mono text-neutral-500 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>DASSOBA CYBER DECK v2077</span>
              <span>CC-BY 4.0 Kevin MacLeod</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
