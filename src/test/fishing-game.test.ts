import { describe, expect, it } from 'vitest';
import { getDemoCatch, totalMultiplier, FISH } from '@/hooks/use-fishing-game';

describe('Fishing demo catches', () => {
  it('follows the scripted round and snaps after the list', () => {
    expect(getDemoCatch(0, 0, 'mixed')?.id).toBe('trout');
    expect(getDemoCatch(0, 3, 'mixed')).toBeNull();
    expect(getDemoCatch(1, 0, 'mixed')).toBeNull();
  });
  it('supports win and loss previews', () => {
    expect(getDemoCatch(0, 10, 'win')).not.toBeNull();
    expect(getDemoCatch(0, 0, 'loss')).toBeNull();
  });
  it('multiplies catches together', () => {
    expect(totalMultiplier([FISH.trout, FISH.perch])).toBe(3.05);
    expect(totalMultiplier([])).toBe(1);
  });
});
