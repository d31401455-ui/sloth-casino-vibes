import { useEffect, useRef, useState } from 'react';

export type GameState = 'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'win' | 'loss';
export type OutcomeMode = 'mixed' | 'win' | 'loss';
export type CatchResult = { id: number; multiplier: number; bet: number; time: string };
export const DEMO_MULTIPLIERS = [3.42, 0, 8.42, 1.76, 0, 2.15];
export function getDemoMultiplier(round: number, mode: OutcomeMode) {
  if (mode === 'loss') return 0;
  if (mode === 'win') return 3.42;
  return DEMO_MULTIPLIERS[round % DEMO_MULTIPLIERS.length] ?? 3.42;
}

export function useFishingGame() {
  const [state, setState] = useState<GameState>('idle');
  const [bet, setBet] = useState('10.00');
  const [roundBet, setRoundBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [history, setHistory] = useState<CatchResult[]>([]);
  const [mode, setMode] = useState<OutcomeMode>('mixed');
  const round = useRef(0);
  const locked = !['idle', 'win', 'loss'].includes(state);
  const amount = Number(bet);
  const valid = Number.isFinite(amount) && amount >= 0.1 && amount <= 1000;

  useEffect(() => {
    const next: Partial<Record<GameState, { delay: number; state: GameState }>> = {
      casting: { delay: 1100, state: 'waiting' },
      waiting: { delay: 3600, state: 'bite' },
    };
    const transition = next[state];
    if (!transition) return;
    const timer = window.setTimeout(() => setState(transition.state), transition.delay);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (state !== 'reeling') return;
    const target = getDemoMultiplier(round.current, mode);
    const interval = window.setInterval(() => setMultiplier(value => Math.min(value + 0.17, target || 1.24)), 100);
    const timer = window.setTimeout(() => {
      setMultiplier(target);
      setState(target > 0 ? 'win' : 'loss');
      setHistory(items => [{ id: round.current, multiplier: target, bet: roundBet, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }, ...items].slice(0, 8));
      round.current += 1;
    }, 2100);
    return () => { window.clearInterval(interval); window.clearTimeout(timer); };
  }, [state, mode, roundBet]);

  function action() {
    if (state === 'bite') { setState('reeling'); return; }
    if (locked || !valid) return;
    setRoundBet(amount);
    setMultiplier(1);
    setState('casting');
  }
  function adjust(value: number) { setBet(Math.min(1000, Math.max(0.1, value)).toFixed(2)); }
  return { state, bet, setBet, roundBet, multiplier, history, mode, setMode, locked, valid, action, adjust };
}