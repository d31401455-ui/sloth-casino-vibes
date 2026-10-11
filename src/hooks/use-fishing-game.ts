import { useEffect, useRef, useState } from 'react';

export type GameState = 'idle' | 'casting' | 'waiting' | 'bite' | 'hooked' | 'snapped' | 'cashed';
export type OutcomeMode = 'mixed' | 'win' | 'loss';
export type Tier = 'common' | 'rare' | 'epic' | 'legendary';
export type FishType = { id: string; name: string; tier: Tier; multiplier: number };
export type RoundResult = { id: number; multiplier: number; bet: number; time: string; catches: string[] };

export const FISH: Record<string, FishType> = {
  minnow: { id: 'minnow', name: 'Lazy Minnow', tier: 'common', multiplier: 1.25 },
  trout: { id: 'trout', name: 'River Trout', tier: 'common', multiplier: 1.45 },
  perch: { id: 'perch', name: 'Moon Perch', tier: 'rare', multiplier: 2.1 },
  walleye: { id: 'walleye', name: 'Night Walleye', tier: 'rare', multiplier: 3.2 },
  pike: { id: 'pike', name: 'Golden Pike', tier: 'epic', multiplier: 5.6 },
  leviathan: { id: 'leviathan', name: 'Deep Leviathan', tier: 'legendary', multiplier: 18 },
};

/** Scripted demo rounds: the listed fish bite in order, the next cast after the list snaps the line. */
export const DEMO_ROUNDS: string[][] = [
  ['trout', 'perch', 'walleye'],
  [],
  ['minnow', 'pike', 'trout'],
  ['perch', 'leviathan'],
  ['trout'],
];
const WIN_CYCLE = ['trout', 'perch', 'minnow', 'pike', 'walleye', 'leviathan'];

/** Returns the fish for the given cast, or null when the line snaps. */
export function getDemoCatch(round: number, cast: number, mode: OutcomeMode): FishType | null {
  if (mode === 'loss') return null;
  if (mode === 'win') return FISH[WIN_CYCLE[cast % WIN_CYCLE.length]];
  const script = DEMO_ROUNDS[round % DEMO_ROUNDS.length];
  const id = script[cast];
  return id ? FISH[id] : null;
}

export function totalMultiplier(catches: FishType[]) {
  return Math.round(catches.reduce((total, fish) => total * fish.multiplier, 1) * 100) / 100;
}

export function useFishingGame() {
  const [state, setState] = useState<GameState>('idle');
  const [bet, setBet] = useState('10.00');
  const [roundBet, setRoundBet] = useState(10);
  const [catches, setCatches] = useState<FishType[]>([]);
  const [pending, setPending] = useState<FishType | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [mode, setMode] = useState<OutcomeMode>('mixed');
  const round = useRef(0);
  const locked = !['idle', 'snapped', 'cashed'].includes(state);
  const amount = Number(bet);
  const valid = Number.isFinite(amount) && amount >= 0.1 && amount <= 1000;
  const multiplier = state === 'snapped' ? 0 : totalMultiplier(catches);

  function record(final: number, list: FishType[]) {
    const id = round.current;
    setHistory(items => [{ id, multiplier: final, bet: roundBet, catches: list.map(f => f.name), time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }, ...items].slice(0, 8));
    round.current += 1;
  }

  useEffect(() => {
    if (state === 'casting') {
      const t = window.setTimeout(() => setState('waiting'), 1100);
      return () => window.clearTimeout(t);
    }
    if (state === 'waiting') {
      const fish = getDemoCatch(round.current, catches.length, mode);
      const t = window.setTimeout(() => {
        if (fish) { setPending(fish); setState('bite'); }
        else { setState('snapped'); record(0, catches); }
      }, fish ? 4200 + catches.length * 700 : 3600);
      return () => window.clearTimeout(t);
    }
    if (state === 'bite') {
      const t = window.setTimeout(() => {
        setCatches(list => (pending ? [...list, pending] : list));
        setPending(null);
        setState('hooked');
      }, 1300);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function cast() {
    if (state === 'hooked') { setState('casting'); return; }
    if (locked || !valid) return;
    setRoundBet(amount);
    setCatches([]);
    setState('casting');
  }
  function cashOut() {
    if (state !== 'hooked') return;
    setState('cashed');
    record(totalMultiplier(catches), catches);
  }
  function adjust(value: number) { setBet(Math.min(1000, Math.max(0.1, value)).toFixed(2)); }
  return { state, bet, setBet, roundBet, multiplier, catches, pending, history, mode, setMode, locked, valid, cast, cashOut, adjust };
}
