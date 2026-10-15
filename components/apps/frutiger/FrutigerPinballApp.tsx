import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { audio } from '../../../services/audioService';
import { useIsMobile } from '../../../hooks/useIsMobile';

// Table dimensions
const TABLE_WIDTH = 400;
const TABLE_HEIGHT = 650;

// Physics parameters - softened gravity for graceful, controllable 3D pinball motion
const GRAVITY = 0.13;
const BALL_RADIUS = 8.5;
const FLIPPER_LENGTH = 66;
const FLIPPER_HALF_WIDTH = 6;
const FLIPPER_REST_ANGLE = 0.48; // ~27.5 degrees down
const FLIPPER_UP_ANGLE = -0.38;  // ~-22 degrees up

// Stand-up targets: light all four to trigger the TARGET BANK bonus
const STAND_TARGETS = [
  { x: 58, y: 235 },
  { x: 58, y: 305 },
  { x: 322, y: 235 },
  { x: 322, y: 305 },
];
const STAND_TARGET_R = 8;
const BALL_SAVER_MS = 12000;
const COMBO_WINDOW_MS = 2500;

// Crisp rendering on HiDPI screens (capped to keep fill-rate reasonable)
const DPR = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;

// Ignore game hotkeys while the user is typing in another app's input
const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number;
}

export const FrutigerPinballApp: React.FC = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // View state: 'overview' shows cabinet with 'Play' button,
  // 'zooming' animates camera dive-in, 'playing' is active gameplay
  const [viewMode, setViewMode] = useState<'overview' | 'zooming' | 'playing'>('overview');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuzuos_pinball_highscore');
      return saved ? parseInt(saved, 10) : 150000;
    }
    return 150000;
  });
  const [balls, setBalls] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.isMuted());
  const [announcement, setAnnouncement] = useState<string>('PRESS PLAY TO START');
  const [screenShake, setScreenShake] = useState<number>(0);

  // Input states
  const [leftFlipperActive, setLeftFlipperActive] = useState<boolean>(false);
  const [rightFlipperActive, setRightFlipperActive] = useState<boolean>(false);
  const [plungerPull, setPlungerPull] = useState<number>(0); // 0.0 to 1.0
  const isDraggingPlungerRef = useRef<boolean>(false);
  const plungerDragStartY = useRef<number>(0);

  // Table targets state
  const topLanesRef = useRef<{ P: boolean; I: boolean; N: boolean }>({ P: false, I: false, N: false });

  // Physics simulation state stored in refs for 60fps performance
  const ballRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    inPlay: boolean;
    inPlungerLane: boolean;
  }>({
    x: 374,
    y: 565,
    vx: 0,
    vy: 0,
    inPlay: false,
    inPlungerLane: true,
  });

  const leftAngleRef = useRef<number>(FLIPPER_REST_ANGLE);
  const rightAngleRef = useRef<number>(Math.PI - FLIPPER_REST_ANGLE);
  const leftAngularVelRef = useRef<number>(0);
  const rightAngularVelRef = useRef<number>(0);

  const leftFlipperPressedRef = useRef<boolean>(false);
  const rightFlipperPressedRef = useRef<boolean>(false);
  const plungerPullRef = useRef<number>(0);

  // Anti-stuck watchdog state
  const stuckFramesRef = useRef<number>(0);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 374, y: 565 });
  const tableShakeRef = useRef<number>(0);

  // Visual effects
  const particlesRef = useRef<Particle[]>([]);
  const popupsRef = useRef<ScorePopup[]>([]);
  const bumperFlashRef = useRef<[number, number, number]>([0, 0, 0]);
  const slingshotFlashRef = useRef<[number, number]>([0, 0]);

  // Gameplay layer: targets, combo chain, ball saver, moving bonus target
  const targetsLitRef = useRef<boolean[]>(STAND_TARGETS.map(() => false));
  const targetFlashRef = useRef<number[]>(STAND_TARGETS.map(() => 0));
  const comboRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0);
  const ballSaverUntilRef = useRef<number>(0);
  const saverAvailableRef = useRef<boolean>(true);
  const ballsRef = useRef<number>(3);
  const frameRef = useRef<number>(0);
  const movingCooldownRef = useRef<number>(0);
  const movingFlashRef = useRef<number>(0);

  // Bumpers definition
  const bumpers = useRef([
    { x: 140, y: 205, r: 24, pts: 500, label: '500' },
    { x: 240, y: 205, r: 24, pts: 500, label: '500' },
    { x: 190, y: 280, r: 26, pts: 1000, label: '1000' },
  ]).current;

  // Sync state to refs for high-frequency physics ticks
  useEffect(() => {
    leftFlipperPressedRef.current = leftFlipperActive;
  }, [leftFlipperActive]);

  useEffect(() => {
    rightFlipperPressedRef.current = rightFlipperActive;
  }, [rightFlipperActive]);

  useEffect(() => {
    plungerPullRef.current = plungerPull;
  }, [plungerPull]);

  // Flash / announcement helper
  const showAnnouncement = (msg: string) => {
    setAnnouncement(msg);
  };

  // Add floating points popup
  const addScorePopup = (x: number, y: number, text: string) => {
    popupsRef.current.push({
      id: Math.random(),
      x,
      y,
      text,
      life: 1.0,
    });
  };

  // Add spark particles
  const addParticles = (x: number, y: number, count = 8, color = '#ef4444') => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 20 + Math.random() * 15,
        color,
      });
    }
  };

  // Sound mute toggle
  const toggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    if (!muted) audio.playClick();
  };

  // Start / Enter Table
  const handlePlayButtonClick = () => {
    audio.playJackpot();
    setViewMode('zooming');
    showAnnouncement('READY! PULL PLUNGER TO LAUNCH');
    setTimeout(() => {
      setViewMode('playing');
      if (isGameOver || balls <= 0) {
        resetGame();
      }
    }, 400);
  };

  // Reset entire game
  const resetGame = () => {
    setScore(0);
    setBalls(3);
    ballsRef.current = 3;
    saverAvailableRef.current = true;
    setMultiplier(1);
    setIsGameOver(false);
    topLanesRef.current = { P: false, I: false, N: false };
    targetsLitRef.current = STAND_TARGETS.map(() => false);
    comboRef.current = 0;
    ballSaverUntilRef.current = 0;
    resetBallToPlunger();
    showAnnouncement('BALL 1 OF 3');
  };

  // Reset ball to plunger lane
  const resetBallToPlunger = () => {
    ballRef.current = {
      x: 374,
      y: 565,
      vx: 0,
      vy: 0,
      inPlay: false,
      inPlungerLane: true,
    };
    stuckFramesRef.current = 0;
    lastPosRef.current = { x: 374, y: 565 };
  };

  // Trigger Table Nudge (Shake table & kick ball free)
  const triggerNudge = useCallback(() => {
    audio.playTargetHit();
    tableShakeRef.current = 8;
    setScreenShake(8);

    const b = ballRef.current;
    if (b.inPlay) {
      b.vx += (Math.random() - 0.5) * 5;
      b.vy = Math.min(b.vy - 3.0, -4.0);
      addParticles(b.x, b.y, 6, '#fca5a5');
    }
    showAnnouncement('NUDGE!');
  }, []);

  // Trigger Plunger Release Launch
  const triggerPlungerRelease = (powerFraction: number) => {
    if (powerFraction < 0.04) {
      setPlungerPull(0);
      plungerPullRef.current = 0;
      return;
    }
    const b = ballRef.current;
    if (b.inPlungerLane && !b.inPlay) {
      audio.playPlungerRelease();
      // Controlled launch speed: 12 (min) to 19 (max)
      const launchSpeed = 12 + powerFraction * 7;
      b.vy = -launchSpeed;
      b.vx = (Math.random() - 0.5) * 0.4;
      b.inPlay = true;
      if (saverAvailableRef.current) {
        ballSaverUntilRef.current = performance.now() + BALL_SAVER_MS;
      }
      addParticles(b.x, b.y + 10, 12, '#ff4d6d');
      showAnnouncement(powerFraction > 0.8 ? 'MAX POWER LAUNCH!' : 'LAUNCHED!');
    }
    setPlungerPull(0);
    plungerPullRef.current = 0;
  };

  // Global mousemove / mouseup for plunger dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingPlungerRef.current) return;
      const dy = e.clientY - plungerDragStartY.current;
      const pull = Math.max(0, Math.min(1, dy / 65));
      setPlungerPull(pull);
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingPlungerRef.current) {
        isDraggingPlungerRef.current = false;
        triggerPlungerRelease(plungerPullRef.current);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDraggingPlungerRef.current || e.touches.length === 0) return;
      const dy = e.touches[0].clientY - plungerDragStartY.current;
      const pull = Math.max(0, Math.min(1, dy / 65));
      setPlungerPull(pull);
    };

    const handleGlobalTouchEnd = () => {
      if (isDraggingPlungerRef.current) {
        isDraggingPlungerRef.current = false;
        triggerPlungerRelease(plungerPullRef.current);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, []);

  // Plunger knob mouse down
  const handlePlungerMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (viewMode !== 'playing') return;
    if (ballRef.current.inPlay) return;

    audio.playPlungerPull();
    isDraggingPlungerRef.current = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    plungerDragStartY.current = clientY;
  };

  // Keyboard navigation: Left/Right Shift for Flippers, Space for Launch/Nudge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'playing' || isTypingTarget(e.target)) return;

      if (e.code === 'ShiftLeft' || (e.key === 'Shift' && e.location === 1)) {
        if (!leftFlipperPressedRef.current) {
          audio.playFlipper();
          setLeftFlipperActive(true);
        }
      } else if (e.code === 'ShiftRight' || (e.key === 'Shift' && e.location === 2)) {
        if (!rightFlipperPressedRef.current) {
          audio.playFlipper();
          setRightFlipperActive(true);
        }
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
        if (!leftFlipperPressedRef.current) {
          audio.playFlipper();
          setLeftFlipperActive(true);
        }
      } else if (e.key === '/' || e.key === '?' || e.key === 'ArrowRight') {
        if (!rightFlipperPressedRef.current) {
          audio.playFlipper();
          setRightFlipperActive(true);
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (ballRef.current.inPlungerLane && !ballRef.current.inPlay) {
          audio.playPlungerPull();
          triggerPlungerRelease(1.0);
        } else {
          triggerNudge();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || (e.key === 'Shift' && e.location === 1) || e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
        setLeftFlipperActive(false);
      } else if (e.code === 'ShiftRight' || (e.key === 'Shift' && e.location === 2) || e.key === '/' || e.key === '?' || e.key === 'ArrowRight') {
        setRightFlipperActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewMode, triggerNudge]);

  // Score handler with high-score storage
  const addScore = useCallback((pts: number) => {
    setScore(prev => {
      const next = prev + pts * multiplier;
      setHighScore(currHigh => {
        if (next > currHigh) {
          localStorage.setItem('yuzuos_pinball_highscore', next.toString());
          return next;
        }
        return currHigh;
      });
      return next;
    });
  }, [multiplier]);

  // Check all top lanes lit (PIN)
  const checkAllLanesLit = useCallback(() => {
    const lanes = topLanesRef.current;
    if (lanes.P && lanes.I && lanes.N) {
      audio.playJackpot();
      showAnnouncement('PIN JACKPOT! 10,000 + MULTIPLIER UP!');
      addScore(10000);
      setMultiplier(m => Math.min(5, m + 1));
      setTimeout(() => {
        topLanesRef.current = { P: false, I: false, N: false };
          }, 1800);
    }
  }, [addScore]);

  // Chain hits within the combo window: every 3rd chained hit pays a growing bonus
  const registerHit = useCallback((x: number, y: number) => {
    const now = performance.now();
    comboRef.current = now - lastHitTimeRef.current < COMBO_WINDOW_MS ? comboRef.current + 1 : 1;
    lastHitTimeRef.current = now;
    const c = comboRef.current;
    if (c >= 3 && c % 3 === 0) {
      const bonus = c * 100;
      addScore(bonus);
      addScorePopup(x, y - 18, `COMBO x${c} +${bonus}`);
      audio.playJackpot();
    }
  }, [addScore]);

  // --------------------------------------------------------------------------
  // 60FPS Physics Engine & Canvas Renderer
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const gameLoop = () => {
      if (!running) return;

      // Decrement screen shake decay
      if (tableShakeRef.current > 0) {
        tableShakeRef.current = Math.max(0, tableShakeRef.current - 0.5);
        setScreenShake(tableShakeRef.current);
      }

      // 1. FLIPPER ANGULAR VELOCITY PHYSICS
      const leftTarget = leftFlipperPressedRef.current ? FLIPPER_UP_ANGLE : FLIPPER_REST_ANGLE;
      const leftDiff = leftTarget - leftAngleRef.current;
      leftAngularVelRef.current = leftDiff * 0.45;
      leftAngleRef.current += leftAngularVelRef.current;

      const rightTarget = rightFlipperPressedRef.current
        ? Math.PI - FLIPPER_UP_ANGLE
        : Math.PI - FLIPPER_REST_ANGLE;
      const rightDiff = rightTarget - rightAngleRef.current;
      rightAngularVelRef.current = rightDiff * 0.45;
      rightAngleRef.current += rightAngularVelRef.current;

      frameRef.current += 1;
      if (movingCooldownRef.current > 0) movingCooldownRef.current -= 1;

      // 2. BALL SIMULATION
      const b = ballRef.current;

      if (b.inPlay) {
        // Multi-substep physics for tunneling and glitch prevention
        const substeps = 4;
        for (let step = 0; step < substeps; step++) {
          b.vy += GRAVITY / substeps;
          b.vx *= 0.9995;
          b.vy *= 0.9995;

          // Limit max terminal speed for floaty, controllable gameplay
          const speed = Math.hypot(b.vx, b.vy);
          if (speed > 14) {
            b.vx = (b.vx / speed) * 14;
            b.vy = (b.vy / speed) * 14;
          }

          b.x += b.vx / substeps;
          b.y += b.vy / substeps;

          // ----------------------------------------------------------------
          // Plunger Lane & Arch Transition (Smooth Launch)
          // ----------------------------------------------------------------
          if (b.inPlungerLane) {
            if (b.x < 356 + BALL_RADIUS) {
              b.x = 356 + BALL_RADIUS;
              b.vx = Math.abs(b.vx) * 0.5;
            }
            if (b.x > 392 - BALL_RADIUS) {
              b.x = 392 - BALL_RADIUS;
              b.vx = -Math.abs(b.vx) * 0.5;
            }

            // Ball shoots up out of shooter lane
            if (b.y < 135) {
              b.inPlungerLane = false;
              b.vx = -7.5; // Strong smooth leftward momentum across the top arch
              b.vy = Math.min(b.vy * 0.65, -2.5);
              audio.playTargetHit();
            } else if (b.vy >= 0 && b.y >= 565) {
              // Weak launch settles safely back onto the plunger spring
              b.y = 565;
              b.x = 374;
              b.vx = 0;
              b.vy = 0;
              b.inPlay = false;
              showAnnouncement('WEAK LAUNCH! PULL PLUNGER AGAIN');
              break;
            }
          }

          // ----------------------------------------------------------------
          // Top Curved Arch Wall (Full dome from x=24 to x=392, center (208, 140))
          // ----------------------------------------------------------------
          const archCenter = { x: 208, y: 140 };
          const archRadius = 184;
          if (b.y < 140) {
            const distToArch = Math.hypot(b.x - archCenter.x, b.y - archCenter.y);
            if (distToArch > archRadius - BALL_RADIUS) {
              const nx = (b.x - archCenter.x) / distToArch;
              const ny = (b.y - archCenter.y) / distToArch;
              b.x = archCenter.x + nx * (archRadius - BALL_RADIUS);
              b.y = archCenter.y + ny * (archRadius - BALL_RADIUS);

              const inX = -nx;
              const inY = -ny;
              const vn = b.vx * inX + b.vy * inY;
              if (vn < 0) {
                b.vx -= 1.65 * vn * inX;
                b.vy -= 1.65 * vn * inY;
                b.vx -= 0.35;
              }
            }
          }

          // ----------------------------------------------------------------
          // Main Playfield Outer Walls & Shooter Lane Divider
          // ----------------------------------------------------------------
          // Left Outer Wall: x = 24 from y = 140 to y = 415
          collideSegment(b, 24, 140, 24, 415, 0.75);

          if (!b.inPlungerLane) {
            // Main field right wall / Plunger divider: x = 356 from y = 140 to y = 415
            collideSegment(b, 356, 140, 356, 415, 0.75);
          }

          // ----------------------------------------------------------------
          // Aprons: Single continuous guide funnels directly to flippers
          // Zero dead pockets, zero wedging!
          // ----------------------------------------------------------------
          // Left Apron: from (24, 415) -> (52, 515) -> (115, 555)
          collideSegment(b, 24, 415, 52, 515, 0.65);
          collideSegment(b, 52, 515, 115, 555, 0.65);

          // Right Apron: from (356, 415) -> (328, 515) -> (265, 555)
          collideSegment(b, 356, 415, 328, 515, 0.65);
          collideSegment(b, 328, 515, 265, 555, 0.65);

          // Drain trough funnels (below flippers)
          collideSegment(b, 115, 565, 140, 640, 0.5);
          collideSegment(b, 265, 565, 240, 640, 0.5);

          // ----------------------------------------------------------------
          // Top Rollover Lanes (P - I - N)
          // ----------------------------------------------------------------
          const laneP = { x: 140, y: 95 };
          const laneI = { x: 190, y: 95 };
          const laneN = { x: 240, y: 95 };

          if (Math.abs(b.y - laneP.y) < 14 && Math.abs(b.x - laneP.x) < 14) {
            if (!topLanesRef.current.P) {
              topLanesRef.current.P = true;
              audio.playTargetHit();
              addScore(250);
              addScorePopup(laneP.x, laneP.y, 'P +250');
              checkAllLanesLit();
            }
          }
          if (Math.abs(b.y - laneI.y) < 14 && Math.abs(b.x - laneI.x) < 14) {
            if (!topLanesRef.current.I) {
              topLanesRef.current.I = true;
              audio.playTargetHit();
              addScore(250);
              addScorePopup(laneI.x, laneI.y, 'I +250');
              checkAllLanesLit();
            }
          }
          if (Math.abs(b.y - laneN.y) < 14 && Math.abs(b.x - laneN.x) < 14) {
            if (!topLanesRef.current.N) {
              topLanesRef.current.N = true;
              audio.playTargetHit();
              addScore(250);
              addScorePopup(laneN.x, laneN.y, 'N +250');
              checkAllLanesLit();
            }
          }

          // ----------------------------------------------------------------
          // Pop Bumpers (Gentle, crisp pop force 7.0)
          // ----------------------------------------------------------------
          bumpers.forEach((bm, idx) => {
            if (collideCircle(b, bm.x, bm.y, bm.r, 7.0)) {
              bumperFlashRef.current[idx] = 1.0;
              audio.playBumper();
              addParticles(bm.x, bm.y, 12, '#ef4444');
              addScore(bm.pts);
              addScorePopup(bm.x, bm.y - 12, `+${bm.pts}`);
              registerHit(bm.x, bm.y);
              tableShakeRef.current = Math.min(5, tableShakeRef.current + 2);
            }
          });

          // ----------------------------------------------------------------
          // Stand-up targets: light all four for the TARGET BANK bonus
          // ----------------------------------------------------------------
          STAND_TARGETS.forEach((tg, idx) => {
            if (collideCircle(b, tg.x, tg.y, STAND_TARGET_R, 4.5)) {
              targetFlashRef.current[idx] = 1.0;
              audio.playTargetHit();
              addParticles(tg.x, tg.y, 8, '#fde68a');
              registerHit(tg.x, tg.y);
              if (!targetsLitRef.current[idx]) {
                targetsLitRef.current[idx] = true;
                addScore(500);
                addScorePopup(tg.x, tg.y - 14, '+500');
                if (targetsLitRef.current.every(Boolean)) {
                  audio.playJackpot();
                  showAnnouncement('TARGET BANK! 5,000 + MULTIPLIER UP!');
                  addScore(5000);
                  addScorePopup(190, 340, 'TARGET BANK +5000');
                  setMultiplier(m => Math.min(5, m + 1));
                  targetsLitRef.current = STAND_TARGETS.map(() => false);
                }
              } else {
                addScore(100);
              }
            }
          });

          // Moving bonus target: sweeps across the mid field (risk/reward shot)
          const movingX = 190 + Math.sin(frameRef.current * 0.022) * 80;
          if (collideCircle(b, movingX, 360, 9, 5.5) && movingCooldownRef.current <= 0) {
            movingCooldownRef.current = 20;
            movingFlashRef.current = 1.0;
            audio.playBumper();
            addParticles(movingX, 360, 14, '#fbbf24');
            addScore(1500);
            addScorePopup(movingX, 340, 'BONUS +1500');
            registerHit(movingX, 360);
          }

          // ----------------------------------------------------------------
          // Standard Slingshots (Spacious channels > 40px width, anti-stuck apex)
          // ----------------------------------------------------------------
          // Left Slingshot: Apex (75, 415), Flipper Corner (105, 505), Base (70, 495)
          collideSlingshot(
            b,
            75,
            415,
            105,
            505,
            70,
            495,
            true,
            () => {
              audio.playTargetHit();
              slingshotFlashRef.current[0] = 1.0;
              addParticles(b.x, b.y, 8, '#f43f5e');
              addScore(250);
              addScorePopup(105, 470, '+250');
              registerHit(105, 470);
              tableShakeRef.current = Math.min(4, tableShakeRef.current + 2);
            }
          );

          // Right Slingshot: Apex (305, 415), Flipper Corner (275, 505), Base (310, 495)
          collideSlingshot(
            b,
            305,
            415,
            275,
            505,
            310,
            495,
            false,
            () => {
              audio.playTargetHit();
              slingshotFlashRef.current[1] = 1.0;
              addParticles(b.x, b.y, 8, '#f43f5e');
              addScore(250);
              addScorePopup(275, 470, '+250');
              registerHit(275, 470);
              tableShakeRef.current = Math.min(4, tableShakeRef.current + 2);
            }
          );

          // ----------------------------------------------------------------
          // Left Flipper Collision (True oriented capsule)
          // ----------------------------------------------------------------
          const leftPivot = { x: 115, y: 555 };
          const leftTip = {
            x: leftPivot.x + Math.cos(leftAngleRef.current) * FLIPPER_LENGTH,
            y: leftPivot.y + Math.sin(leftAngleRef.current) * FLIPPER_LENGTH,
          };
          collideFlipper(
            b,
            leftPivot.x,
            leftPivot.y,
            leftTip.x,
            leftTip.y,
            leftAngularVelRef.current,
            true,
            () => {
              audio.playFlipper();
              addParticles(b.x, b.y, 7, '#ffffff');
              addScore(100);
            }
          );

          // ----------------------------------------------------------------
          // Right Flipper Collision (True oriented capsule)
          // ----------------------------------------------------------------
          const rightPivot = { x: 265, y: 555 };
          const rightTip = {
            x: rightPivot.x + Math.cos(rightAngleRef.current) * FLIPPER_LENGTH,
            y: rightPivot.y + Math.sin(rightAngleRef.current) * FLIPPER_LENGTH,
          };
          collideFlipper(
            b,
            rightPivot.x,
            rightPivot.y,
            rightTip.x,
            rightTip.y,
            rightAngularVelRef.current,
            false,
            () => {
              audio.playFlipper();
              addParticles(b.x, b.y, 7, '#ffffff');
              addScore(100);
            }
          );

          // ----------------------------------------------------------------
          // Drain Sensor (Bottom gap between flippers)
          // ----------------------------------------------------------------
          if (b.y > 625 && performance.now() < ballSaverUntilRef.current) {
            ballSaverUntilRef.current = 0;
            saverAvailableRef.current = false;
            audio.playJackpot();
            showAnnouncement('BALL SAVED! RELAUNCH');
            resetBallToPlunger();
            break;
          }
          if (b.y > 625) {
            audio.playDrain();
            b.inPlay = false;
            ballSaverUntilRef.current = 0;
            comboRef.current = 0;
            const next = Math.max(0, ballsRef.current - 1);
            ballsRef.current = next;
            setBalls(next);
            if (next === 0) {
              setIsGameOver(true);
              showAnnouncement('GAME OVER - PRESS PLAY AGAIN');
            } else {
              saverAvailableRef.current = true;
              showAnnouncement(`BALL LOST! BALL ${4 - next} OF 3`);
              setTimeout(() => {
                resetBallToPlunger();
              }, 900);
            }
            break;
          }
        }

        // ------------------------------------------------------------------
        // ACTIVE ZERO-TRAP WATCHDOG (Prevents ball from ever getting stuck!)
        // ------------------------------------------------------------------
        const curSpeed = Math.hypot(b.vx, b.vy);
        const distFromLast = Math.hypot(b.x - lastPosRef.current.x, b.y - lastPosRef.current.y);

        if (b.inPlay && (curSpeed < 0.2 || distFromLast < 2.5)) {
          stuckFramesRef.current += 1;
          // If motionless for 30 frames (~0.5s), auto-kick free
          if (stuckFramesRef.current >= 30) {
            audio.playTargetHit();
            const kickX = (Math.random() > 0.5 ? 1 : -1) * (3.5 + Math.random() * 2.5);
            b.vx = kickX;
            b.vy = -5.5;
            tableShakeRef.current = 6;
            addParticles(b.x, b.y, 10, '#f87171');
            showAnnouncement('BALL RESCUE NUDGE!');
            stuckFramesRef.current = 0;
          }
        } else {
          stuckFramesRef.current = 0;
          lastPosRef.current = { x: b.x, y: b.y };
        }
      }

      // --------------------------------------------------------------------
      // RENDERING (3D Space Pinball with Gloss & Neon Aero Aesthetics)
      // --------------------------------------------------------------------
      ctx.save();

      // Screen shake translation
      if (tableShakeRef.current > 0) {
        const shakeMagnitude = tableShakeRef.current * 0.7;
        const sx = (Math.random() - 0.5) * shakeMagnitude;
        const sy = (Math.random() - 0.5) * shakeMagnitude;
        ctx.translate(sx, sy);
      }

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

      // 1. Playfield Base: Metallic Obsidian & Crimson Gradient
      const tableGrad = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT);
      tableGrad.addColorStop(0, '#0b0914');
      tableGrad.addColorStop(0.4, '#15060b');
      tableGrad.addColorStop(0.8, '#0d0205');
      tableGrad.addColorStop(1, '#050103');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

      // Soft central playfield light pool + edge vignette
      const pool = ctx.createRadialGradient(190, 270, 20, 190, 270, 330);
      pool.addColorStop(0, 'rgba(244, 63, 94, 0.16)');
      pool.addColorStop(0.55, 'rgba(159, 18, 57, 0.06)');
      pool.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = pool;
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

      // 2. 3D Beveled Outer Cabinet Trim
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, TABLE_WIDTH - 6, TABLE_HEIGHT - 6);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(5, 5, TABLE_WIDTH - 10, TABLE_HEIGHT - 10);

      // Subtle Neon Cyber Grid on Playfield
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 20; x < TABLE_WIDTH; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, TABLE_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < TABLE_HEIGHT; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(TABLE_WIDTH, y);
        ctx.stroke();
      }

      // Decorative Neon Cyber Concentric Rings on table
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(190, 230, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.beginPath();
      ctx.arc(190, 230, 130, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();

      // Top Arch Dome (Chrome & Neon Red Glow)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(208, 140, 184, Math.PI, 0);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Outer Left Wall & Apron
      ctx.strokeStyle = '#a8b3c7';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(24, 140);
      ctx.lineTo(24, 415);
      ctx.lineTo(52, 515);
      ctx.lineTo(115, 555);
      ctx.stroke();

      // Plunger Lane Divider Wall
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(356, 140);
      ctx.lineTo(356, 415);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Plunger Lane Right Outer Wall
      ctx.strokeStyle = '#a8b3c7';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(392, 140);
      ctx.lineTo(392, 610);
      ctx.stroke();

      // Right Apron Guide to Flipper
      ctx.strokeStyle = '#a8b3c7';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(356, 415);
      ctx.lineTo(328, 515);
      ctx.lineTo(265, 555);
      ctx.stroke();

      // Drain trough guides below the flippers
      ctx.strokeStyle = '#a8b3c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(115, 565);
      ctx.lineTo(140, 640);
      ctx.moveTo(265, 565);
      ctx.lineTo(240, 640);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Top Rollover Lanes (P - I - N)
      const lanes = [
        { label: 'P', x: 140, active: topLanesRef.current.P },
        { label: 'I', x: 190, active: topLanesRef.current.I },
        { label: 'N', x: 240, active: topLanesRef.current.N },
      ];
      lanes.forEach(l => {
        ctx.fillStyle = l.active ? '#ef4444' : '#1e1b2e';
        ctx.strokeStyle = l.active ? '#ffffff' : '#64748b';
        ctx.lineWidth = 1.5;
        if (l.active) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.roundRect(l.x - 12, 85, 24, 26, 4);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = l.active ? '#ffffff' : '#94a3b8';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(l.label, l.x, 98);
      });

      // 4. Pop Bumpers (3D Mushroom Chrome & Neon Glow)
      bumpers.forEach((bm, idx) => {
        const flash = bumperFlashRef.current[idx];
        if (flash > 0) bumperFlashRef.current[idx] = Math.max(0, flash - 0.06);

        ctx.save();
        // Expanding shockwave ripple when hit
        if (flash > 0) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${flash * 0.8})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(bm.x, bm.y, bm.r + (1 - flash) * 16, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Bumper outer chrome ring
        ctx.strokeStyle = flash > 0 ? '#ffffff' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = flash > 0 ? 25 : 10;
        ctx.beginPath();
        ctx.arc(bm.x, bm.y, bm.r, 0, Math.PI * 2);
        ctx.stroke();

        // 3D Bumper body gradient
        const bGrad = ctx.createRadialGradient(bm.x - 6, bm.y - 6, 2, bm.x, bm.y, bm.r);
        bGrad.addColorStop(0, flash > 0 ? '#ffffff' : '#ff758f');
        bGrad.addColorStop(0.35, '#ef4444');
        bGrad.addColorStop(0.8, '#9f1239');
        bGrad.addColorStop(1, '#4c0519');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bm.x, bm.y, bm.r - 2, 0, Math.PI * 2);
        ctx.fill();

        // Chrome Center Button & Score Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bm.label, bm.x, bm.y);
        ctx.restore();
      });

      // 4b. Stand-up targets (gold when lit)
      STAND_TARGETS.forEach((tg, idx) => {
        const flash = targetFlashRef.current[idx];
        if (flash > 0) targetFlashRef.current[idx] = Math.max(0, flash - 0.07);
        const lit = targetsLitRef.current[idx];
        ctx.save();
        ctx.shadowColor = lit ? '#fbbf24' : '#64748b';
        ctx.shadowBlur = lit ? 14 + flash * 10 : 4;
        const tGrad = ctx.createRadialGradient(tg.x - 2, tg.y - 2, 1, tg.x, tg.y, STAND_TARGET_R);
        tGrad.addColorStop(0, lit ? '#ffffff' : '#94a3b8');
        tGrad.addColorStop(0.5, lit ? '#fbbf24' : '#334155');
        tGrad.addColorStop(1, lit ? '#b45309' : '#0f172a');
        ctx.fillStyle = tGrad;
        ctx.strokeStyle = flash > 0 ? '#ffffff' : lit ? '#fde68a' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tg.x, tg.y, STAND_TARGET_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // 4c. Moving bonus target
      {
        const mx = 190 + Math.sin(frameRef.current * 0.022) * 80;
        const mf = movingFlashRef.current;
        if (mf > 0) movingFlashRef.current = Math.max(0, mf - 0.06);
        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10 + mf * 14;
        const mGrad = ctx.createRadialGradient(mx - 2, 358, 1, mx, 360, 9);
        mGrad.addColorStop(0, '#ffffff');
        mGrad.addColorStop(0.5, '#fbbf24');
        mGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.arc(mx, 360, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#7c2d12';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', mx, 360.5);
        ctx.restore();
      }

      // 4d. HUD overlays: combo chain + ball saver timer
      {
        const now = performance.now();
        if (comboRef.current >= 2 && now - lastHitTimeRef.current < COMBO_WINDOW_MS) {
          const left = 1 - (now - lastHitTimeRef.current) / COMBO_WINDOW_MS;
          ctx.save();
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#fde68a';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.font = 'bold 13px monospace';
          ctx.fillText(`COMBO x${comboRef.current}`, 34, 395);
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(34, 405, 70, 3);
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(34, 405, 70 * left, 3);
          ctx.restore();
        }
        const saverLeft = ballSaverUntilRef.current - now;
        if (saverLeft > 0 && ballRef.current.inPlay) {
          ctx.save();
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = saverLeft < 3000 && Math.floor(now / 150) % 2 ? '#ffffff' : '#7dd3fc';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.font = 'bold 11px monospace';
          ctx.fillText(`SAVER ${(saverLeft / 1000).toFixed(1)}s`, 346, 395);
          ctx.restore();
        }
      }

      // 5. Left Slingshot Block
      {
        const flash = slingshotFlashRef.current[0];
        if (flash > 0) slingshotFlashRef.current[0] = Math.max(0, flash - 0.08);

        ctx.save();
        // Translucent acrylic triangular base
        ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
        ctx.strokeStyle = flash > 0 ? '#ffffff' : '#ef4444';
        ctx.lineWidth = 2.5;
        if (flash > 0) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 18;
        }
        ctx.beginPath();
        ctx.moveTo(75, 415);
        ctx.lineTo(105, 505);
        ctx.lineTo(70, 495);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front Kicker Rubber Band
        ctx.strokeStyle = flash > 0 ? '#ffffff' : '#ff4d6d';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(75, 415);
        ctx.lineTo(105, 505);
        ctx.stroke();

        // Corner posts with chrome caps
        [
          { x: 75, y: 415 },
          { x: 105, y: 505 },
          { x: 70, y: 495 },
        ].forEach(pt => {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 6. Right Slingshot Block
      {
        const flash = slingshotFlashRef.current[1];
        if (flash > 0) slingshotFlashRef.current[1] = Math.max(0, flash - 0.08);

        ctx.save();
        ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
        ctx.strokeStyle = flash > 0 ? '#ffffff' : '#ef4444';
        ctx.lineWidth = 2.5;
        if (flash > 0) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 18;
        }
        ctx.beginPath();
        ctx.moveTo(305, 415);
        ctx.lineTo(275, 505);
        ctx.lineTo(310, 495);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front Kicker Rubber Band
        ctx.strokeStyle = flash > 0 ? '#ffffff' : '#ff4d6d';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ff4d6d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(305, 415);
        ctx.lineTo(275, 505);
        ctx.stroke();

        [
          { x: 305, y: 415 },
          { x: 275, y: 505 },
          { x: 310, y: 495 },
        ].forEach(pt => {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 7. Flippers (Molded 3D bat with chrome pivot bolt)
      const renderFlipperBat = (
        pivotX: number,
        pivotY: number,
        angle: number,
        isActive: boolean
      ) => {
        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.rotate(angle);

        // Bat 3D Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.roundRect(1, 3, FLIPPER_LENGTH, FLIPPER_HALF_WIDTH * 2, FLIPPER_HALF_WIDTH);
        ctx.fill();

        // Flipper bat gradient (Yellow / Red Arcade Style)
        const fGrad = ctx.createLinearGradient(0, -FLIPPER_HALF_WIDTH, 0, FLIPPER_HALF_WIDTH);
        if (isActive) {
          fGrad.addColorStop(0, '#ffffff');
          fGrad.addColorStop(0.3, '#fca5a5');
          fGrad.addColorStop(0.7, '#ef4444');
          fGrad.addColorStop(1, '#991b1b');
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
        } else {
          fGrad.addColorStop(0, '#ffe4e6');
          fGrad.addColorStop(0.3, '#fb7185');
          fGrad.addColorStop(0.8, '#be123c');
          fGrad.addColorStop(1, '#6b0f2a');
        }
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.moveTo(0, -FLIPPER_HALF_WIDTH - 1.5);
        ctx.lineTo(FLIPPER_LENGTH, -FLIPPER_HALF_WIDTH * 0.55);
        ctx.arc(FLIPPER_LENGTH, 0, FLIPPER_HALF_WIDTH * 0.55, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(0, FLIPPER_HALF_WIDTH + 1.5);
        ctx.arc(0, 0, FLIPPER_HALF_WIDTH + 1.5, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        // Silicone rubber band sleeve on edge
        ctx.strokeStyle = isActive ? '#ffffff' : '#fee2e2';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Pivot chrome screw
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      renderFlipperBat(115, 555, leftAngleRef.current, leftFlipperPressedRef.current);
      renderFlipperBat(265, 555, rightAngleRef.current, rightFlipperPressedRef.current);

      // 8. Plunger Spring in shooter lane
      ctx.save();
      const springTop = 565 + plungerPullRef.current * 42;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Draw coiled spring
      const coils = 6;
      const springHeight = 610 - springTop;
      for (let i = 0; i <= coils; i++) {
        const sy = springTop + (i / coils) * springHeight;
        const sx = 374 + (i % 2 === 0 ? -6 : 6);
        if (i === 0) ctx.moveTo(374, springTop);
        else ctx.lineTo(sx, sy);
      }
      ctx.lineTo(374, 610);
      ctx.stroke();

      // Plunger tip pad
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(366, springTop - 3, 16, 5);
      ctx.restore();

      // 9. Steel Chrome Ball (Specular raytraced appearance)
      ctx.save();
      // Ball cast shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(b.x + 2, b.y + 3, BALL_RADIUS, BALL_RADIUS * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steel sphere radial gradient
      const ballGrad = ctx.createRadialGradient(
        b.x - BALL_RADIUS * 0.35,
        b.y - BALL_RADIUS * 0.35,
        1,
        b.x,
        b.y,
        BALL_RADIUS
      );
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.25, '#f1f5f9');
      ballGrad.addColorStop(0.55, '#94a3b8');
      ballGrad.addColorStop(0.85, '#334155');
      ballGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Double Specular glint for 2000s skeuomorphic shine
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(
        b.x - BALL_RADIUS * 0.3,
        b.y - BALL_RADIUS * 0.3,
        BALL_RADIUS * 0.35,
        BALL_RADIUS * 0.2,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // 10. Floating Score Popups
      const popups = popupsRef.current;
      for (let i = popups.length - 1; i >= 0; i--) {
        const pop = popups[i];
        pop.y -= 0.6;
        pop.life -= 0.035;
        if (pop.life <= 0) {
          popups.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.life);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();
      }

      // 11. Spark Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;
        p.vx *= 0.95;
        p.vy *= 0.95;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 12. 2000s Aero Glass Top Specular Sheen (Diagonal Reflection)
      ctx.save();
      const glassSheen = ctx.createLinearGradient(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
      glassSheen.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      glassSheen.addColorStop(0.3, 'rgba(255, 255, 255, 0.03)');
      glassSheen.addColorStop(0.5, 'transparent');
      glassSheen.addColorStop(0.85, 'rgba(255, 255, 255, 0.04)');
      glassSheen.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = glassSheen;
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);
      ctx.restore();

      ctx.restore(); // Restore table screen shake

      requestAnimationFrame(gameLoop);
    };

    const animId = requestAnimationFrame(gameLoop);
    return () => {
      running = false;
      cancelAnimationFrame(animId);
    };
  }, [bumpers, checkAllLanesLit, addScore, registerHit]);

  return (
    <div className="h-full w-full bg-[#0a0508] flex flex-col justify-between items-center select-none overflow-hidden font-sans text-zinc-100">
      {/* ============================================================== */}
      {/* TOP HEADER: 2000s LED DOT-MATRIX ARCADE DISPLAY                */}
      {/* ============================================================== */}
      <div 
        className="w-full px-3 py-1.5 flex items-center justify-between border-b shrink-0 z-30"
        style={{
          background: 'linear-gradient(180deg, #1b070b 0%, #0d0305 100%)',
          borderColor: '#3f0c15',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        }}
      >
        {/* Ball Counter & Multiplier */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1" title="Remaining Balls">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border border-zinc-700 transition-all ${
                  i < balls
                    ? 'bg-gradient-to-br from-white via-zinc-300 to-zinc-600 shadow-[0_0_8px_#ffffff]'
                    : 'bg-zinc-900 opacity-30'
                }`}
              />
            ))}
          </div>

          <div className="px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-[10px] font-mono font-bold text-red-300">
            {multiplier}X
          </div>
        </div>

        {/* Dynamic LED Announcement Ribbon */}
        <div className="flex-1 mx-3 text-center truncate">
          <span className="font-mono text-xs font-black tracking-wider text-red-400 drop-shadow-[0_0_8px_#ef4444]">
            {announcement}
          </span>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-[9px] uppercase font-mono text-red-400/80 tracking-tighter">SCORE</div>
            <div className="text-base font-black font-mono tracking-wider text-white drop-shadow-[0_0_6px_#ffffff]">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN CONTAINER: Dynamic View Switcher                          */}
      {/* ============================================================== */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        {/* ============================================================== */}
        {/* VIEW 1: OVERVIEW SCREEN (Whole Cabinet with Big 'Play' Button) */}
        {/* ============================================================== */}
        {viewMode !== 'playing' && (
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-between p-2 sm:p-3 z-30 transition-all duration-400 ease-out ${
              viewMode === 'zooming' ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'
            }`}
            style={{
              background: 'radial-gradient(circle at 50% 30%, #2a0910 0%, #100306 70%, #050102 100%)',
            }}
          >
            {/* Title Badge */}
            <div className="text-center pt-1 shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] mb-1">
                <Sparkles size={14} className="text-red-400" />
                <span className="text-[11px] font-bold text-red-200 tracking-widest uppercase">
                  3D Space Pinball Arcade
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(239,68,68,0.6)]">
                CYBER PINBALL
              </h1>
            </div>

            {/* Whole Pinball Table View (Visual Full Table Overview - Fits dynamically) */}
            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center my-1">
              {/* 3D Angled Cabinet Showcase Frame */}
              <div 
                className="relative h-full max-h-[340px] aspect-[400/650] rounded-xl overflow-hidden flex flex-col items-center justify-between p-2 border-2"
                style={{
                  background: 'linear-gradient(180deg, #18080c 0%, #0d0407 100%)',
                  borderColor: '#475569 #1e293b #1e293b #475569',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.95), 0 0 25px rgba(220, 38, 38, 0.3)',
                  transform: 'perspective(600px) rotateX(10deg)',
                }}
              >
                {/* 2000s Glass Reflection overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                  }}
                />

                {/* Table Interior Graphic View (Top Arch, Rollover, Bumpers, Slingshots, Flippers, Plunger) */}
                <div className="w-full h-full rounded-lg bg-[#090305] border border-red-950 p-2 relative flex flex-col items-center justify-between overflow-hidden">
                  {/* Subtle red laser grid */}
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #ef4444 1px, transparent 1px), linear-gradient(to bottom, #ef4444 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Top arch neon curve */}
                  <div className="w-36 h-16 rounded-t-full border-t-2 border-red-500 shadow-[0_0_10px_#ef4444] mt-0.5 relative z-1 flex justify-center items-end pb-1 gap-4">
                    <span className="text-[8px] font-mono text-red-300 font-bold">P</span>
                    <span className="text-[8px] font-mono text-red-300 font-bold">I</span>
                    <span className="text-[8px] font-mono text-red-300 font-bold">N</span>
                  </div>

                  {/* 3 Red Glowing Bumpers */}
                  <div className="flex flex-col items-center gap-1.5 relative z-1 my-auto">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-rose-900 border border-white shadow-[0_0_10px_#ef4444] animate-pulse flex items-center justify-center text-[7px] font-bold text-white">500</div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-rose-900 border border-white shadow-[0_0_10px_#ef4444] animate-pulse flex items-center justify-center text-[7px] font-bold text-white" style={{ animationDelay: '0.3s' }}>500</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-950 border-2 border-white shadow-[0_0_14px_#ef4444] animate-pulse flex items-center justify-center text-[8px] font-bold text-white" style={{ animationDelay: '0.6s' }}>1000</div>
                  </div>

                  {/* Slingshots & Flippers */}
                  <div className="w-full flex flex-col items-center relative z-1 mb-1">
                    <div className="w-full flex justify-between px-3 mb-1">
                      <div className="w-4 h-6 border-r-2 border-red-500/80 -rotate-12" />
                      <div className="w-4 h-6 border-l-2 border-red-500/80 rotate-12" />
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-2 bg-red-500 rounded-full rotate-25 shadow-[0_0_6px_#ef4444] border border-white/60" />
                      <div className="w-8 h-2 bg-red-500 rounded-full -rotate-25 shadow-[0_0_6px_#ef4444] border border-white/60" />
                    </div>
                  </div>

                  {/* Plunger Lane on Right */}
                  <div className="absolute right-1 bottom-1 top-4 w-5 border-l border-red-500/50 flex flex-col items-center justify-end pb-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white via-slate-300 to-slate-700 shadow-sm mb-3 border border-slate-400" />
                    <div className="w-1 h-8 bg-slate-400 rounded-t" />
                    <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-slate-200 shadow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls & The Big "Play" Button */}
            <div className="w-full max-w-xs flex flex-col items-center gap-1.5 shrink-0 pb-1">
              <button
                onClick={handlePlayButtonClick}
                className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-black text-base sm:text-lg tracking-wider text-white shadow-2xl transition-all duration-150 transform hover:scale-102 active:scale-95 cursor-pointer relative overflow-hidden group border"
                style={{
                  background: 'linear-gradient(180deg, #ff4d6d 0%, #e11d48 45%, #9f1239 100%)',
                  borderColor: '#ff758f #881337 #881337 #ff758f',
                  boxShadow: '0 8px 25px rgba(225, 29, 72, 0.65), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(0,0,0,0.3)',
                }}
              >
                {/* 2000s Gel Specular Top Highlight */}
                <div 
                  className="absolute top-0 inset-x-0 h-1/2 pointer-events-none rounded-t-xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 100%)',
                  }}
                />

                <div className="relative flex items-center justify-center gap-2">
                  <Play size={18} className="fill-white" />
                  <span>PLAY</span>
                </div>
              </button>

              {/* Instructions Guide */}
              <div className="text-[10px] text-zinc-300 text-center leading-tight">
                <p>
                  <span className="font-bold text-red-400">操作方法:</span> <kbd className="px-1 py-0.5 bg-zinc-800 rounded border border-zinc-600 text-[9px] text-white">Left Shift</kbd> & <kbd className="px-1 py-0.5 bg-zinc-800 rounded border border-zinc-600 text-[9px] text-white">Right Shift</kbd> でフリッパー
                </p>
                <p className="text-[9px] text-zinc-400 mt-0.5">
                  右下のつまみを引いて離すと発射！ (スペースキーでも操作可能)
                </p>
                <p className="text-[9px] text-amber-300/80 mt-0.5">
                  P-I-Nレーン・金ターゲット4つで倍率UP / 動く★は +1500 / 連続ヒットでコンボ
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: ACTIVE 60FPS PLAYFIELD TABLE                           */}
        {/* ============================================================== */}
        <div 
          className="relative flex items-center justify-center h-full max-h-full py-1 min-h-0 w-full"
          style={{
            maxWidth: TABLE_WIDTH + 40,
          }}
        >
          {/* Canvas Rendering Plane */}
          <canvas
            ref={canvasRef}
            width={TABLE_WIDTH * DPR}
            height={TABLE_HEIGHT * DPR}
            className="rounded-lg shadow-2xl border border-zinc-800 max-h-[calc(100vh-230px)] max-w-[min(400px,100%)] h-auto w-auto aspect-[400/650] object-contain"
            style={{
              boxShadow: '0 10px 40px rgba(0,0,0,0.95), 0 0 25px rgba(220, 38, 38, 0.25)',
              transform: screenShake > 0 ? `scale(1.01)` : 'none',
            }}
          />

          {/* Interactive Plunger Pull Knob ("つまみ") Overlay */}
          <div 
            className="absolute right-1 sm:right-2 bottom-3 sm:bottom-6 w-11 flex flex-col items-center z-20 cursor-ns-resize select-none"
            title="つまみをクリックしたまま引き、離すとボールを発射します"
            onMouseDown={handlePlungerMouseDown}
            onTouchStart={handlePlungerMouseDown}
          >
            {/* Tension LED power gauge */}
            <div className="w-2.5 h-16 bg-zinc-950 rounded-full border border-zinc-700 p-0.5 flex flex-col-reverse gap-0.5 mb-1 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full flex-1 rounded-sm transition-colors ${
                    plungerPull * 8 > i ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>

            {/* Plunger Pull Knob ("つまみ") */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 cursor-grab active:cursor-grabbing border-2"
              style={{
                transform: `translateY(${plungerPull * 42}px)`,
                background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 30%, #ef4444 60%, #881337 100%)',
                borderColor: '#ffffff #475569 #475569 #ffffff',
                boxShadow: '0 6px 14px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.8)',
              }}
            >
              <div className="w-5 h-1 bg-red-950/50 rounded-full" />
            </div>

            <span className="text-[8px] font-bold text-red-400 tracking-tighter mt-1 uppercase text-center leading-none">
              PULL
            </span>
          </div>

          {/* Desktop HUD Indicators for Left / Right Shift */}
          {!isMobile && viewMode === 'playing' && (
            <>
              <div 
                className={`absolute left-2 bottom-4 px-2 py-1 rounded border text-[10px] font-mono font-bold transition-all select-none cursor-pointer ${
                  leftFlipperActive 
                    ? 'bg-red-600 text-white border-white shadow-[0_0_12px_#ef4444] scale-105' 
                    : 'bg-black/60 text-red-400/70 border-red-900/60 hover:text-white'
                }`}
                onMouseDown={() => {
                  audio.playFlipper();
                  setLeftFlipperActive(true);
                }}
                onMouseUp={() => setLeftFlipperActive(false)}
                onMouseLeave={() => setLeftFlipperActive(false)}
              >
                ◀ L-SHIFT
              </div>

              <div 
                className={`absolute right-14 bottom-4 px-2 py-1 rounded border text-[10px] font-mono font-bold transition-all select-none cursor-pointer ${
                  rightFlipperActive 
                    ? 'bg-red-600 text-white border-white shadow-[0_0_12px_#ef4444] scale-105' 
                    : 'bg-black/60 text-red-400/70 border-red-900/60 hover:text-white'
                }`}
                onMouseDown={() => {
                  audio.playFlipper();
                  setRightFlipperActive(true);
                }}
                onMouseUp={() => setRightFlipperActive(false)}
                onMouseLeave={() => setRightFlipperActive(false)}
              >
                R-SHIFT ▶
              </div>
            </>
          )}

          {/* Game Over Modal Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-40 rounded-lg animate-in zoom-in-95">
              <div 
                className="w-full max-w-[280px] p-5 rounded-xl border text-center shadow-2xl flex flex-col items-center gap-3"
                style={{
                  background: 'linear-gradient(180deg, #1f070b 0%, #0d0305 100%)',
                  borderColor: '#ef4444 #7f1d1d #7f1d1d #ef4444',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.45)',
                }}
              >
                <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_15px_#ef4444]">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white tracking-widest uppercase">
                    GAME OVER
                  </h3>
                  <p className="text-xs text-red-300 font-mono mt-1">Score: {score.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-400">High: {highScore.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => {
                    audio.playClick();
                    resetGame();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white transition-transform active:scale-95 cursor-pointer shadow-lg border"
                  style={{
                    background: 'linear-gradient(180deg, #ff4d6d 0%, #e11d48 50%, #9f1239 100%)',
                    borderColor: '#ff758f #881337 #881337 #ff758f',
                  }}
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE EXPLICIT FLIPPER CONTROLS (Only shown in 'playing' mode) */}
      {/* ============================================================== */}
      {viewMode === 'playing' && (isMobile || (typeof window !== 'undefined' && window.innerWidth < 640)) && (
        <div 
          className="px-3 py-2 border-t shrink-0 flex items-center justify-between gap-2 bg-[#0d0407] z-30 w-full"
          style={{
            borderColor: '#2e0a10',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.5)',
          }}
        >
          {/* Left Flipper Button */}
          <button
            onPointerDown={e => {
              e.currentTarget.setPointerCapture(e.pointerId);
              audio.playFlipper();
              setLeftFlipperActive(true);
            }}
            onPointerUp={() => setLeftFlipperActive(false)}
            onPointerCancel={() => setLeftFlipperActive(false)}
            onContextMenu={e => e.preventDefault()}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm tracking-wide text-white transition-all select-none cursor-pointer touch-none border flex items-center justify-center gap-1 ${
              leftFlipperActive
                ? 'bg-red-500 scale-98 shadow-[0_0_20px_#ef4444]'
                : 'bg-gradient-to-b from-red-600 to-rose-900 shadow-lg'
            }`}
            style={{
              borderColor: leftFlipperActive ? '#ffffff' : '#ff4d6d #7f1d1d #7f1d1d #ff4d6d',
            }}
          >
            <ChevronLeft size={16} />
            <span>LEFT</span>
          </button>

          {/* Quick Plunger Button */}
          <button
            onClick={() => {
              audio.playPlungerPull();
              triggerPlungerRelease(1.0);
            }}
            className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 font-bold text-[10px] shrink-0 active:scale-95 cursor-pointer"
            title="Quick Launch"
          >
            LAUNCH
          </button>

          {/* Right Flipper Button */}
          <button
            onPointerDown={e => {
              e.currentTarget.setPointerCapture(e.pointerId);
              audio.playFlipper();
              setRightFlipperActive(true);
            }}
            onPointerUp={() => setRightFlipperActive(false)}
            onPointerCancel={() => setRightFlipperActive(false)}
            onContextMenu={e => e.preventDefault()}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm tracking-wide text-white transition-all select-none cursor-pointer touch-none border flex items-center justify-center gap-1 ${
              rightFlipperActive
                ? 'bg-red-500 scale-98 shadow-[0_0_20px_#ef4444]'
                : 'bg-gradient-to-b from-red-600 to-rose-900 shadow-lg'
            }`}
            style={{
              borderColor: rightFlipperActive ? '#ffffff' : '#ff4d6d #7f1d1d #7f1d1d #ff4d6d',
            }}
          >
            <span>RIGHT</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ROCK-SOLID PHYSICS HELPER FUNCTIONS
// ============================================================================

// Distance from point to line segment
function pointToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return { closeX: x1, closeY: y1, t: 0 };
  }
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return {
    closeX: x1 + t * dx,
    closeY: y1 + t * dy,
    t,
  };
}

// Collide ball with a stationary segment wall (Outward normal reflection, zero sticking)
function collideSegment(
  b: { x: number; y: number; vx: number; vy: number },
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  restitution = 0.65,
  surfaceFriction = 0.98
): boolean {
  const { closeX, closeY } = pointToSegment(b.x, b.y, x1, y1, x2, y2);
  const diffX = b.x - closeX;
  const diffY = b.y - closeY;
  const dist = Math.hypot(diffX, diffY);
  const minDist = BALL_RADIUS + 0.5;

  if (dist < minDist) {
    let nx = dist > 0.0001 ? diffX / dist : 0;
    let ny = dist > 0.0001 ? diffY / dist : -1;

    // Push out of wall completely
    b.x = closeX + nx * minDist;
    b.y = closeY + ny * minDist;

    // Normal velocity component
    const vn = b.vx * nx + b.vy * ny;
    if (vn < 0) {
      b.vx -= (1 + restitution) * vn * nx;
      b.vy -= (1 + restitution) * vn * ny;
      b.vx *= surfaceFriction;
      b.vy *= surfaceFriction;
    }
    return true;
  }
  return false;
}

// Collide ball with a triangular slingshot block (kickback front face, rigid base/outer sides, anti-stuck apex)
function collideSlingshot(
  b: { x: number; y: number; vx: number; vy: number },
  topX: number,
  topY: number,
  flipX: number,
  flipY: number,
  baseX: number,
  baseY: number,
  isLeft: boolean,
  onKick: () => void
): boolean {
  // 1. Anti-stuck top apex deflector:
  // If ball touches or lands directly on the top apex, immediately deflect into the playfield
  const apexDist = Math.hypot(b.x - topX, b.y - topY);
  if (apexDist < BALL_RADIUS + 4.0) {
    b.x = topX + (isLeft ? 1 : -1) * (BALL_RADIUS + 4.5);
    b.y = Math.min(b.y, topY - 2.0);
    b.vx = isLeft ? 4.5 : -4.5;
    b.vy = Math.min(b.vy, -2.5);
    return true;
  }

  // 2. Check front kick face (from top apex to flipper corner)
  const front = pointToSegment(b.x, b.y, topX, topY, flipX, flipY);
  const fDiffX = b.x - front.closeX;
  const fDiffY = b.y - front.closeY;
  const fDist = Math.hypot(fDiffX, fDiffY);
  const kickMinDist = BALL_RADIUS + 2.5;

  if (fDist < kickMinDist) {
    const fnx = fDist > 0.0001 ? fDiffX / fDist : (isLeft ? 1 : -1);
    const fny = fDist > 0.0001 ? fDiffY / fDist : -0.5;

    // Only kick if ball is approaching the front face facing into the table
    const normalInward = isLeft ? fnx > -0.2 : fnx < 0.2;
    if (normalInward) {
      b.x = front.closeX + fnx * (kickMinDist + 1.0);
      b.y = front.closeY + fny * (kickMinDist + 1.0);
      b.vx = isLeft ? 6.0 : -6.0;
      b.vy = -4.5;
      onKick();
      return true;
    }
  }

  // 3. Other edges (base and outer wall) as standard rigid barriers
  const baseHit = collideSegment(b, flipX, flipY, baseX, baseY, 0.6);
  const outerHit = collideSegment(b, baseX, baseY, topX, topY, 0.6);
  return baseHit || outerHit;
}

// Collide with circular bumper
function collideCircle(
  b: { x: number; y: number; vx: number; vy: number },
  cx: number,
  cy: number,
  radius: number,
  popForce: number
): boolean {
  const dx = b.x - cx;
  const dy = b.y - cy;
  const dist = Math.hypot(dx, dy);
  const minDist = radius + BALL_RADIUS;

  if (dist < minDist) {
    const nx = dist > 0.0001 ? dx / dist : 0;
    const ny = dist > 0.0001 ? dy / dist : -1;

    b.x = cx + nx * (minDist + 1.0);
    b.y = cy + ny * (minDist + 1.0);

    b.vx = nx * popForce;
    b.vy = ny * popForce;
    return true;
  }
  return false;
}

// Collide with moving / resting flipper (Oriented Capsule with Dynamic Angular Velocity)
function collideFlipper(
  b: { x: number; y: number; vx: number; vy: number },
  px: number,
  py: number,
  tx: number,
  ty: number,
  angularVel: number,
  isLeft: boolean,
  onFlipHit: () => void
): boolean {
  const { closeX, closeY, t } = pointToSegment(b.x, b.y, px, py, tx, ty);
  const diffX = b.x - closeX;
  const diffY = b.y - closeY;
  const dist = Math.hypot(diffX, diffY);
  // Bat is drawn tapered: thick at the pivot, thin at the tip
  const halfWidth = (FLIPPER_HALF_WIDTH + 1.5) * (1 - t) + FLIPPER_HALF_WIDTH * 0.55 * t;
  const minDist = BALL_RADIUS + halfWidth;

  if (dist < minDist) {
    let nx = dist > 0.0001 ? diffX / dist : 0;
    let ny = dist > 0.0001 ? diffY / dist : -1;

    b.x = closeX + nx * (minDist + 0.5);
    b.y = closeY + ny * (minDist + 0.5);

    const rX = closeX - px;
    const rY = closeY - py;
    const flipperVx = -angularVel * rY;
    const flipperVy = angularVel * rX;

    const relVx = b.vx - flipperVx;
    const relVy = b.vy - flipperVy;
    const relVn = relVx * nx + relVy * ny;

    const isFlippingUp = isLeft ? angularVel < -0.04 : angularVel > 0.04;

    if (isFlippingUp) {
      const shotPower = 8.0 + t * 3.5;
      b.vx = nx * shotPower + flipperVx * 0.6;
      b.vy = ny * shotPower - 4.5;
      onFlipHit();
    } else {
      if (relVn < 0) {
        b.vx -= 1.55 * relVn * nx;
        b.vy -= 1.55 * relVn * ny;
        b.vx *= 0.98;
        b.vy *= 0.98;
      }
    }
    return true;
  }
  return false;
}
